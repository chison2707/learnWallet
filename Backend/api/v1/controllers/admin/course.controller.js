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