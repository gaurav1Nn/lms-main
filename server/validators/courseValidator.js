import { z } from "zod";

// Custom validator for lectureUrl - accepts YouTube URLs OR S3 keys
const validateLectureUrl = (val) => {
  if (!val) return false;
  // Accept valid YouTube URLs
  if (val.includes("youtube.com") || val.includes("youtu.be")) {
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }

  // Accept full S3 URLs too
  if (val.startsWith("https://") && val.includes(".s3.") && val.endsWith(".mp4")) return true;

  // Accept S3 key pattern: educators/{userId}/{lectureId}.mp4
  const s3KeyPattern = /^educators\/[^/]+\/[^/]+\.mp4$/;
  return s3KeyPattern.test(val);
};

// Lecture schema — use coerce for numbers since client may send strings
// passthrough() allows extra fields from MongoDB (_id etc.)
export const lectureSchema = z.object({
  lectureId: z.string(),
  lectureTitle: z.string().min(1, "Lecture title is required"),
  lectureDuration: z.coerce.number().positive("Duration must be positive"),
  lectureUrl: z.string().refine(
    validateLectureUrl,
    "Must be a valid YouTube URL or S3 key (educators/userId/lectureId.mp4)"
  ),
  lectureOrder: z.coerce.number().positive(),
  isPreviewFree: z.boolean().optional().default(false),
}).passthrough();

// Chapter schema
export const chapterSchema = z.object({
  chapterId: z.string(),
  chapterTitle: z.string().min(1, "Chapter title is required"),
  chapterContent: z.array(lectureSchema).min(1, "Chapter must have at least one lecture"),
  chapterOrder: z.coerce.number().positive(),
}).passthrough();

// Course update schema
export const updateCourseSchema = z.object({
  courseTitle: z.string().min(1, "Course title is required").max(200),
  courseDescription: z.string().min(1, "Course description is required"),
  coursePrice: z.coerce.number().nonnegative("Price cannot be negative"),
  discount: z.coerce.number().min(0).max(100, "Discount cannot exceed 100%"),
  courseContent: z.array(chapterSchema).min(1, "Course must have at least one chapter"),
  isPublished: z.boolean().optional().default(true),
}).passthrough();

// Validate function
export const validateCourseUpdate = (data) => {
  return updateCourseSchema.safeParse(data);
};
