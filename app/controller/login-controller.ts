import { Request, Response } from "express";
import { LoginService } from "../service/login-service";
import { metaData } from "../../environment/meta-data";

export class LoginController {
  static getLoginDetails(request: Request, response: Response) {
    console.log(request, "request");

    try {
      let bodyContent = request.body;
      LoginService.getLoginDetails(bodyContent.userName, bodyContent.password)
        .then((data) => {
          response.status(200).json(data);
        })
        .catch((e) => {
          console.log(e);
          response.status(401).send(e);
        });
    } catch (e) {
      console.log(e);
      response.status(500).send(e);
    }
  }

  static postLoginDetail(request: Request, response: Response) {
    try {
      let bodyContent = request.body;
      bodyContent = {
        ...bodyContent,
        createdDate: new Date(),
      };
      LoginService.postLoginDetail(bodyContent)
        .then((data: any) => {
          response.status(200).json({ ...data });
        })
        .catch((e) => {
          console.log(e);
          response.status(500).send(e);
        });
    } catch (e) {
      console.log(e);
      response.status(500).send(e);
    }
  }

  static verifyAuthentication(
    token: string,
    successCallback: Function,
    failiureCallback: Function
  ) {
    try {
      LoginService.verifyToken(token, successCallback, failiureCallback);
    } catch (e) {
      console.log(e);
    }
  }
}
