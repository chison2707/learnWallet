import { pool } from "../../../../config/database.js";
import paginationHelper from "../../helper/pagination.js";

// [GET]/api/v1/admin/chapters/
export const index = async (req, res) => {
  // pagination
  const countChapter = await pool.query(' SELECT COUNT(*) FROM chapters');
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

  const chapters = await pool.query(
    ' SELECT * FROM chapters LIMIT $1 OFFSET $2',
    [objPagination.limitItems, objPagination.skip]
  );

  res.json({
    chapters: chapters.rows,
    totalPage: objPagination.totalPage
  });
}

// [GET]/api/v1/admin/chapters/:chapterId 
export const getDetail = async (req, res) => {
  const { chapterId } = req.params;

  const result = await pool.query('SELECT * FROM chapters WHERE id = $1', [chapterId]);

  res.json({
    code: 200,
    course: result.rows[0]
  });
}

// [POST]/api/v1/admin/chapters/createChapter 
export const createChapter = async (req, res) => {
  const { title, courseId, position } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO chapters (title, "courseId", position)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, courseId, position]
    );
    res.json({
      code: 200,
      message: "Thêm chương học thành công!",
      data: result.rows[0]
    });
  } catch (err) {
    res.json({
      code: 500,
      error: err.message
    });
  }
};

// [PATCH] /api/v1/admin/chapters/changeStatus/:chapterId?status=
export const changeStatus = async (req, res) => {
  const { chapterId } = req.params;
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

    const chapterResult = await pool.query(
      `UPDATE chapters 
       SET status = $1, updatedAt = CURRENT_TIMESTAMP 
       WHERE id = $2 RETURNING *`,
      [status, chapterId]
    );

    if (chapterResult.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.json({
        code: 404,
        message: 'Không tìm thấy chương học'
      });
    }


    await pool.query(
      `UPDATE lessons 
       SET status = $1, updatedAt = CURRENT_TIMESTAMP 
       WHERE chapterId= $2`,
      [status, chapterId]
    );

    await pool.query('COMMIT');

    res.json({
      code: 200,
      message: `Cập nhật trạng thái khóa học và các thành phần liên quan thành công`,
      data: chapterResult.rows[0]
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    res.json({
      code: 500,
      error: err.message
    });
  }
};

// [PATCH]/api/v1/admin/chapters/editChapter/:chapterId
export const editChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { title, position } = req.body;

    const result = await pool.query(
      `UPDATE chapters
         SET title = $1, position = $2, updatedAt = CURRENT_TIMESTAMP
         WHERE id = $3 RETURNING *`,
      [title, position, chapterId]
    );

    if (result.rows.length === 0) {
      return res.json({
        code: 404,
        message: 'Không tìm thấy chương học!'
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

// [DELETE]/api/v1/admin/chapters/deleteChapter/:chapterId
export const deleteChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const result = await pool.query('DELETE FROM chapters WHERE id = $1 RETURNING *', [chapterId]);
    if (result.rows.length === 0) {
      return res.json({
        code: 404,
        message: 'Không tìm thấy chương học!'
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