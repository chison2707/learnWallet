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

// [POST]/api/v1/admin/users/linkStudent
export const linkStudent = async (req, res) => {
    try {
        const { parentId, studentId } = req.body;

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