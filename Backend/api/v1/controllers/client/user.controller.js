import { pool } from "../../../../config/database.js";
import { comparePassword, hashPassword } from "../../helper/password.js";
import { generateRandomString } from "../../helper/token.js";

// [POST]/api/v1/users/register
export const register = async (req, res) => {
  try {
    const { fullName, email, phone, password, role, studentIds } = req.body;

    const checkEmail = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (checkEmail.rows.length > 0) {
      return res.json({
        code: 400,
        message: "Email đã tồn tại"
      });
    }

    const checkPhone = await pool.query(
      "SELECT * FROM users WHERE phone = $1",
      [phone]
    );

    if (checkPhone.rows.length > 0) {
      return res.json({
        code: 400,
        message: "Số điện thoại đã tồn tại"
      });
    }

    const hashedPassword = await hashPassword(password);
    const tokenUser = generateRandomString(16);

    const result = await pool.query(
      `INSERT INTO users ("fullName", email, phone, password, role,"tokenUser")
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [fullName, email, phone, hashedPassword, role, tokenUser]
    );

    const userId = result.rows[0].id;

    if (role === "student") {
      await pool.query(
        `INSERT INTO wallets ("studentId", balance) VALUES ($1, $2)`,
        [userId, 0]
      );
    }

    if (role === "parent") {
      if (studentIds.length === 0) {
        return res.json({
          code: 400,
          message: "Phụ huynh cần nhập mã học viên để liên kết"
        });
      }

      for (const sid of studentIds) {
        const studentCheck = await pool.query(
          "SELECT * FROM users WHERE id = $1 AND role = 'student'",
          [sid]
        );

        if (studentCheck.rows.length === 0) {
          return res.json({
            code: 404,
            message: `Học viên với ID ${sid} không tồn tại`
          });
        }

        await pool.query(
          "INSERT INTO parent_student (parent_id, student_id) VALUES ($1, $2)",
          [userId, sid]
        );
      }
    }

    return res.json({
      code: 200,
      message: "Đăng ký thành công",
      userId,
      token: tokenUser
    });
  } catch (error) {
    return res.json({
      code: 500,
      message: error.message
    });
  }
};
// [POST]/api/v1/users/login
export const loginPost = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query({
      text: "SELECT * FROM users WHERE email = $1 AND status = 'active'",
      values: [email],
    });

    const user = result.rows[0];

    if (!user) {
      return res.json({
        status: 400,
        message: "Địa chỉ email không đúng",
      });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.json({
        status: 400,
        message: "Mật khẩu không đúng!",
      });
    }
    const token = user.tokenUser;

    res.cookie("tokenUser", token);

    res.json({
      code: 200,
      message: "Đăng nhập thành công",
      token: token,
    });

  } catch (error) {
    return res.json({
      status: 500,
      message: error.message
    })
  }
}

// [GET]/api/v1/users/detail
export const detail = async (req, res) => {
  res.json({
    code: 200,
    message: "Lấy thông tin thành công!",
    infor: req.user
  });
};

// [GET]/api/v1/users/getStudent
export const getStudent = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user.id;

    if (role !== "parent") {
      return res.json({
        code: 403,
        message: "Bạn không có quyền truy cập chức năng này."
      });
    }

    const result = await pool.query(`
      SELECT 
        users.id, users.fullName, users.email, users.phone
      FROM parent_student ps
      JOIN users  ON users.id = ps.student_id
      WHERE ps.parent_id = $1
    `, [userId]);

    return res.json({
      code: 200,
      message: "Lấy danh sách học viên thành công.",
      students: result.rows
    });

  } catch (error) {
    return res.json({
      code: 500,
      message: error.message
    });

  }
};

// [GET]/api/v1/users/getListStudent
export const getListStudent = async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, "fullName", email, phone FROM users where role = 'student'`);

    return res.json({
      code: 200,
      message: "Lấy danh sách học viên thành công.",
      students: result.rows
    });

  } catch (error) {
    return res.json({
      code: 500,
      message: error.message
    });

  }
};