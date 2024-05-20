import express from "express";
import { LoginController } from "../../controller/login-controller";

var router = express.Router();

router.post("/login", (req, res) => LoginController.getLoginDetails(req, res));
router.post("/register", (req, res) =>
  LoginController.postLoginDetail(req, res)
);

export default router;
