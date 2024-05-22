import * as mongoDB from "mongodb";
import { metaData } from "../environment/meta-data";
import { GridFSBucket } from "mongodb";
import { GridFsStorage } from "multer-gridfs-storage";
import multer from "multer";

export class MongoService {
  static async collectionDetails(type: string): Promise<{
    client: mongoDB.MongoClient;
    connection: mongoDB.Collection;
  }> {
    let client = new mongoDB.MongoClient(metaData.db.connectionURL);
    await client.connect();
    let db = client.db(metaData.db.databaseName);
    let collection = db.collection(metaData.db.collectionDetails.user);
    switch (type) {
      case "user":
        collection = db.collection(metaData.db.collectionDetails.user);
        break;
      case "course":
        collection = db.collection(metaData.db.collectionDetails.course);
        break;
      case "staff":
        collection = db.collection(metaData.db.collectionDetails.staff);
        break;
      case "student":
        collection = db.collection(metaData.db.collectionDetails.student);
        break;
      case "random":
        collection = db.collection(metaData.db.collectionDetails.random);;
        break;
      default:
        break;
    }
    return {
      client: client,
      connection: collection,
    };
  }

  static async gridFsBucket() {
    const client = new mongoDB.MongoClient(metaData.db.connectionURL);
    await client.connect();
    const db = client.db("test");
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });
    return { client, bucket };
  }

  static multerStorage() {
    return new GridFsStorage({
      url: metaData.db.connectionURL,
      file: (req, file) => {
        return {
          bucketName: "uploads", // Bucket name
          filename: `${Date.now()}-${file.originalname}`, // Unique filename
        };
      },
    });
  }
}

// Initialize multer with GridFsStorage
// const storage = MongoService.multerStorage();
const storage = multer.memoryStorage()
export const upload = multer({ storage });
