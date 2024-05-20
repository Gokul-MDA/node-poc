import express from "express";
import authentication from "./router/authentication";
import course from "./router/course";
import staff from "./router/staff";

let api = express.Router();
api.use("/auth", authentication);
api.use("/course", course);
api.use("/staff", staff);

export default api;
