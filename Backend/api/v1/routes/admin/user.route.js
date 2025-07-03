import express from "express";
const router = express.Router();

import * as controller from "../../controllers/admin/user.controller.js";

router.get('/', controller.index);

export const userRouter = router;