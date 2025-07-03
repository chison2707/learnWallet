import { pool } from "../../../../config/database.js";

// [GET] /api/v1/parents/progress/:studentId
export const getStudentProgress = async (req, res) => {
  try {
    const parentId = req.user.id;
    const role = req.user.role;
    const { studentId } = req.params;

    if (role !== "parent") {
      return res.json({
        code: 403,
        message: "Bạn không có quyền truy cập chức năng này."
      });
    }

    const checkLink = await pool.query(
      `SELECT * FROM parent_student WHERE parent_id = $1 AND student_id = $2`,
      [parentId, studentId]
    );

    if (checkLink.rowCount === 0) {
      return res.json({
        code: 403,
        message: "Bạn không được phép xem tiến độ học viên này."
      });
    }

    const student = await pool.query(`SELECT fullName, email, phone FROM users WHERE id = $1 AND role = 'student'`, [studentId]);
    const wallet = await pool.query(`SELECT * FROM wallets WHERE studentId = $1`, [studentId]);
    const transactions = await pool.query(`SELECT * FROM transactions WHERE studentId = $1`, [studentId]);

    const progressRes = await pool.query(`
      SELECT 
        l.title AS lessonTitle,
        c.title AS chapterTitle,
        co.title AS courseTitle,
        p.completed,
        p.completedAt,
        p.watchedDuration,
        p.videoDuration,
        t.amount AS tokenRewarded
      FROM progress p
      JOIN lessons l ON l.id = p.lessonId
      JOIN chapters c ON c.id = l.chapterId
      JOIN courses co ON co.id = c.courseId
      LEFT JOIN transactions t 
        ON t.lessonId = l.id AND t.studentId = p.studentId AND t.type = 'reward'
      WHERE p.studentId = $1
      ORDER BY p.completedAt DESC
    `, [studentId]);

    return res.json({
      code: 200,
      message: "Lấy tiến độ học viên thành công.",
      student: student.rows[0],
      wallet: wallet.rows[0],
      transactions: transactions.rows,
      progress: progressRes.rows
    });

  } catch (err) {
    return res.json({
      code: 500,
      error: err.message
    });
  }
};