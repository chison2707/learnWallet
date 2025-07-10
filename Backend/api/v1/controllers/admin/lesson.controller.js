import { pool } from "../../../../config/database.js";
import paginationHelper from "../../helper/pagination.js";

// [POST]/api/v1/admin/lessons/createLesson
export const createLeasson = async (req, res) => {
  const { title, chapterId, videoUrl, position, duration, token } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO lessons (title, "chapterId", "videoUrl", position,duration,token )
       VALUES ($1, $2, $3, $4, $5,$6)
       RETURNING *`,
      [title, chapterId, videoUrl, position, duration, token]
    );
    res.json({
      code: 200,
      message: "Thêm bài học thành công!",
      data: result.rows[0]
    });
  } catch (err) {
    res.json({
      code: 500,
      error: err.message
    });
  }
};

// [GET]/api/v1/admin/lessons/
export const index = async (req, res) => {
  // pagination
  const countChapter = await pool.query(' SELECT COUNT(*) FROM lessons');
  const countRecords = countChapter.rows[0].count;

  let objPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 10
    },
    req.query,
    countRecords
  );
  // end pagination

  const lessons = await pool.query(
    ' SELECT * FROM lessons LIMIT $1 OFFSET $2',
    [objPagination.limitItems, objPagination.skip]
  );

  res.json({
    lessons: lessons.rows,
    totalPage: objPagination.totalPage
  });
}

// [GET]/api/v1/admin/lessons/:leassonId 
export const getDetail = async (req, res) => {
  const { leassonId } = req.params;

  const result = await pool.query('SELECT * FROM lessons WHERE id = $1', [leassonId]);

  res.json({
    code: 200,
    course: result.rows[0]
  });
}

// [PATCH] /api/v1/admin/lessons/changeStatus/:leassonId?status=
export const changeStatus = async (req, res) => {
  const { leassonId } = req.params;
  const { status } = req.query;

  const validStatuses = ['active', 'inactive'];
  if (!validStatuses) {
    return res.json({
      code: 400,
      message: 'Trạng thái không hợp lệ'
    });
  }
  try {
    const leassonResult = await pool.query(
      `UPDATE lessons 
       SET status = $1, updatedAt = CURRENT_TIMESTAMP 
       WHERE id = $2 RETURNING *`,
      [status, leassonId]
    );

    if (leassonResult.rows.length === 0) {
      return res.json({
        code: 404,
        message: 'Không tìm thấy chương học'
      });
    }

    return res.json({
      code: 200,
      message: `Cập nhật trạng thái khóa học và các thành phần liên quan thành công`,
      data: leassonResult.rows[0]
    });
  } catch (err) {
    res.json({
      code: 500,
      error: err.message
    });
  }
};

// [PATCH]/api/v1/admin/lessons/editLeasson/:leassonId
export const editLeasson = async (req, res) => {
  try {
    const { leassonId } = req.params;
    const { title, videoUrl, position, duration, token } = req.body;

    let result;

    if (videoUrl) {
      result = await pool.query(
        `UPDATE lessons
         SET title = $1, position = $2, videoUrl = $3,duration= $4,token =$5 updatedAt = CURRENT_TIMESTAMP
         WHERE id = $6 RETURNING *`,
        [title, position, videoUrl, duration, token, leassonId]
      );
    } else {
      result = await pool.query(
        `UPDATE lessons
         SET title = $1, position = $2,token = $3 updatedAt = CURRENT_TIMESTAMP
         WHERE id = $4 RETURNING *`,
        [title, position, token, leassonId]
      );
    }

    if (result.rows.length === 0) {
      return res.json({
        code: 404,
        message: 'Không tìm thấy bài học!'
      });
    }

    res.json({
      code: 200,
      message: 'Cập nhật bài học thành công!',
      data: result.rows[0]
    });

  } catch (err) {
    res.json({
      code: 500,
      error: err.message
    });
  }
};

// [DELETE]/api/v1/admin/lessons/deleteLeason/:leassonId
export const deleteLeasson = async (req, res) => {
  try {
    const { leassonId } = req.params;
    const result = await pool.query('DELETE FROM lessons WHERE id = $1 RETURNING *', [leassonId]);
    if (result.rows.length === 0) {
      return res.json({
        code: 404,
        message: 'Không tìm thấy bài học!'
      });
    }
    return res.json({
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