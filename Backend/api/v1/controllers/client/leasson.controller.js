import { pool } from "../../../../config/database.js";

// [POST] /api/v1/lessons/complete/:lessonId
export const completeLesson = async (req, res) => {
  try {
    const studentId = req.user.id;
    const roleStudent = req.user.role;
    if (roleStudent !== "student") {
      return res.json({
        code: 403,
        message: "Bạn không có quyền truy cập vào chức năng này."
      })
    }
    const { lessonId } = req.params;
    const { watchedDuration } = req.body;

    const lessonRes = await pool.query(
      `SELECT * FROM lessons WHERE id = $1`,
      [lessonId]
    );

    if (lessonRes.rowCount === 0) {
      return res.json({
        code: 404,
        message: "Không tìm thấy bài học"
      });
    }

    const { chapterid, position, duration, token, title } = lessonRes.rows[0];

    const previousChapters = await pool.query(
      `SELECT c.id FROM chapters c
       JOIN lessons l ON l.chapterId = c.id
       LEFT JOIN progress p ON p.lessonId = l.id AND p.studentId = $1
       WHERE c.id < $2 AND (p.completed IS DISTINCT FROM TRUE)
       LIMIT 1`,
      [studentId, chapterid]
    );

    if (previousChapters.rowCount > 0) {
      return res.status(400).json({
        code: 400,
        message: "Bạn cần hoàn thành các chương trước trước khi học chương này."
      });
    }


    const previousLessons = await pool.query(
      `SELECT l.id FROM lessons l LEFT JOIN progress p ON l.id = p.lessonId AND p.studentId = $1
       WHERE l.chapterId = $2 AND l.position < $3 AND (p.completed IS DISTINCT FROM TRUE)`,
      [studentId, chapterid, position]
    );

    if (previousLessons.rowCount > 0) {
      return res.json({
        code: 400,
        message: "Bạn cần hoàn thành các bài học trước đó trước khi học bài này."
      });
    }

    const watchedRatio = watchedDuration / duration;

    if (watchedRatio < 0.9) {
      return res.json({
        code: 400,
        message: "Bạn cần xem ít nhất 90% video để hoàn thành bài học."
      });
    }

    await pool.query("BEGIN");

    const progressRes = await pool.query(
      `SELECT * FROM progress WHERE studentId = $1 AND lessonId = $2`,
      [studentId, lessonId]
    );

    if (progressRes.rowCount === 0) {
      await pool.query(
        `INSERT INTO progress 
         (studentId, lessonId, watchedDuration, videoDuration, completed, completedAt) 
         VALUES ($1, $2, $3, $4, TRUE, NOW())`,
        [studentId, lessonId, watchedDuration, duration]
      );
    } else {
      await pool.query(
        `UPDATE progress 
         SET watchedDuration = $1, videoDuration = $2, completed = TRUE, completedAt = NOW(), updatedAt = NOW()
         WHERE studentId = $3 AND lessonId = $4`,
        [watchedDuration, duration, studentId, lessonId]
      );
    }

    await pool.query(
      `UPDATE wallets SET balance = balance + $1, updatedAt = NOW() 
       WHERE studentId = $2`,
      [token, studentId]
    );

    await pool.query(
      `INSERT INTO transactions (studentId, lessonId, amount, type, description)
       VALUES ($1, $2, $3, 'reward', $4)`,
      [studentId, lessonId, token, `Thưởng token khi hoàn thành bài học ${title}`]
    );

    await pool.query("COMMIT");

    return res.json({
      code: 200,
      message: "Hoàn thành bài học và nhận token thành công!"
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    res.json({
      code: 500,
      error: error.message
    });
  }
};