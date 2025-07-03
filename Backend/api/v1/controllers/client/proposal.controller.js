import { pool } from "../../../../config/database.js";

// [GET] /api/v1/proposals
export const getProposals = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM proposals WHERE status = 'active'`);

    return res.json({
      code: 200,
      message: "Lấy thành công.",
      result: result.rows,
    });
  } catch (err) {
    return res.json({
      code: 500,
      error: err.message
    });
  }
};

// [POST] /api/v1/proposals/vote/:proposalId
export const voteProposal = async (req, res) => {
  try {
    const parentId = req.user.id;
    const role = req.user.role;
    const { proposalId } = req.params;
    const { vote } = req.body;

    if (role !== "parent") {
      return res.json({
        code: 403,
        message: "Chỉ phụ huynh mới được phép vote."
      });
    }

    const checkProposal = await pool.query(
      `SELECT * FROM proposals WHERE id = $1 AND status = 'active'`,
      [proposalId]
    );
    if (checkProposal.rowCount === 0) {
      return res.json({
        code: 404,
        message: "Đề xuất không tồn tại hoặc đã bị đóng."
      });
    }

    const checkVoted = await pool.query(
      `SELECT * FROM votes WHERE parentId = $1 AND proposalId = $2`,
      [parentId, proposalId]
    );
    if (checkVoted.rowCount > 0) {
      return res.json({
        code: 400,
        message: "Bạn đã vote đề xuất này rồi."
      });
    }

    // Thêm vote
    await pool.query(
      `INSERT INTO votes (parentId, proposalId, vote)
       VALUES ($1, $2, $3)`,
      [parentId, proposalId, vote]
    );

    return res.json({
      code: 200,
      message: "Vote thành công!"
    });

  } catch (error) {
    return res.json({
      code: 500,
      error: error.message
    });
  }
};

// [GET] /api/v1/proposals/result/:proposalId
export const getProposalResult = async (req, res) => {
  try {
    const { proposalId } = req.params;

    const checkProposal = await pool.query(
      `SELECT * FROM proposals WHERE id = $1`,
      [proposalId]
    );

    if (checkProposal.rowCount === 0) {
      return res.json({
        code: 404,
        message: "Không tìm thấy đề xuất."
      });
    }

    const result = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE vote = TRUE) AS agree,
        COUNT(*) FILTER (WHERE vote = FALSE) AS disagree,
        COUNT(*) AS total
      FROM votes
      WHERE proposalId = $1
    `, [proposalId]);

    return res.status(200).json({
      code: 200,
      message: "Kết quả vote",
      proposal: checkProposal.rows[0],
      result: result.rows[0]
    });

  } catch (error) {
    return res.json({
      code: 500,
      error: error.message
    });
  }
};