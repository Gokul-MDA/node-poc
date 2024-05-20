import { MongoService } from "../../mongo-setup/index";
import { IUserDetails } from "../model/IUserDetails";
import { sign, verify } from "jsonwebtoken";
import { hashSync } from "bcryptjs";
import { metaData } from "../../environment/meta-data";
import { ObjectId } from "mongodb";

export class LoginService {
  static async postLoginDetail(userDetails: any) {
    const { connection, client } = await MongoService.collectionDetails("user");
    try {
      const existingUser = await connection.findOne({
        email: userDetails.email,
      });

      if (existingUser) {
        return { auth: false, message: "User already exists:" };
        // throw new Error("User already exists");
      }

      userDetails.isActive = true;
      await connection.insertOne(userDetails);

      return { auth: true, message: "User registered successfully" };
    } catch (error: any) {
      console.error("Error registering user:", error.message);
      throw error;
    } finally {
      // Close the database connection after use
      if (client) {
        client.close();
      }
    }
  }

  static async getLoginDetails(userName: string, password: string) {
    const { connection, client } = await MongoService.collectionDetails("user");
    try {
      const user = await connection.findOne<IUserDetails>({
        $or: [{ id: userName }, { email: userName }],
      });

      if (!user || !user.password) {
        throw new Error("Invalid credentials");
      }

      if (!user.isActive) {
        throw new Error("User not active");
      }

      if (user.password !== password) {
        throw new Error("Incorrect password");
      }

      const token = sign(
        { id: userName, userGroup: user.userGroup },
        metaData.base.key,
        {
          expiresIn: metaData.base.expire, // expires in 24 hours
        }
      );

      return {
        auth: true,
        message: "Login successful",
        data: {
          token: token,
          userGroup: user.userGroup,
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          _id: user._id,
          email: user.email,
        },
      };
    } catch (error: any) {
      console.error("Error authenticating user:", error.message);
      throw error;
    } finally {
      // Close the database connection after use
      if (client) {
        client.close();
      }
    }
  }

  static verifyToken(
    token: string,
    successCallback: Function,
    failiureCallback: Function
  ) {
    try {
      verify(token, metaData.base.key, function (err, decoded) {
        if (err) {
          failiureCallback(err.name);
        } else {
          successCallback(decoded);
        }
      });
    } catch (e) {
      failiureCallback();
    }
  }
}
