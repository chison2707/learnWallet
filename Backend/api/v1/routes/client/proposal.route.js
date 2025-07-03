import express from "express";
const router = express.Router();

import * as controller from "../../controllers/client/proposal.controller.js";
import * as validate from "../../validates/client/proposal.valitdate.js";


router.get('/', controller.getProposals);
router.post('/vote/:proposalId', validate.proposal, controller.voteProposal);
router.get('/result/:proposalId', controller.getProposalResult);

export const proposalRouter = router;