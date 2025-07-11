import express from "express";
const router = express.Router();

import * as controller from "../../controllers/client/wallet.controller.js";

router.get('/', controller.getWallet);

export const walletRouter = router;