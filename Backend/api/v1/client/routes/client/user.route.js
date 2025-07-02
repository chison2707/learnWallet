import express from "express";
const router = express.Router();

import { requireAuth } from "../../../middlewares/auth.middleware.js";
import * as controller from "../../controllers/user.controller.js";
import { registerPost } from "../../../validates/client/user.validate.js";

router.post('/register', registerPost, controller.register);
// router.post('/login', controller.login);

export const userRouter = router;