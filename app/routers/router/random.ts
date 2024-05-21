import express from "express";
import { StaffController } from "../../controller/staff-controller";
import { MongoService } from "../../../mongo-setup";

var router = express.Router();

router.get("/something", async (req, res) => {
  try {
    const random = Math.ceil(Math.random() * 100);
    const newResp = await fetch(
      `https://jsonplaceholder.org/posts/${random}`
    ).then((response) => response.json());
    const { connection, client } = await MongoService.collectionDetails(
      "random"
    );
    await connection.insertOne(newResp);
    client.close()
    res.status(200).json({ message: "data inserted successfully" });
  } catch (error: any) {
    console.log(error.message, "error");
  }
});

router.get("/getAll", async (req, res) => {
  try {
    const { connection, client } = await MongoService.collectionDetails(
      "random"
    );
    const resp = await connection.find({}).toArray();
    client.close()
    res.status(200).json(resp);
  } catch (error: any) {
    console.log(error.message, "error");
  }
});

export default router;
