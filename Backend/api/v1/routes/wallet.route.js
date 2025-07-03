import express from "express";
const router = express.Router();

import { requireAuth } from "../middlewares/auth.middleware.js";
import * as controller from "../controllers/wallet.controller.js";

router.get('/getWallet', requireAuth, controller.getWallet);

export const walletRouter = router;