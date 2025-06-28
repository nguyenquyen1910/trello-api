import express from "express";
import cors from "cors";
import { corsOptions } from "./config/cors.js";
import { CONNECT_DB, GET_DB } from "./config/mongodb.js";
import { env } from "./config/environment.js";
import { APIs_V1 } from "./routers/v1/index.js";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware.js";

const START_SERVER = async () => {
  await CONNECT_DB();

  const app = express();

  app.use(cors());

  app.use(express.json());

  app.use("/v1", APIs_V1);

  app.use(errorHandlingMiddleware);

  const hostname = env.HOSTNAME;
  const port = env.PORT;

  app.get("/", (req, res) => {
    res.send("<h1>Hello World</h1>");
  });

  app.listen(port, hostname, () => {
    console.log(
      `Hello ${env.AUTHOR}, Im running on http://${hostname}:${port}`
    );
  });
};

START_SERVER();
