import { pool } from "../../../../config/database.js";
import paginationHelper from "../../helper/pagination.js";

// [POST] /api/v1/admin/proposals/createCourse
export const createProposal = async (req, res) => {
  try {
    const { title, description } = req.body;

    const result = await pool.query(
      `INSERT INTO proposals (title, description)
       VALUES ($1, $2)
       RETURNING *`,
      [title, description]
    );

    return res.json({
      code: 200,
      message: "Tạo đề xuất thành công.",
      proposal: result.rows[0]
    });

  } catch (error) {
    return res.json({
      code: 500,
      error: error.message
    });
  }
};

// [GET]/api/v1/admin/proposals
export const index = async (req, res) => {
  // pagination
  const countProposal = await pool.query(' SELECT COUNT(*) FROM proposals');
  const countRecords = countProposal.rows[0].count;

  let objPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 10
    },
    req.query,
    countRecords
  );
  // end pagination

  const courses = await pool.query(
    ' SELECT * FROM proposals LIMIT $1 OFFSET $2',
    [objPagination.limitItems, objPagination.skip]
  );

  res.json({
    courses: courses.rows,
    totalPage: objPagination.totalPage
  });
}

// [GET]/api/v1/admin/proposals/:proposalId 
export const getDetail = async (req, res) => {
  const { proposalId } = req.params;

  const result = await pool.query('SELECT * FROM proposals WHERE id = $1', [proposalId]);

  res.json({
    code: 200,
    course: result.rows[0]
  });
}

// [PATCH] /api/v1/admin/proposals/changeStatus/:proposalId?status=
export const changeStatus = async (req, res) => {
  const { proposalId } = req.params;
  const { status } = req.query;

  const validStatuses = ['active', 'inactive'];
  if (!validStatuses) {
    return res.json({
      code: 400,
      message: 'Trạng thái không hợp lệ'
    });
  }

  try {
    const proposalResult = await pool.query(
      `UPDATE proposals 
       SET status = $1 WHERE id = $2 RETURNING *`,
      [status, proposalId]
    );

    return res.json({
      code: 200,
      message: `Cập nhật trạng thái thành công`,
      data: proposalResult.rows[0]
    });
  } catch (err) {
    return res.json({
      code: 500,
      error: err.message
    });
  }
};

// [PATCH]/api/v1/admin/proposals/editProposal/:proposalId
export const editProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { title, description } = req.body;

    let result;

    result = await pool.query(
      `UPDATE proposals
         SET title = $1, description = $2 WHERE id = $3 RETURNING *`,
      [title, description, proposalId]
    );


    if (result.rows.length === 0) {
      return res.json({
        code: 404,
        message: 'Không tìm thấy đề xuất!'
      });
    }

    return res.json({
      code: 200,
      message: 'Cập nhật thành công!',
      data: result.rows[0]
    });

  } catch (err) {
    res.json({
      code: 500,
      error: err.message
    });
  }
};

// [DELETE]/api/v1/admin/proposals/deleteProposal/:proposalId
export const deleteProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const result = await pool.query('DELETE FROM proposals WHERE id = $1 RETURNING *', [proposalId]);
    if (result.rows.length === 0) {
      return res.json({
        code: 404,
        message: 'Không tìm thấy!'
      });
    }
    res.json({
      code: 200,
      message: 'Xóa thành công!'
    });
  } catch (err) {
    res.json({
      code: 500,
      error: err.message
    });
  }
};