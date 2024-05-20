import express from "express";
import { CourseController } from "../../controller/course-controller";
import { upload } from "../../../mongo-setup";

const router = express.Router();

// Route to handle POST requests for creating a new course
router.post(
  "/create",
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  (req: any, res: any) => CourseController.postCourseDetail(req, res)
);

// Route to handle GET requests for retrieving specific course details
router.get("/coursedetails/:id", CourseController.getSpecificCourseDetail);

// Route to handle PUT requests for updating course details
router.put("/update/coursedetail/:id", CourseController.updateCourseDetails);

// Route to handle DELETE requests for deleting course details
router.delete("/d/coursedetails/:id", CourseController.deleteCourseDetails);

export default router;
