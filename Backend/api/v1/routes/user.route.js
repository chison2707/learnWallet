import express from "express";
const router = express.Router();

import { requireAuth } from "../middlewares/auth.middleware.js";
import * as controller from "../controllers/user.controller.js";
import * as validate from "../validates/user.validate.js";

router.post('/register', validate.rergisterVld, controller.register);
router.post('/login', validate.login, controller.loginPost);
router.get('/detail', requireAuth, controller.detail);

export const userRouter = router;