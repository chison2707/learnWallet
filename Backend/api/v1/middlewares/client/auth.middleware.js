import { pool } from "../../../../config/database.js";

export const requireAuth = async (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        const user = await pool.query({
            text: `SELECT * FROM users WHERE "tokenUser" = $1`,
            values: [token]
        });

        if (user.rows.length === 0) {
            return res.json({
                code: 401,
                message: 'Token không hợp lệ'
            });
        }
        const { password, ...userWithoutPassword } = user.rows[0];
        req.user = userWithoutPassword;
        next();
    } else {
        return res.json({
            code: 400,
            message: 'Vui lòng gửi kèm token'
        });
    }
}