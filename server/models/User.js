import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    imageUrl: { type: String, required: true },
    role: { type: String, default: "student", enum: ["student", "educator", "admin"] },
    refreshToken: { type: String, default: null },
    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
