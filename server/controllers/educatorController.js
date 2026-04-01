import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";

import jwt from "jsonwebtoken";
import { generatePresignedPutUrl, s3Client } from "../configs/s3.js";
import { HeadObjectCommand } from "@aws-sdk/client-s3";

// Update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    
    user.role = "educator";
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || "7d",
    });

    res.json({ success: true, message: "Role updated to educator", token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add New Course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.user.id;

    const parsedCourseData = await JSON.parse(courseData);
    
    // Validate lectureUrls and Check S3 Existence
    for (const chapter of parsedCourseData.courseContent || []) {
      for (const lecture of chapter.chapterContent || []) {
        const url = lecture.lectureUrl;
        if (!url) continue;

        const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
        
        if (!isYouTube) {
          const expectedPrefix = `educators/${educatorId}/`;
          if (!url.startsWith(expectedPrefix) || !url.endsWith(".mp4")) {
             return res.status(400).json({ 
               success: false, 
               message: `Lecture '${lecture.lectureTitle}' has an invalid video URL. Must be a valid YouTube link or a direct S3 upload.` 
             });
          }
          
          try {
             const command = new HeadObjectCommand({
               Bucket: process.env.S3_BUCKET_NAME,
               Key: url
             });
             await s3Client.send(command);
          } catch (err) {
             return res.status(400).json({
               success: false,
               message: `Video for lecture '${lecture.lectureTitle}' has not finished uploading or does not exist.`
             });
          }
        }
      }
    }

    parsedCourseData.educator = educatorId;
    const newCourse = await Course.create(parsedCourseData);
    
    // Cloudinary upload removed - BLOB implementation planned for later
    
    await newCourse.save();

    res.json({ success: true, message: "Course Added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.user.id;
    const courses = await Course.find({ educator });
    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Educator Dashboard Data (Total Earning, Enrolled Students, No. of Courses)
export const educatorDashboard = async (req, res) => {
  try {
    const educator = req.user.id;
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;

    const courseIds = courses.map((course) => course._id);

    // Calculate total earnings from purchases
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    // Collect unique enrolled student IDs with their course titles
    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name imageUrl"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Enrolled Studentd Data with Purchase Data
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.user.id;
    const courses = await Course.find({ educator });
    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    res.json({ success: true, enrolledStudents });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Generate Presigned PUT URL for Video Uploads
export const getUploadPresignedUrl = async (req, res) => {
  try {
    const { lectureId } = req.body;
    if (!lectureId) {
      return res.status(400).json({ success: false, message: "Lecture ID is required" });
    }
    
    const s3Key = `educators/${req.user.id}/${lectureId}.mp4`;
    const uploadUrl = await generatePresignedPutUrl(s3Key);
    
    res.json({ success: true, uploadUrl, s3Key });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
