import { pool } from "../../../../config/database.js";

const COMPLETION_THRESHOLD = parseFloat(process.env.COMPLETION_THRESHOLD || "0.9");
// [POST] /api/v1/lessons/complete/:lessonId
export const completeLesson = async (req, res) => {
  const studentId = req.user.id;
  const roleStudent = req.user.role;

  try {
    if (roleStudent !== "student") {
      return res.json({
        code: 403,
        message: "Bạn không có quyền truy cập vào chức năng này."
      });
    }

    const { lessonId } = req.params;
    const watchedDurationRaw = req.body.watchedDuration;

    const progressCheck = await pool.query(
      `SELECT COUNT(*) FROM progress WHERE "studentId"=$1 AND "lessonId" = $2 AND completed = TRUE`,
      [studentId, lessonId]
    );

    if (parseInt(progressCheck.rows[0].count, 10) > 0) {
      return res.json({
        code: 200,
        message: "Bạn đã học bài học này rồi. Chuyển sang bài khác nhé!"
      });
    }

    const lessonRes = await pool.query(
      `SELECT id, "chapterId", position, duration, token, title FROM lessons WHERE id = $1`,
      [lessonId]
    );

    if (lessonRes.rowCount === 0) {
      return res.json({
        code: 404,
        message: "Không tìm thấy bài học"
      });
    }

    const { "chapterId": chapterId, position, duration, token, title } = lessonRes.rows[0];

    const videoDuration = Math.floor(duration);
    const watchedDuration = Math.floor(watchedDurationRaw) + 1;
    const watchedRatio = videoDuration > 0 ? watchedDuration / videoDuration : 0;

    await pool.query("BEGIN");

    const progressRes = await pool.query(
      `SELECT * FROM progress WHERE "studentId" = $1 AND "lessonId" = $2`,
      [studentId, lessonId]
    );

    // TH1: Chưa xem đủ 90% thời lượng
    if (watchedRatio < COMPLETION_THRESHOLD) {
      if (progressRes.rowCount === 0) {
        await pool.query(
          `INSERT INTO progress ("studentId", "lessonId", "watchedDuration", "videoDuration", completed) 
         VALUES ($1, $2, $3, $4, FALSE)`,
          [studentId, lessonId, watchedDuration, videoDuration]
        );
      } else if (!progressRes.rows[0].completed) {
        await pool.query(
          `UPDATE progress 
         SET "watchedDuration" = $1, "videoDuration" = $2, "updatedAt" = NOW()
         WHERE "studentId" = $3 AND "lessonId" = $4`,
          [watchedDuration, videoDuration, studentId, lessonId]
        );
      }
      await pool.query("COMMIT");
      return res.json({
        code: 200,
        message: "Đã lưu tiến độ xem video (chưa hoàn thành bài học)."
      });
    }

    // TH2: Đã xem đủ 90% thời lượng
    const previousChapters = await pool.query(
      `SELECT 1 FROM chapters c
     JOIN lessons l ON l."chapterId" = c.id
     LEFT JOIN progress p ON p."lessonId" = l.id AND p."studentId" = $1
     WHERE c."courseId" = (SELECT "courseId" FROM chapters WHERE id = $2)
     AND c.position < (SELECT position FROM chapters WHERE id = $2)
     AND (p.completed IS DISTINCT FROM TRUE)
     LIMIT 1`,
      [studentId, chapterId]
    );

    if (previousChapters.rowCount > 0) {
      await pool.query("ROLLBACK");
      return res.json({
        code: 400,
        message: "Bạn cần hoàn thành các chương trước trước khi học chương này."
      });
    }

    const previousLessons = await pool.query(
      `SELECT 1 FROM lessons l 
     LEFT JOIN progress p ON l.id = p."lessonId" AND p."studentId" = $1
     WHERE l."chapterId" = $2 AND l.position < $3 AND (p.completed IS DISTINCT FROM TRUE)
     LIMIT 1`,
      [studentId, chapterId, position]
    );

    if (previousLessons.rowCount > 0) {
      await pool.query("ROLLBACK");
      return res.json({
        code: 400,
        message: "Bạn cần hoàn thành các bài học trước đó trước khi học bài này."
      });
    }

    // Cập nhật tiến độ là đã hoàn thành
    const finalWatchedDuration = Math.min(watchedDuration, videoDuration);
    if (progressRes.rowCount === 0) {
      await pool.query(`INSERT INTO progress ("studentId", "lessonId", "watchedDuration", "videoDuration", completed, "completedAt") 
        VALUES ($1, $2, $3, $4, TRUE, NOW())`,
        [studentId, lessonId, finalWatchedDuration, videoDuration]);
    } else {
      await pool.query(`UPDATE progress SET "watchedDuration" = $1, "videoDuration" = $2, completed = TRUE, "completedAt" = NOW(), 
        "updatedAt" = NOW() WHERE "studentId" = $3 AND "lessonId" = $4`,
        [finalWatchedDuration, videoDuration, studentId, lessonId]);
    }

    // Cộng token thưởng
    await pool.query(`UPDATE wallets SET balance = balance + $1, "updatedAt" = NOW() WHERE "studentId" = $2`,
      [token, studentId]);
    await pool.query(`INSERT INTO transactions ("studentId", "lessonId", amount, type, description) VALUES ($1, $2, $3, 'reward', $4)`,
      [studentId, lessonId, token, `Thưởng token khi hoàn thành bài học ${title}`]);

    await pool.query("COMMIT");

    return res.json({
      code: 200,
      message: "Hoàn thành bài học và nhận token thành công!"
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    return res.json({
      code: 500,
      error: error.message
    });
  }
};