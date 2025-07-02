import { userRouter } from "./user.route.js";

const mainV1RoutesClient = (app) => {
    const version = "/api/v1";

    app.use(version + '/users', userRouter);
}

export default mainV1RoutesClient;