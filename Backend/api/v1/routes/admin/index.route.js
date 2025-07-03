import { userRouter } from "./user.route.js";

const mainV1RoutesAdmin = (app) => {
    const version = "/api/v1/admin";

    app.use(version + '/users', userRouter);
}

export default mainV1RoutesAdmin;