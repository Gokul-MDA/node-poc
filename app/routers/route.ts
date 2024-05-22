import express from "express";
import authentication from "./router/authentication";
import course from "./router/course";
import staff from "./router/staff";
import random from "./router/random"

let api = express.Router();
api.use("/auth", authentication);
api.use("/course", course);
api.use("/staff", staff);
api.use("/random", random)

export default api;
