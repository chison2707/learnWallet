import { userRouter } from "./user.route.js";
import { courseRouter } from "./course.route.js";

import requireAuthAdmnin from "../../middlewares/admin/auth.middleware.js";

const mainV1RoutesAdmin = (app) => {
    const version = "/api/v1/admin";

    app.use(version + '/users', requireAuthAdmnin, userRouter);
    app.use(version + '/courses', requireAuthAdmnin, courseRouter);
}

export default mainV1RoutesAdmin;