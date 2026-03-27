import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    completed: { type: Boolean, default: false },
    lectureCompleted: [],
  },
  { minimize: false }
);

export const CourseProgress = mongoose.model(
  "CourseProgress",
  courseProgressSchema
);
