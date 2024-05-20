import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { request } from "http";
import { metaData } from "./environment/meta-data";
import { LoginController } from "./app/controller/login-controller";
import apiRouter from "./app/routers/route";

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));

app.use((req, res, next) => {
  if (
    req.url &&
    req.url !== "/" &&
    req.url !== "/auth/register" &&
    req.url !== "/auth/login"
  ) {
    var token = req.headers["authorization"];
    if (!token)
      return res
        .status(401)
        .send({ auth: false, message: "No token provided." });
    LoginController.verifyAuthentication(
      token.split("Bearer ")[1],
      () => {
        next();
      },
      (desc: any) => {
        return res.status(500).send({
          auth: false,
          message: "Failed to authenticate token. " + desc,
        });
      }
    );
  } else {
    next();
  }
});
app.use("/", apiRouter);

const port = metaData.base.apiPort;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
