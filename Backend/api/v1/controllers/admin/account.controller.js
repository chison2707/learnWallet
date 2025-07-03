import { pool } from "../../../../config/database.js";
import { comparePassword } from "../../helper/password.js";

// [POST]/api/v1/admin/login
export const loginPost = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query({
      text: "SELECT * FROM accounts WHERE email = $1",
      values: [email],
    });

    const account = result.rows[0];

    if (!account) {
      return res.json({
        status: 400,
        message: "Địa chỉ email không đúng",
      });
    }

    const isMatch = await comparePassword(password, account.password);

    if (!isMatch) {
      return res.json({
        status: 400,
        message: "Mật khẩu không đúng!",
      });
    }
    const token = account.tokenuser;
    res.cookie("tokenAccount", token);

    return res.json({
      code: 200,
      message: "Đăng nhập thành công",
      tokenAccount: token,
    });

  } catch (error) {
    return res.json({
      status: 500,
      message: error.message
    })
  }
}