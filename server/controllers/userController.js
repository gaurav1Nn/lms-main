import Stripe from "stripe";
import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";
import { CourseProgress } from "../models/CourseProgress.js";
import { generatePresignedGetUrl } from "../configs/s3.js";

// Get User Data
export const getUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Users Enrolled Courses With Lecture Links
export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await User.findById(userId).populate("enrolledCourses");

    res.json({ success: true, enrolledCourses: userData.enrolledCourses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Purchase Course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.user.id;
    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res.json({ success: false, message: "Data Not Found" });
    }

    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount: (
        courseData.coursePrice -
        (courseData.discount * courseData.coursePrice) / 100
      ).toFixed(2),
    };

    let newPurchase = await Purchase.create(purchaseData);

    // Bypass Stripe for free courses
    if (newPurchase.amount === 0 || newPurchase.amount === "0.00") {
      // Mark purchase as completed
      newPurchase.status = "completed";
      await newPurchase.save();

      // Ensure course is not already in enrolledCourses before adding
      if (!userData.enrolledCourses.includes(courseData._id)) {
        userData.enrolledCourses.push(courseData._id);
        await userData.save();
      }

      // Ensure user is not already in course enrolledStudents before adding
      if (!courseData.enrolledStudents.includes(userId)) {
        courseData.enrolledStudents.push(userId);
        await courseData.save();
      }

      return res.json({
        success: true,
        session_url: `${origin}/loading/dashboard`,
      });
    }

    // Stripe Gateway Initialize
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const currency = (process.env.CURRENCY || 'usd').toLowerCase();

    // Creating line items for Stripe
    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(newPurchase.amount) * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/dashboard`,
      cancel_url: `${origin}/`,
      line_items: line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update User Course Progress
export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, lectureId } = req.body;
    const progressData = await CourseProgress.findOne({ userId, courseId });

    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        res.json({ success: true, message: "Lecture Already Completed" });
      }

      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }

    res.json({ success: true, message: "Progress Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get User Course Progress
export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.body;
    const progressData = await CourseProgress.findOne({ userId, courseId });

    res.json({ success: true, progressData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add User Ratings to Course
export const addUserRating = async (req, res) => {
  const userId = req.user.id;
  const { courseId, rating } = req.body;

  if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
    return res.json({ success: false, message: "Invalid Details" });
  }

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.json({ success: false, message: "Course not found" });
    }

    const user = await User.findById(userId);

    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res.json({
        success: false,
        message: "User has not purchased this course.",
      });
    }

    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId === userId
    );

    if (existingRatingIndex > -1) {
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }

    await course.save();

    return res.json({ success: true, message: "Rating added" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get Video Presigned URL
export const getVideoPresignedUrl = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, lectureId } = req.body;

    if (!courseId || !lectureId) {
      return res.status(400).json({ success: false, message: "Course ID and Lecture ID are required" });
    }

    const user = await User.findById(userId);
    
    if (!user || (!user.enrolledCourses.some(id => id.toString() === courseId))) {
      return res.status(403).json({ success: false, message: "Not authorized to access this secure video content." });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    let foundLectureUrl = null;
    for (const chapter of course.courseContent) {
      const lecture = chapter.chapterContent.find((l) => l.lectureId === lectureId);
      if (lecture) {
        foundLectureUrl = lecture.lectureUrl;
        break;
      }
    }

    if (!foundLectureUrl) {
      return res.status(404).json({ success: false, message: "Lecture not found" });
    }

    const isYouTube = foundLectureUrl.includes("youtube.com") || foundLectureUrl.includes("youtu.be");
    if (isYouTube) {
      return res.json({ success: true, type: "youtube", url: foundLectureUrl });
    }

    const presignedUrl = await generatePresignedGetUrl(foundLectureUrl);
    return res.json({ success: true, type: "s3", url: presignedUrl });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
