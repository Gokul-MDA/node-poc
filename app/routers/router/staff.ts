import express from "express";
import { StaffController } from "../../controller/staff-controller";

var router = express.Router();

router.post("/create", (req, res) => StaffController.postStaffDetail(req, res));

router.get("/staffdetails/:id", (req, res) =>
  StaffController.getSpecificStaffDetails(req, res)
);

router.delete("/d/staffdetails/:id", (req, res) =>
  StaffController.deleteStaffDetails(req, res)
);

router.put("/update/:id", (req, res) =>
  StaffController.updateStaffDetails(req, res)
);

export default router;
