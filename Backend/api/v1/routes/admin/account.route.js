import express from "express";
const router = express.Router();

import * as controller from "../../controllers/admin/account.controller.js";
import * as validate from "../../validates/admin/account.validate.js";

router.post('/login', validate.login, controller.loginPost);


export const accountRouter = router;