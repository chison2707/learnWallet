import cors from "cors";
import express from 'express';
import dotenv from "dotenv";
import mainV1RoutesClient from "./api/v1/routes/index.route.js";
import bodyParser from "body-parser";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

mainV1RoutesClient(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
