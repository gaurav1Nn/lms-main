import express from "express";
import {
  addCourse,
  educatorDashboard,
  getEducatorCourses,
  getEnrolledStudentsData,
  updateRoleToEducator,
  getUploadPresignedUrl,
} from "../controllers/educatorController.js";
import upload from "../configs/multer.js";
import { protect, educatorOnly } from "../middlewares/authMiddleware.js";

const educatorRouter = express.Router();

// Add Educator Role
educatorRouter.get("/update-role", protect, updateRoleToEducator);

educatorRouter.use(protect, educatorOnly);

educatorRouter.post(
  "/add-course",
  upload.single("image"),
  addCourse
);
educatorRouter.get("/courses", getEducatorCourses);
educatorRouter.get("/dashboard", educatorDashboard);
educatorRouter.post("/get-upload-url", getUploadPresignedUrl);
educatorRouter.get(
  "/enrolled-students",
  getEnrolledStudentsData
);

export default educatorRouter;
