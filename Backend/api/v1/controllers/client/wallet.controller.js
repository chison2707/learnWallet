import { pool } from "../../../../config/database.js";

// [GET]/api/v1/wallet
export const getWallet = async (req, res) => {
    const roleStudent = req.user.role;
    const studentId = req.user.id;
    if (roleStudent !== 'student') {
        const result = await pool.query(
            'SELECT balance FROM wallets WHERE studentId = $1',
            [studentId]
        );

        res.json({
            code: 200,
            message: "Lấy thông tin ví thành công",
            balance: result.rows[0]
        });
    } else {
        res.json({
            code: 403,
            message: "Bạn không có quyền truy cập vào ví"
        });
    }
}