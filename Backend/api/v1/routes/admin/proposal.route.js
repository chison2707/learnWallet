import express from "express";
const router = express.Router();

import * as validate from "../../validates/admin/proposal.validate.js";
import * as controller from "../../controllers/admin/proposal.controller.js";

router.get('/', controller.index);
router.get('/:proposalId', controller.getDetail);
router.post('/createCourse', validate.proposal, controller.createProposal);
router.patch('/changeStatus/:proposalId', controller.changeStatus);
router.patch('/editProposal/:proposalId', validate.proposal, controller.editProposal);
router.delete('/deleteProposal/:proposalId', controller.deleteProposal);

export const proposalRouter = router;