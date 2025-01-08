import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import * as databasee from "./config/database";
import mainV1Routes from "./api/v1/routes/index.route";

dotenv.config();
databasee.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

mainV1Routes(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
