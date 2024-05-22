import express from "express";
import { StaffController } from "../../controller/staff-controller";
import { MongoService } from "../../../mongo-setup";
import { RandomController } from "../../controller/random-controller";

var router = express.Router();

router.get("/something", async (req, res) =>
  RandomController.postRandomData(req, res)
);

router.get("/getAll", async (req, res) =>
  RandomController.getAllRandomData(req, res)
);

export default router;
