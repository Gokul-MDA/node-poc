import { Request, Response } from "express";
import { MongoService } from "../../mongo-setup";
import { RandomService } from "../service/random-service";

export class RandomController {
  static async getAllRandomData(req: Request, res: Response) {
    try {
      const data = await RandomService.getAllRandom();
      res.status(200).json(data);
    } catch (error: any) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  }
  static async postRandomData(req: Request, res: Response) {
    try {
      const random = Math.ceil(Math.random() * 100);
      const randomData = await fetch(
        `https://jsonplaceholder.org/posts/${random}`
      ).then((response) => response.json());

      await RandomService.postRandom(randomData);
      res.status(200).json({ message: "data stored successfully" });
    } catch (error: any) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  }
}
