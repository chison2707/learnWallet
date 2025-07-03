import express from "express";
const router = express.Router();

import { requireAuth } from "../../middlewares/client/auth.middleware.js";
import * as controller from "../../controllers/client/user.controller.js";
import * as validate from "../../validates/client/user.validate.js";

router.post('/register', validate.rergisterVld, controller.register);
router.post('/login', validate.login, controller.loginPost);
router.get('/detail', requireAuth, controller.detail);
router.get('/getStudent', requireAuth, controller.getStudent);

export const userRouter = router;