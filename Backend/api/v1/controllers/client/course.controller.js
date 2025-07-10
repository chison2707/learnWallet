import { pool } from "../../../../config/database.js";

// [GET] /api/v1/courses
export const getCourses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM courses WHERE status = 'active' ORDER BY "createdAt" DESC`);

    return res.json({
      code: 200,
      message: "Lấy danh sách khoá học thành công.",
      courses: result.rows
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ.",
      error: error.message
    });
  }
};

// [GET] /api/v1/courses/:courseId
export const getChapters = async (req, res) => {
  try {
    const { courseId } = req.params;

    const chaptersRes = await pool.query(`
      SELECT id, title, position, status, "createdAt", "updatedAt"
      FROM chapters
      WHERE "courseId" = $1 AND status = 'active'
      ORDER BY position ASC
    `, [courseId]);

    return res.json({
      code: 200,
      message: "Lấy danh sách chương thành công.",
      chapters: chaptersRes.rows
    });

  } catch (error) {
    return res.json({
      code: 500,
      message: "Đã xảy ra lỗi khi lấy chương học.",
      error: error.message
    });
  }
};

// [GET] /api/v1/courses/chapter/:chapterId
export const getLessons = async (req, res) => {
  try {
    const { chapterId } = req.params;

    const result = await pool.query(`
      SELECT id, title, "videoUrl", position, duration, token, status, "createdAt", "updatedAt"
      FROM lessons
      WHERE "chapterId" = $1 AND status = 'active'
      ORDER BY position ASC
    `, [chapterId]);

    return res.json({
      code: 200,
      message: "Lấy danh sách bài học thành công.",
      lessons: result.rows
    });

  } catch (error) {
    return res.json({
      code: 500,
      error: error.message
    });
  }
};