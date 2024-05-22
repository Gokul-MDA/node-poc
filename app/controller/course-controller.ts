import { Request, Response } from "express";
import { CourseService } from "../service/course-service";
import { LoginService } from "../service/login-service";
import { GridFSBucket } from "mongodb";
import { metaData } from "../../environment/meta-data";
import * as mongoDB from "mongodb";
import { MongoService, upload } from "../../mongo-setup";
import { GridFSBucketWriteStream } from "mongodb";

interface MulterRequest extends Request {
  files: {
    [fieldname: string]: Express.Multer.File[];
  };
}

import { Readable } from "stream";
function bufferToStream(buffer: Buffer) {
  const readable = new Readable();
  readable._read = () => {}; // _read is required but you can noop it
  readable.push(buffer);
  readable.push(null);
  return readable;
}

export class CourseController {
  static postCourseDetail = async (
    request: MulterRequest,
    response: Response
  ) => {
    try {
      const bodyContent = request.body;
      const token: any = request.headers["authorization"];

      // Verify token and user role
      LoginService.verifyToken(
        token.split("Bearer ")[1],
        async (data: any) => {
          const { userGroup } = data;

          if (userGroup === "Admin") {
            // Initialize MongoDB connection and GridFS bucket
            const { client, bucket } = await MongoService.gridFsBucket();

            try {
              const pdfFile = request.files?.pdf?.[0];
              const imageFile = request.files?.image?.[0];

              if (!pdfFile || !imageFile) {
                return response.status(400).send("PDF and Image are required");
              }

              // Convert file buffers to streams
              const pdfStream = bufferToStream(pdfFile.buffer);
              const imageStream = bufferToStream(imageFile.buffer);

              // Upload streams to GridFS
              const pdfUploadStream: GridFSBucketWriteStream =
                bucket.openUploadStream(pdfFile.originalname);
              const imageUploadStream: GridFSBucketWriteStream =
                bucket.openUploadStream(imageFile.originalname);

              // File upload promises
              const pdfPromise = new Promise((resolve, reject) => {
                pdfStream
                  .pipe(pdfUploadStream)
                  .on("error", reject)
                  .on("finish", resolve);
              });

              const imagePromise = new Promise((resolve, reject) => {
                imageStream
                  .pipe(imageUploadStream)
                  .on("error", reject)
                  .on("finish", resolve);
              });

              // Wait for both files to be uploaded
              await Promise.all([pdfPromise, imagePromise]);

              // File IDs to save in the course data
              const pdfId = pdfUploadStream.id;
              const imageId = imageUploadStream.id;

              const courseData = {
                ...bodyContent,
                pdfId,
                imageId,
              };

              // Call CourseService to save course data
              await CourseService.postCourseDetail(courseData);

              // Return response
              response.status(200).json(courseData);
            } catch (error) {
              console.error("Error uploading files to MongoDB:", error);
              response.status(500).send("Failed to upload files to MongoDB");
            } finally {
              // Close MongoDB connection
              await client.close();
            }
          } else {
            response.status(403).send("Admin only can create course");
          }
        },
        () => {
          response.status(401).send("Invalid token");
        }
      );
    } catch (error) {
      console.error("Exception in CourseController - postCourseDetail", error);
      response.status(500).send("ServerError");
    }
  };

  static getSpecificCourseDetail = async (
    request: Request,
    response: Response
  ) => {
    try {
      const id = request.params.id;
      const courseDetails: any = await CourseService.getSpecificCourseDetails(
        id
      );

      if (!courseDetails) {
        return response.status(404).send("Course not found");
      }

      const { pdfId, imageId } = courseDetails;

      const { client, bucket } = await MongoService.gridFsBucket();

      const fetchFile = async (fileId: any) => {
        try {
          console.log(`Fetching file with ID: ${fileId}`);
          const chunks: Buffer[] = [];
          const fileStream = bucket.openDownloadStream(fileId);

          return new Promise<string>((resolve, reject) => {
            fileStream.on("data", (chunk) => {
              chunks.push(chunk);
            });

            fileStream.on("error", (err) => {
              console.error(`Error downloading file with ID ${fileId}:`, err);
              reject(err);
            });

            fileStream.on("end", () => {
              if (chunks.length === 0) {
                console.error(`No chunks found for file with ID ${fileId}`);
                reject(new Error(`No chunks found for file with ID ${fileId}`));
              } else {
                const fileBuffer = Buffer.concat(chunks);
                const base64File = fileBuffer.toString("base64");
                console.log(`File with ID ${fileId} fetched successfully.`);
                resolve(base64File);
              }
            });
          });
        } catch (error) {
          console.error(`Error fetching file with ID ${fileId}:`, error);
          throw new Error(`File with ID ${fileId} not found`);
        }
      };

      const [pdfBase64, imageBase64] = await Promise.all([
        fetchFile(pdfId),
        fetchFile(imageId),
      ]);

      const pdfBuffer = Buffer.from(pdfBase64)
      const ImageBuffer = Buffer.from(imageBase64)

      response.status(200).json({
        ...courseDetails,
        pdfBuffer,
        ImageBuffer,
      });

      await client.close();
    } catch (error: any) {
      console.error(
        "Exception in CourseController - getSpecificCourseDetail",
        error
      );
      response.status(500).send(error.message || "ServerError");
    }
  };

  static updateCourseDetails = (request: Request, response: Response) => {
    try {
      const id = request.params.id;
      const bodyContent = request.body;

      CourseService.updateCourseDetail(id, bodyContent)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          console.log("Exception in CourseController - updateCourseDetails", e);
          response.status(500).send("serverError");
        });
    } catch (e) {
      console.log("Exception in CourseController - updateCourseDetails", e);
      response.status(500).send("serverError");
    }
  };

  static deleteCourseDetails = (request: Request, response: Response) => {
    try {
      const id = request.params.id;

      CourseService.deleteCourseDetail(id)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          console.log("Exception in CourseController - deleteCourseDetails", e);
          response.status(500).send("serverError");
        });
    } catch (e) {
      console.log("Exception in CourseController - deleteCourseDetails", e);
      response.status(500).send("serverError");
    }
  };
}
