import { ObjectId } from "mongodb";
import { MongoService } from "../../mongo-setup/index";

export class studentService {
  static getStudentDetails() {
    return MongoService.collectionDetails("student").then((obj) => {
      return obj.connection
        .find({})
        .toArray()
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static postStudentDetails(data: any) {
    return MongoService.collectionDetails("student").then((obj) => {
      return obj.connection.insertOne(data).finally(() => {
        obj.client.close();
      });
    });
  }
  static deleteStudentDetails(id: any) {
    return MongoService.collectionDetails("student").then((obj) => {
      return obj.connection
        .deleteOne({ _id: new ObjectId(String(id)) })
        .finally(() => {
          obj.client.close();
        });
    });
  }

  static getStudentDetailsByStudentId(studentId: any) {
    return MongoService.collectionDetails("student").then((obj) => {
      return obj.connection
        .findOne({ _id: new ObjectId(String(studentId)) })
        .finally(() => {
          obj.client.close();
        });
    });
  }

  static updateStudentDetails(id: string, data: any) {
    return MongoService.collectionDetails("student").then((obj) => {
      return obj.connection
        .updateOne({ _id: new ObjectId(id) }, { $set: data })
        .finally(() => {
          obj.client.close();
        });
    });
  }
}
