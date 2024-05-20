import { ObjectId } from "mongodb";
import { MongoService } from "../../mongo-setup/index";

export class staffService {
  static getStaffDetails() {
    return MongoService.collectionDetails("staff").then((obj) => {
      return obj.connection
        .find({})
        .toArray()
        .finally(() => {
          obj.client.close();
        });
    });
  }
  static postStaffDetails(data: any) {
    return MongoService.collectionDetails("staff").then((obj) => {
      return obj.connection.insertOne(data).finally(() => {
        obj.client.close();
      });
    });
  }
  static deleteStaffDetails(id: any) {
    return MongoService.collectionDetails("staff").then((obj) => {
      return obj.connection.deleteOne({ _id: new ObjectId(id) }).finally(() => {
        obj.client.close();
      });
    });
  }

  static getStaffDetailsByStaffId(staffId: any) {
    return MongoService.collectionDetails("staff").then((obj) => {
      return obj.connection
        .findOne({ _id: new ObjectId(String(staffId)) })
        .finally(() => {
          obj.client.close();
        });
    });
  }

  static updateStaffDetails(id: string, data: any) {
    return MongoService.collectionDetails("staff").then((obj) => {
      return obj.connection
        .updateOne({ _id: new ObjectId(id) }, { $set: data })
        .finally(() => {
          obj.client.close();
        });
    });
  }
}
