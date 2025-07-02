import express from "express";
const router = express.Router();

import { requireAuth } from "../../middlewares/client/auth.middleware.js";
import * as controller from "../../controllers/client/user.controller.js";
import { login } from "../../validates/client/user.validate.js";

router.post('/login', login, controller.loginPost);
router.get('/detail', requireAuth, controller.detail);

export const userRouter = router;