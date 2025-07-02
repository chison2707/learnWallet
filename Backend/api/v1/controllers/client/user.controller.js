import { pool } from "../../../../config/database.js";
import { comparePassword, hashPassword } from "../../helper/password.js";
import { generateRandomNumber } from "../../helper/generate.js";
import { sendMail } from "../../helper/sendMail.js";

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