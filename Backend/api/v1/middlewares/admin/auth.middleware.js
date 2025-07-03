import { pool } from "../../../../config/database.js";

const requireAuthAdmnin = async (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        const admin = await pool.query({
            text: "SELECT * FROM accounts WHERE tokenAccount = $1",
            values: [token]
        });

        if (admin.rows.length === 0) {
            return res.json({
                code: 401,
                message: 'Token không hợp lệ'
            });
        }
        const { password, ...adminWithoutPassword } = admin.rows[0];
        req.admin = adminWithoutPassword;
        next();
    } else {
        return res.json({
            code: 400,
            message: 'Vui lòng gửi kèm token'
        });
    }
}

export default requireAuthAdmnin;