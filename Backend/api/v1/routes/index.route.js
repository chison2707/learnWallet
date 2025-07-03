import { userRouter } from "./user.route.js";
import { walletRouter } from "./wallet.route.js";

const mainV1RoutesClient = (app) => {
    const version = "/api/v1";

    app.use(version + '/users', userRouter);
    app.use(version + '/wallets', walletRouter);
}

export default mainV1RoutesClient;