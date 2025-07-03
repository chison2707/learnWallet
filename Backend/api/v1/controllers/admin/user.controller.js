import { pool } from "../../../../config/database.js";
import paginationHelper from "../../helper/pagination.js";

// [GET]/api/v1/admin/users/
export const index = async (req, res) => {
  // pagination
  const countUser = await pool.query(' SELECT COUNT(*) FROM users');
  const countRecords = countUser.rows[0].count;

  let objPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 10
    },
    req.query,
    countRecords
  );
  // end pagination

  const users = await pool.query(
    ' SELECT id, fullName, email, phone, role, tokenUser, createdAt FROM users LIMIT $1 OFFSET $2',
    [objPagination.limitItems, objPagination.skip]
  );

  res.json({
    users: users.rows,
    totalPage: objPagination.totalPage
  });
}

// [PATCH]/api/v1/admin/users/changeStatus/:userId?status=
export const changeStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    const user = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );

    const userInfor = user.rows[0];

    if (userInfor.role === 'student') {
      const parentResult = await pool.query(
        `SELECT parent_id FROM parent_student WHERE student_id = $1`,
        [userId]
      );

      if (parentResult.rows.length === 0) {
        return res.status(400).json({
          code: 400,
          message: "Học sinh này chưa có phụ huynh liên kết"
        });
      }

      const parentId = parentResult.rows[0].parent_id;

      const parentStatusResult = await pool.query(
        `SELECT status FROM users WHERE id = $1 AND role = 'parent'`,
        [parentId]
      );

      if (parentStatusResult.rows.length === 0 || parentStatusResult.rows[0].status !== 'active') {
        return res.status(403).json({
          code: 403,
          message: "Không thể cập nhật trạng thái vì phụ huynh chưa được kích hoạt!"
        });
      }

      await pool.query(
        `UPDATE users SET status = $1 WHERE id = $2`,
        [status, userId]
      );

      await pool.query(
        `UPDATE wallets SET status = $1 WHERE studentId = $2`,
        [status, userId]
      );

      return res.json({
        code: 200,
        message: "Cập nhật trạng thái thành công!"
      });
    }

    if (userInfor.role === 'parent') {
      await pool.query(
        'UPDATE users SET status = $1 WHERE id = $2',
        [status, userId]
      );

      const childrenResult = await pool.query(
        `SELECT student_id FROM parent_student WHERE parent_id = $1`,
        [userId]
      );

      const studentIds = childrenResult.rows.map(row => row.student_id);

      if (studentIds.length > 0) {
        await pool.query(
          `UPDATE users SET status = $1 WHERE id = ANY($2::int[])`,
          [status, studentIds]
        );

        await pool.query(
          `UPDATE wallets SET status = $1 WHERE studentId = ANY($2::int[])`,
          [status, studentIds]
        );
      }

      return res.json({
        code: 200,
        message: "Cập nhật trạng thái phụ huynh và học sinh thành công"
      });
    }
  } catch (error) {
    return res.json({
      code: 500,
      error: error.message
    })
  }
}