import { MongoService } from "../../mongo-setup/index";
import { ICourseDetails } from "../model/ICourseDetails";
import { ObjectId } from "mongodb";
export class CourseService {
  static postCourseDetail(courseDetail: ICourseDetails) {
    console.log("2");

    return MongoService.collectionDetails("course").then((obj) => {
      return obj.connection.insertOne(courseDetail).finally(() => {
        obj.client.close();
      });
    });
  }

  static async getSpecificCourseDetails(id: string): Promise<Document | null> {
    let client;
    try {
      const { connection, client: mongoClient } =
        await MongoService.collectionDetails("course");
      client = mongoClient;
      const course: any = await connection.findOne({ courseId: id });
      return course;
    } catch (error: any) {
      console.error("Error fetching course detail:", error.message);
      throw error;
    } finally {
      if (client) {
        await client.close();
      }
    }
  }

  static async getSpecificCourseById(id: string): Promise<Document | null> {
    let client;
    try {
      const { connection, client: mongoClient } =
        await MongoService.collectionDetails("course");
      client = mongoClient;
      const course: any = await connection.findOne({
        _id: new ObjectId(String(id)),
      });
      return course;
    } catch (error: any) {
      console.error("Error fetching course detail:", error.message);
      throw error;
    } finally {
      if (client) {
        await client.close();
      }
    }
  }

  static updateCourseDetail(id: string, courseDetail: ICourseDetails) {
    return MongoService.collectionDetails("course").then((obj) => {
      return obj.connection
        .updateOne({ _id: new ObjectId(id) }, { $set: courseDetail })
        .finally(() => {
          obj.client.close();
        });
    });
  }

  static uploadImage() {
    console.log();
  }

  static deleteCourseDetail(id: string) {
    return MongoService.collectionDetails("course").then((obj) => {
      return obj.connection.deleteOne({ _id: new ObjectId(id) }).finally(() => {
        obj.client.close();
      });
    });
  }
}
