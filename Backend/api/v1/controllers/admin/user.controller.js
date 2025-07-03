import { pool } from "../../../../config/database.js";
import paginationHelper from "../../helper/pagination.js";

// [GET]/api/v1/admin/users/
export const index = async (req, res) => {
    // pagination
    const countUser = await pool.query(' SELECT COUNT(*) FROM users');
    const countRecords = countUser.rows[0].count;

    let objPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 10
        },
        req.query,
        countRecords
    );
    // end pagination

    const users = await pool.query(
        ' SELECT id, fullName, email, phone, role, tokenUser, createdAt FROM users LIMIT $1 OFFSET $2',
        [objPagination.limitItems, objPagination.skip]
    );

    res.json({
        users: users.rows,
        totalPage: objPagination.totalPage
    });
}

// [PATCH]/api/v1/admin/users/edit/:userId
export const edit = async (req, res) => {

    // pagination
    const countRecords = await User.countDocuments(find);
    let objPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 10
        },
        req.query,
        countRecords
    );
    // end pagination

    const users = await pool.query(
        ' SELECT id, name, email, role, student_id, created_at FROM users LIMIT $1 OFFSET $2',
        [objPagination.limitItems, objPagination.skip]
    );

    res.json({
        users: users.rows,
        totalPage: objPagination.totalPage
    });
}