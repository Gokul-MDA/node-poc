import { Request, Response } from "express";
import { metaData } from "../../environment/meta-data";
import { LoginService } from "../service/login-service";
import { studentService } from "../service/student-service";
import { CourseService } from "../service/course-service";

export class StudentController {
  static async postStudentDetail(request: Request, response: Response) {
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

              // Post student details with courseId
              const studentData = { ...bodyContent, courseId: _id };
              const postStudent = await studentService.postStudentDetails(
                studentData
              );
              await CourseService.updateCourseDetail(_id, {
                ...courseData,
                studentId: postStudent.insertedId,
              });
              response.status(200).json(postStudent);
            } catch (error) {
              console.log(
                "Exception in StudentController - postStudentDetail",
                error
              );
              response.status(500).send("serverError");
            }
          } else {
            response.status(403).send("Admin only can create Student");
          }
        },
        () => {
          response.status(500).send("Invalid token");
        }
      );
    } catch (error) {
      console.log("Exception in StudentController - postStudentDetail", error);
      response.status(500).send("serverError");
    }
  }

  static async getSpecificStudentDetails(req: any, res: any) {
    const studentId = req.params.id;

    try {
      const studentData: any =
        await studentService.getStudentDetailsByStudentId(studentId);
      if (studentData) {
        const courseData = await CourseService.getSpecificCourseById(
          studentData.courseId
        );
        const student = { ...studentData, course: courseData };
        return res.status(200).json(student);
      } else {
        return res.status(200).json("student not found");
      }
    } catch (e: any) {
      console.log("Exception in studentController - getStudentName", e);
      res.status(500).send("server error");
    }
  }

  static updateStudentDetails(request: Request, response: Response) {
    try {
      let id = request.params.id;
      let bodyContent = request.body;
      studentService
        .updateStudentDetails(id, bodyContent)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          console.log(
            "Exception in StudentController - updateStudentDetails",
            e
          );
          response.status(500).send("serverError");
        });
    } catch (e) {
      console.log("Exception in StudentController - updateStudentDetails", e);
      response.status(500).send("serverError");
    }
  }

  static deleteStudentDetails(request: Request, response: Response) {
    try {
      let id = request.params.id;
      studentService
        .deleteStudentDetails(id)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          console.log(
            "Exception in StudentController - deleteStudentDetails",
            e
          );
          response.status(500).send("serverError");
        });
    } catch (e) {
      console.log("Exception in StudentController - deleteStudentDetails", e);
      response.status(500).send("serverError");
    }
  }
}
