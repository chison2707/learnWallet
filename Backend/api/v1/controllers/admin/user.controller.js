import { pool } from "../../../../config/database.js";
import { hashPassword } from "../../helper/password.js";
import { generateRandomString } from "../../helper/token.js";

// [POST]/api/v1/admin/users/createUser
export const createUser = async (req, res) => {
    try {
        const { fullName, email, password, phone, role } = req.body;

        const userExist = await pool.query({
            text: "SELECT EXISTS (SELECT * FROM users WHERE email = $1)",
            values: [email]
        });

        if (userExist.rows[0].exists) {
            return res.json({
                status: 400,
                message: "Địa chỉ email đã tồn tại!"
            });
        }

        const hashedPassword = await hashPassword(password);
        const tokenUser = generateRandomString(14);

        const user = await pool.query({
            text: `
                INSERT INTO users (fullName, email,phone, password, tokenUser,role)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `,
            values: [fullName, email, phone, hashedPassword, tokenUser, role]
        });

        res.json({
            status: 200,
            message: "Tạo tài khoản thành công!",
            user: user.rows[0]
        })

    } catch (error) {
        return res.json({
            status: 500,
            message: error.message
        })
    }
}