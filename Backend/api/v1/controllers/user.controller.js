import { pool } from "../../../config/database.js";
import { comparePassword, hashPassword } from "../helper/password.js";
import { generateRandomString } from "../helper/token.js";

// [POST]/api/v1/users/register
export const register = async (req, res) => {
  try {
    const { fullName, email, phone, password, role, studentId } = req.body;

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

    const hashedPassword = await hashPassword(password);
    const tokenUser = generateRandomString(16);

    const result = await pool.query(
      `INSERT INTO users (fullName, email, phone, password, role,tokenUser)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [fullName, email, phone, hashedPassword, role, tokenUser]
    );

    const userId = result.rows[0].id;

    if (role === "student") {
      await pool.query(
        "INSERT INTO wallets (studentId, balance) VALUES ($1, $2)",
        [userId, 0]
      );
    }

    if (role === "parent") {
      if (!studentId) {
        return res.json({
          code: 400,
          message: "Phụ huynh cần nhập mã học viên để liên kết"
        });
      }

      const studentCheck = await pool.query("SELECT * FROM users WHERE id = $1 AND role = 'student'", [studentId]);
      if (studentCheck.rows.length === 0) {
        return res.json({
          code: 404,
          message: "Học viên không tồn tại"
        });
      }

      await pool.query(
        "INSERT INTO parent_student (parent_id, student_id) VALUES ($1, $2)",
        [userId, studentId]
      );
    }

    res.json({
      code: 200,
      message: "Đăng ký thành công",
      userId,
    });
  } catch (error) {
    console.error("Lỗi trong register:", error);
    res.json({
      code: 500,
      message: "Lỗi server"
    });
  }
};
// [POST]/api/v1/users/login
export const loginPost = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query({
      text: "SELECT * FROM users WHERE email = $1",
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
    const token = user.tokenuser;
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