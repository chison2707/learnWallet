import { pool } from "../../../../config/database.js";
import paginationHelper from "../../helper/pagination.js";

// [GET]/api/v1/admin/courses/
export const index = async (req, res) => {
  // pagination
  const countCourse = await pool.query(' SELECT COUNT(*) FROM courses');
  const countRecords = countCourse.rows[0].count;

  let objPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 10
    },
    req.query,
    countRecords
  );
  // end pagination

  const courses = await pool.query(
    ' SELECT * FROM courses LIMIT $1 OFFSET $2',
    [objPagination.limitItems, objPagination.skip]
  );

  res.json({
    courses: courses.rows,
    totalPage: objPagination.totalPage
  });
}

// [GET]/api/v1/admin/courses/:courseId 
export const getDetail = async (req, res) => {
  const { courseId } = req.params;

  const result = await pool.query('SELECT * FROM courses WHERE id = $1', [courseId]);

  res.json({
    code: 200,
    course: result.rows[0]
  });
}

// [POST]/api/v1/admin/courses/createCourse 
export const createCourse = async (req, res) => {
  const { title, description, thumbnail } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO courses (title, description, thumbnail)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, description, thumbnail]
    );
    res.json({
      code: 200,
      message: "Thêm khóa học thành công!",
      data: result.rows[0]
    });
  } catch (err) {
    res.json({
      code: 500,
      error: err.message
    });
  }
};

// [PATCH] /api/v1/admin/courses/changeStatus/:courseId?status=
export const changeStatus = async (req, res) => {
  const { courseId } = req.params;
  const { status } = req.query;

  const validStatuses = ['active', 'inactive'];
  if (!validStatuses) {
    return res.json({
      code: 400,
      message: 'Trạng thái không hợp lệ'
    });
  }

  try {
    await pool.query('BEGIN');

    const courseResult = await pool.query(
      `UPDATE courses 
       SET status = $1, updatedAt = CURRENT_TIMESTAMP 
       WHERE id = $2 RETURNING *`,
      [status, courseId]
    );

    if (courseResult.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.json({
        code: 404,
        message: 'Không tìm thấy khóa học'
      });
    }

    await pool.query(
      `UPDATE chapters 
       SET status = $1, updatedAt = CURRENT_TIMESTAMP 
       WHERE courseId = $2`,
      [status, courseId]
    );

    await pool.query(
      `UPDATE lessons 
       SET status = $1, updatedAt = CURRENT_TIMESTAMP 
       WHERE chapterId IN (
         SELECT id FROM chapters WHERE courseId = $2
       )`,
      [status, courseId]
    );

    await pool.query('COMMIT');

    res.json({
      code: 200,
      message: `Cập nhật trạng thái khóa học và các thành phần liên quan thành công`,
      data: courseResult.rows[0]
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    res.json({
      code: 500,
      error: err.message
    });
  }
};

// [PATCH]/api/v1/admin/courses/editCourse/:courseId
export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, thumbnail } = req.body;

    let result;

    if (thumbnail) {
      result = await pool.query(
        `UPDATE courses
         SET title = $1, description = $2, thumbnail = $3, updatedAt = CURRENT_TIMESTAMP
         WHERE id = $4 RETURNING *`,
        [title, description, thumbnail, courseId]
      );
    } else {
      result = await pool.query(
        `UPDATE courses
         SET title = $1, description = $2, updatedAt = CURRENT_TIMESTAMP
         WHERE id = $3 RETURNING *`,
        [title, description, courseId]
      );
    }

    if (result.rows.length === 0) {
      return res.json({
        code: 404,
        message: 'Không tìm thấy khóa học!'
      });
    }

    res.json({
      code: 200,
      message: 'Cập nhật khóa học thành công!',
      data: result.rows[0]
    });

  } catch (err) {
    res.json({
      code: 500,
      error: err.message
    });
  }
};

// [DELETE]/api/v1/admin/courses/deleteCousrse/:courseId
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const result = await pool.query('DELETE FROM courses WHERE id = $1 RETURNING *', [courseId]);
    if (result.rows.length === 0) {
      return res.json({
        code: 404,
        message: 'Không tìm thấy khóa học!'
      });
    }
    res.json({
      code: 200,
      message: 'Xóa thành công!'
    });
  } catch (err) {
    res.json({
      code: 500,
      error: err.message
    });
  }
};