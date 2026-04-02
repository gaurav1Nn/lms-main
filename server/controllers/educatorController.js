import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";
import { CourseProgress } from "../models/CourseProgress.js";

import jwt from "jsonwebtoken";
import { generatePresignedPutUrl, s3Client } from "../configs/s3.js";
import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { validateCourseUpdate } from "../validators/courseValidator.js";

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
    const isAdmin = req.user.role === "admin";
    // Admins see ALL courses, educators see only their own
    const courses = isAdmin
      ? await Course.find({})
      : await Course.find({ educator: req.user.id });
    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Educator Dashboard Data (Total Earning, Enrolled Students, No. of Courses)
export const educatorDashboard = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const courses = isAdmin
      ? await Course.find({})
      : await Course.find({ educator: req.user.id });
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
    const isAdmin = req.user.role === "admin";
    const courses = isAdmin
      ? await Course.find({})
      : await Course.find({ educator: req.user.id });
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

// Get Single Course by ID (for editing)
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const educatorId = req.user.id;

    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: "Course not found" 
      });
    }

    // Admins can access any course, educators can only access their own
    const isAdmin = req.user.role === "admin";
    if (!isAdmin && course.educator.toString() !== educatorId) {
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized to access this course" 
      });
    }

    res.json({ success: true, course });
  } catch (error) {
    console.error("Get course error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update Course
export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { courseData } = req.body;
    const educatorId = req.user.id;

    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Admins can edit any course, educators can only edit their own
    const isAdmin = req.user.role === "admin";
    if (!isAdmin && existingCourse.educator.toString() !== educatorId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to edit this course"
      });
    }

    // JSON.parse is synchronous (no await)
    const parsedCourseData = JSON.parse(courseData);
    console.log("Parsed data:", JSON.stringify(parsedCourseData, null, 2));

    // Zod validation
    const validation = validateCourseUpdate(parsedCourseData);
    if (!validation.success) {
      const zodErrors = validation.error?.issues || validation.error?.errors || [];
      console.log("Zod validation failed:", JSON.stringify(zodErrors, null, 2));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: zodErrors.map(e => ({
          field: (e.path || []).join("."),
          message: e.message
        }))
      });
    }

    const { courseTitle, courseDescription, coursePrice, discount, courseContent, isPublished } = validation.data;

    // Validate lecture URLs and check S3 existence
    for (const chapter of (courseContent || [])) {
      for (const lecture of (chapter.chapterContent || [])) {
        const url = lecture.lectureUrl;
        if (!url) continue;

        const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");

        if (!isYouTube) {
          const expectedPrefix = `educators/${educatorId}/`;
          if (!url.startsWith(expectedPrefix) || !url.endsWith(".mp4")) {
            return res.status(400).json({
              success: false,
              message: `Lecture '${lecture.lectureTitle}' has an invalid video URL.`
            });
          }

          // Only check S3 if it's a new/changed video
          const existingVideo = existingCourse.courseContent?.some(ch => 
            ch.chapterContent?.some(l => l.lectureUrl === url)
          );
          
          if (!existingVideo) {
            try {
              const command = new HeadObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: url
              });
              await s3Client.send(command);
            } catch (err) {
              return res.status(400).json({
                success: false,
                message: `Video for lecture '${lecture.lectureTitle}' not found in S3.`
              });
            }
          }
        }
      }
    }

    // Update fields with explicit undefined checks
    if (courseTitle !== undefined) existingCourse.courseTitle = courseTitle;
    if (courseDescription !== undefined) existingCourse.courseDescription = courseDescription;
    if (coursePrice !== undefined) existingCourse.coursePrice = coursePrice;
    if (discount !== undefined) existingCourse.discount = discount;
    if (courseContent !== undefined) existingCourse.courseContent = courseContent;
    if (isPublished !== undefined) existingCourse.isPublished = isPublished;

    await existingCourse.save();

    res.json({ 
      success: true, 
      message: "Course updated successfully",
      course: existingCourse
    });
  } catch (error) {
    console.error("Update course error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Delete Course
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const educatorId = req.user.id;
    
    console.log(`[Delete Course] Initiating delete for course: ${courseId} by educator: ${educatorId}`);

    const course = await Course.findById(courseId);
    if (!course) {
      console.log(`[Delete Course] Error: Course ${courseId} not found in database.`);
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (course.educator.toString() !== educatorId) {
      console.log(`[Delete Course] Error: Unauthorized. Course owned by ${course.educator}, but request from ${educatorId}`);
      return res.status(403).json({ success: false, message: "Unauthorized to delete this course" });
    }

    // 1. Remove courseId from all users' enrolledCourses
    console.log(`[Delete Course] Step 1: Removing course ${courseId} from all enrolled users...`);
    const userUpdateResult = await User.updateMany(
      { enrolledCourses: courseId },
      { $pull: { enrolledCourses: courseId } }
    );
    console.log(`[Delete Course] Step 1 Complete: Modified ${userUpdateResult.modifiedCount} users.`);

    // 2. Delete all course progress records
    console.log(`[Delete Course] Step 2: Deleting CourseProgress records for ${courseId}...`);
    const progressDeleteResult = await CourseProgress.deleteMany({ courseId });
    console.log(`[Delete Course] Step 2 Complete: Deleted ${progressDeleteResult.deletedCount} progress records.`);

    // 3. Purchase records remain unchanged
    // 4. Delete the course document
    console.log(`[Delete Course] Step 3: Deleting the Course document itself...`);
    await Course.findByIdAndDelete(courseId);
    console.log(`[Delete Course] Step 3 Complete: Course deleted successfully. Flow complete.`);

    res.json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    console.error("[Delete Course] FATAL ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
