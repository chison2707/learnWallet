import express from "express";
const router = express.Router();

import { requireAuth } from "../../../middlewares/auth.middleware.js";
import * as controller from "../../controllers/user.controller.js";
import { registerPost, login } from "../../../validates/client/user.validate.js";

router.post('/register', registerPost, controller.register);
router.post('/login', login, controller.loginPost);
router.get('/detail', requireAuth, controller.detail);

export const userRouter = router;