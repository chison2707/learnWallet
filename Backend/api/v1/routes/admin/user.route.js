import express from "express";
const router = express.Router();

import { requireAuth } from "../../middlewares/admin/auth.middleware.js";
import * as controller from "../../controllers/admin/user.controller.js";
import { createUserVld, linkStudentVld } from "../../validates/admin/user.validate.js";

router.post('/createUser', requireAuth, createUserVld, controller.createUser);
router.post('/linkStudent', requireAuth, linkStudentVld, controller.linkStudent);

export const userRouter = router;