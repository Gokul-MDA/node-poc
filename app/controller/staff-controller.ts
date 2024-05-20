import { Request, Response } from "express";
import { metaData } from "../../environment/meta-data";
import { LoginService } from "../service/login-service";
import { staffService } from "../service/staff-service";
import { CourseService } from "../service/course-service";

export class StaffController {
  static async postStaffDetail(request: Request, response: Response) {
    try {
      // Extract body content and authorization token
      const bodyContent = request.body;
      const token: any = request.headers["authorization"];

      // Verify token and proceed if valid
      LoginService.verifyToken(
        token.split("Bearer ")[1],
        async (data: any) => {
          const { userGroup } = data;

          // Only Admin can create teacher
          if (userGroup === "Admin") {
            try {
              // Fetch specific course details
              const courseData: any =
                await CourseService.getSpecificCourseDetails(
                  bodyContent.courseId
                );

              const { _id } = courseData;

              // Post staff details with courseId
              const staffData = { ...bodyContent, courseId: _id };
              const postStaff = await staffService.postStaffDetails(staffData);
              await CourseService.updateCourseDetail(_id, {
                ...courseData,
                teacherId: postStaff.insertedId,
              });
              response.status(200).json(postStaff);
            } catch (error) {
              console.log(
                "Exception in CourseController - postStaffDetail",
                error
              );
              response.status(500).send("serverError");
            }
          } else {
            response.status(403).send("Admin only can create Teacher");
          }
        },
        () => {
          response.status(500).send("Invalid token");
        }
      );
    } catch (error) {
      console.log("Exception in CourseController - postStaffDetail", error);
      response.status(500).send("serverError");
    }
  }

  static async getSpecificStaffDetails(req: any, res: any) {
    const staffId = req.params.id;

    try {
      const staffData: any = await staffService.getStaffDetailsByStaffId(
        staffId
      );
      if (staffData) {
        const courseData = await CourseService.getSpecificCourseById(
          staffData.courseId
        );
        const staff = { ...staffData, course: courseData };
        return res.status(200).json(staff);
      } else {
        return res.status(200).json("staff not found");
      }
    } catch (e: any) {
      console.log("Exception in staffController - getStaffName", e);
      res.status(500).send("server error");
    }
  }

  static updateStaffDetails(request: Request, response: Response) {
    try {
      let id = request.params.id;
      let bodyContent = request.body;
      staffService
        .updateStaffDetails(id, bodyContent)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          console.log("Exception in CourseController - updateStaffDetails", e);
          response.status(500).send("serverError");
        });
    } catch (e) {
      console.log("Exception in CourseController - updateStaffDetails", e);
      response.status(500).send("serverError");
    }
  }

  static deleteStaffDetails(request: Request, response: Response) {
    try {
      let id = request.params.id;
      staffService
        .deleteStaffDetails(id)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          console.log("Exception in CourseController - deleteStaffDetails", e);
          response.status(500).send("serverError");
        });
    } catch (e) {
      console.log("Exception in CourseController - deleteStaffDetails", e);
      response.status(500).send("serverError");
    }
  }
}
