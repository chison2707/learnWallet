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

// [POST]/api/v1/users/linkStudent
export const linkStudent = async (req, res) => {
  try {
    const parentId = req.user.id;
    const studentId = req.body.studentId;

    const studentRes = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND role = $2',
      [studentId, 'student']
    );

    if (studentRes.rows.length === 0) {
      return res.json({
        code: 400,
        message: 'Không tìm thấy học viên hợp lệ!'
      });
    }

    const checkLink = await pool.query(
      'SELECT * FROM parent_student WHERE parent_id = $1 AND student_id = $2',
      [parentId, studentId]
    );

    if (checkLink.rows.length > 0) {
      return res.json({
        code: 400,
        error: 'Đã liên kết học viên này rồi!'
      });
    }

    // Tiến hành liên kết
    await pool.query(
      'INSERT INTO parent_student (parent_id, student_id) VALUES ($1, $2)',
      [parentId, studentId]
    );

    res.json({
      code: 200,
      message: 'Liên kết học viên thành công'
    });

  } catch (error) {
    res.json({
      status: 500,
      message: error.message
    });
  }
}

// [PATCH]/api/v1/users/edit/:userId
export const editUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const { fullName, phone } = req.body;

    const updatedUser = await pool.query({
      text: `UPDATE tbluser SET fullName = $1, phone = $2, 
            updatedAt = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *`,
      values: [fullName, phone, userId],
    });

    return res.json({
      status: 200,
      message: "Thay đổi thông tin thành công!",
      infor: updatedUser
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error.message
    });
  }
};

// [POST] /api/v1/users/password/forgot
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const userQuery = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (userQuery.rows.length === 0) {
    return res.json({
      code: 400,
      message: 'Email không tồn tại'
    });
  }

  const otp = generateRandomNumber(6);
  const expireAt = new Date(Date.now() + 5 * 60 * 1000);

  await pool.query(
    'INSERT INTO forgotPassword (email, otp, expireAt) VALUES ($1, $2, $3)',
    [email, otp, expireAt]
  );

  const subject = 'Mã OTP để lấy lại mật khẩu';
  const html = `Mã OTP của bạn là <b>${otp}</b>. Không chia sẻ với bất kỳ ai.`;

  sendMail(email, subject, html);

  res.json({
    code: 200,
    message: 'Đã gửi mã OTP qua email'
  });
};

// [POST] /api/v1/users/password/otp
export const otpPassword = async (req, res) => {
  const { email, otp } = req.body;

  const otpQuery = await pool.query(
    'SELECT * FROM forgotPassword WHERE email = $1 AND otp = $2 AND expire_at > NOW() ORDER BY expireAt DESC LIMIT 1',
    [email, otp]
  );

  if (otpQuery.rows.length === 0) {
    return res.json({
      code: 400,
      message: 'Mã OTP không đúng hoặc đã hết hạn'
    });
  }

  const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = userQuery.rows[0];

  const token = user.tokenUser;
  res.cookie('token', token);

  res.json({
    code: 200,
    message: 'Xác thực thành công!',
    token
  });
};

//[POST] /api/v1/users/password/reset
export const resetPassword = async (req, res) => {
  const token = req.user.tokenUser;
  const password = req.body.password;

  const userQuery = await pool.query('SELECT * FROM users WHERE token = $1', [token]);

  if (userQuery.rows.length === 0) {
    return res.json({
      code: 400,
      message: 'Token không hợp lệ'
    });
  }

  const user = userQuery.rows[0];
  const isSame = await comparePassword(password, user.password);

  if (isSame) {
    return res.json({
      code: 400,
      message: 'Mật khẩu đã tồn tại!'
    });
  }

  const hashedPassword = await hashPassword(password);

  await pool.query(
    'UPDATE users SET password = $1 WHERE id = $2',
    [hashedPassword, user.id]
  );

  res.json({
    code: 200,
    message: 'Đặt lại mật khẩu thành công'
  });
};