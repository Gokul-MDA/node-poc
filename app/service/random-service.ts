import { MongoService } from "../../mongo-setup";

export class RandomService {
  static async getAllRandom() {
    return MongoService.collectionDetails("random").then((obj) => {
      return obj.connection
        .find()
        .toArray()
        .finally(() => obj.client.close());
    });
  }
  static async postRandom(randomData: any) {
    return MongoService.collectionDetails("random").then((obj) => {
      return obj.connection
        .insertOne(randomData)
        .finally(() => obj.client.close());
    });
  }
}
