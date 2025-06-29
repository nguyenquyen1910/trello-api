import express from "express";
import cors from "cors";
import { corsOptions } from "./config/cors.js";
import { CONNECT_DB, GET_DB } from "./config/mongodb.js";
import { env } from "./config/environment.js";
import { APIs_V1 } from "./routers/v1/index.js";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware.js";
import { Server } from "socket.io";
import http from "http";

const START_SERVER = async () => {
  await CONNECT_DB();

  const app = express();

  app.use(cors());

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  app.use("/v1", APIs_V1);

  app.use(errorHandlingMiddleware);

  const hostname = env.HOSTNAME;
  const port = env.PORT;

  const httpServer = http.createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  app.locals.io = io;

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join-board", (boardId) => {
      socket.join(boardId);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  httpServer.listen(port, hostname, () => {
    console.log(
      `Hello ${env.AUTHOR}, Im running on http://${hostname}:${port}`
    );
  });
};

START_SERVER();
