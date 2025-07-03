import express from "express";
const router = express.Router();

import * as controller from "../../controllers/admin/user.controller.js";

router.get('/', controller.index);
router.patch('/changeStatus/:userId', controller.changeStatus);

export const userRouter = router;