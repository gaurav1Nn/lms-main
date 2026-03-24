# Edemy LMS - Complete Project Architecture Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Directory Structure](#directory-structure)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Database Schema](#database-schema)
7. [API Routes](#api-routes)
8. [Authentication Flow](#authentication-flow)
9. [Data Flow](#data-flow)
10. [Third-Party Integrations](#third-party-integrations)
11. [Environment Configuration](#environment-configuration)
12. [Deployment](#deployment)

---

## Project Overview

**Edemy** is a full-stack Learning Management System (LMS) built with the MERN stack. It's a comprehensive e-learning platform that connects educators with students, featuring:

- **Student Portal**: Browse courses, enroll, track progress, rate courses
- **Educator Dashboard**: Create courses, manage content, view analytics, track enrollments
- **Secure Authentication**: Clerk-based authentication with role management
- **Payment Processing**: Stripe integration for course purchases
- **Cloud Storage**: Cloudinary for image hosting, YouTube for video content

**Live Demo**: https://lms-frontend-eosin-sigma.vercel.app/

**Repository Structure**: `lms-main/`
- `client/` - React frontend (Vite + Tailwind CSS)
- `server/` - Node.js/Express backend (MongoDB + Mongoose)

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^19.0.0 | UI framework |
| React Router DOM | ^7.1.5 | Client-side routing |
| @clerk/clerk-react | ^5.22.10 | Authentication |
| Axios | ^1.8.1 | HTTP client |
| Tailwind CSS | ^3.4.17 | Styling |
| React Toastify | ^11.0.5 | Notifications |
| Quill | ^2.0.3 | Rich text editor |
| React YouTube | ^10.1.0 | Video player |
| RC Progress | ^4.0.0 | Progress bars |
| Vite | ^6.2.0 | Build tool |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Express | ^4.21.2 | Web framework |
| Mongoose | ^8.10.2 | MongoDB ODM |
| @clerk/express | ^1.3.49 | Auth middleware |
| Stripe | ^17.7.0 | Payment processing |
| Cloudinary | ^2.5.1 | Image storage |
| Multer | ^1.4.5-lts.1 | File uploads |
| CORS | ^2.8.5 | Cross-origin requests |
| Svix | ^1.42.0 | Webhook verification |

---

## Directory Structure

```
lms-main/
├── client/                          # Frontend React Application
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── assets/                  # Images, icons, logos (48 files)
│   │   │   ├── *.svg               # Icons (play, download, user, etc.)
│   │   │   ├── *.png               # Course thumbnails, profiles
│   │   │   └── assets.js           # Asset exports
│   │   │
│   │   ├── components/              # Reusable UI components
│   │   │   ├── student/            # Student-facing components
│   │   │   │   ├── Navbar.jsx      # Navigation bar
│   │   │   │   ├── Footer.jsx      # Footer component
│   │   │   │   ├── Hero.jsx        # Landing page hero
│   │   │   │   ├── Companies.jsx   # Partner companies showcase
│   │   │   │   ├── CourseCard.jsx  # Individual course display
│   │   │   │   ├── CoursesSection.jsx  # Course grid section
│   │   │   │   ├── TestimonialsSection.jsx  # User testimonials
│   │   │   │   ├── CallToAction.jsx  # CTA banner
│   │   │   │   ├── Loading.jsx     # Loading spinner
│   │   │   │   ├── SearchBar.jsx   # Course search
│   │   │   │   └── Rating.jsx      # Star rating display
│   │   │   │
│   │   │   └── educator/           # Educator dashboard components
│   │   │       ├── Navbar.jsx      # Educator nav
│   │   │       ├── Sidebar.jsx     # Dashboard sidebar
│   │   │       └── Footer.jsx      # Educator footer
│   │   │
│   │   ├── context/                 # Global state management
│   │   │   └── AppContext.jsx      # React Context provider
│   │   │
│   │   ├── pages/                   # Page components (route-level)
│   │   │   ├── student/            # Student pages
│   │   │   │   ├── Home.jsx        # Landing page
│   │   │   │   ├── CoursesList.jsx # All courses with filters
│   │   │   │   ├── CourseDetails.jsx  # Single course view
│   │   │   │   ├── MyEnrollments.jsx  # User's enrolled courses
│   │   │   │   └── Player.jsx      # Course content player
│   │   │   │
│   │   │   └── educator/           # Educator pages
│   │   │       ├── Educator.jsx    # Layout wrapper
│   │   │       ├── Dashboard.jsx   # Stats & analytics
│   │   │       ├── AddCourse.jsx   # Course creation form
│   │   │       ├── MyCourses.jsx   # Educator's courses list
│   │   │       └── StudentsEnrolled.jsx  # Student enrollment list
│   │   │
│   │   ├── App.jsx                  # Main app with routing
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles (Tailwind)
│   │
│   ├── index.html                   # HTML template
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind CSS config
│   ├── postcss.config.js            # PostCSS config
│   ├── eslint.config.js             # ESLint config
│   └── vercel.json                  # Vercel deployment config
│
└── server/                          # Backend Node.js Application
    ├── configs/                     # Service configurations
    │   ├── mongodb.js              # MongoDB connection setup
    │   ├── cloudinary.js           # Cloudinary configuration
    │   └── multer.js               # Multer file upload config
    │
    ├── controllers/                 # Business logic layer
    │   ├── courseController.js     # Course CRUD operations
    │   ├── userController.js       # User operations (purchase, progress)
    │   ├── educatorController.js   # Educator-specific logic
    │   └── webhooks.js             # Clerk & Stripe webhook handlers
    │
    ├── models/                      # Database schemas
    │   ├── User.js                 # User schema
    │   ├── Course.js               # Course schema with chapters/lectures
    │   ├── Purchase.js             # Purchase transaction schema
    │   └── CourseProgress.js       # Student progress tracking
    │
    ├── routes/                      # API route definitions
    │   ├── courseRoute.js          # Course endpoints
    │   ├── userRoutes.js           # User endpoints
    │   └── educatorRoutes.js       # Educator endpoints
    │
    ├── middlewares/                 # Custom middleware
    │   └── authMiddleware.js       # Educator role protection
    │
    ├── server.js                    # Express server entry point
    ├── package.json                 # Backend dependencies
    └── vercel.json                  # Vercel deployment config
```

---

## Frontend Architecture

### Component Hierarchy

```
App.jsx (Root)
│
├── AppContext.Provider (Global State)
│
├── Routes
│   │
│   ├── Public Routes (Student)
│   │   ├── Home.jsx
│   │   │   └── Components: Navbar, Hero, Companies, CoursesSection, Testimonials, CTA, Footer
│   │   │
│   │   ├── CoursesList.jsx
│   │   │   └── Components: Navbar, SearchBar, CourseCard[], Footer
│   │   │
│   │   ├── CourseDetails.jsx
│   │   │   └── Components: Navbar, CourseInfo, ChapterList, Rating, Footer
│   │   │
│   │   ├── MyEnrollments.jsx
│   │   │   └── Components: Navbar, EnrolledCourseCard[], Footer
│   │   │
│   │   └── Player.jsx
│   │       └── Components: VideoPlayer, ChapterNavigation, ProgressTracker
│   │
│   └── Protected Routes (Educator)
│       └── Educator.jsx (Layout)
│           ├── Sidebar (Navigation)
│           ├── Dashboard.jsx
│           ├── AddCourse.jsx
│           ├── MyCourses.jsx
│           └── StudentsEnrolled.jsx
```

### State Management (AppContext)

**File**: `client/src/context/AppContext.jsx`

```javascript
// Global State Variables
const AppContext = createContext();

State:
├── allCourses          // Array of all available courses
├── isEducator          // Boolean: user's educator role status
├── enrolledCourses     // Array of user's enrolled courses
├── userData            // User profile object
├── currency            // Currency symbol (e.g., "$")
└── backendUrl          // API base URL

Helper Functions:
├── calculateRating(course)         // Returns average rating (1-5)
├── calculateChapterTime(chapter)   // Returns chapter duration in minutes
├── calculateCourseDuration(course) // Returns total course duration
├── calculateNoOfLectures(course)   // Returns total lecture count
├── fetchAllCourses()               // GET /api/course/all
├── fetchUserData()                 // GET /api/user/data
└── fetchUserEnrolledCourses()      // GET /api/user/enrolled-courses
```

**Usage Pattern**:
```javascript
// Any component can access context
const { allCourses, userData, isEducator, fetchAllCourses } = useContext(AppContext);
```

### Routing Configuration

**File**: `client/src/App.jsx`

```javascript
Routes:
├── /                          → Home (Landing page)
├── /course-list               → CoursesList (All courses)
├── /course-list/:input        → CoursesList (Search/category filter)
├── /course/:id                → CourseDetails (Single course view)
├── /my-enrollments            → MyEnrollments (User's courses)
├── /player/:courseId          → Player (Course video player)
├── /loading/:path             → Loading (Post-purchase redirect)
└── /educator                  → Educator Dashboard Layout
    ├── /educator              → Dashboard (Stats & earnings)
    ├── /add-course            → AddCourse (Create new course)
    ├── /my-courses            → MyCourses (Educator's courses)
    └── /student-enrolled      → StudentsEnrolled (Enrollment list)
```

---

## Backend Architecture

### MVC Pattern

```
Request → Routes → Controllers → Models → Database
              ↓
          Middleware (Auth, CORS)
```

### Middleware Stack

1. **CORS**: Allows cross-origin requests from frontend
2. **Clerk Middleware**: Validates JWT tokens on protected routes
3. **Custom Auth Middleware**: Role-based access control (educator protection)
4. **Multer**: Handles multipart/form-data for file uploads

### Controller Responsibilities

| Controller | Responsibilities |
|------------|-----------------|
| `courseController.js` | Fetch all courses, get single course details |
| `userController.js` | Get user data, purchase courses, track progress, add ratings |
| `educatorController.js` | Create courses, get educator stats, view enrolled students |
| `webhooks.js` | Handle Clerk user sync, Stripe payment events |

---

## Database Schema

### 1. User Model

**File**: `server/models/User.js`

```javascript
{
  _id: String,              // Clerk user ID (primary key)
  name: String,
  email: String,
  imageUrl: String,         // Profile image URL from Clerk
  enrolledCourses: [ObjectId],  // References: Course._id
  timestamps: true          // createdAt, updatedAt
}
```

### 2. Course Model

**File**: `server/models/Course.js`

```javascript
{
  courseTitle: String,
  courseDescription: String,      // HTML from Quill editor
  courseThumbnail: String,        // Cloudinary URL
  coursePrice: Number,
  isPublished: Boolean,
  discount: Number,               // Percentage (0-100)
  
  courseContent: [Chapter],       // Embedded array
  
  courseRatings: [{
    userId: String,               // Ref: User._id
    rating: Number                // 1-5 stars
  }],
  
  educator: String,               // Ref: User._id
  enrolledStudents: [String],     // Ref: User._id
  timestamps: true
}

// Chapter Schema (embedded in courseContent)
Chapter = {
  chapterId: String,              // Unique ID (uniqid)
  chapterOrder: Number,           // Display order
  chapterTitle: String,
  chapterContent: [Lecture]
}

// Lecture Schema (embedded in chapterContent)
Lecture = {
  lectureId: String,              // Unique ID (uniqid)
  lectureTitle: String,
  lectureDuration: Number,        // Minutes
  lectureUrl: String,             // YouTube video URL
  isPreviewFree: Boolean,         // Allow preview without enrollment
  lectureOrder: Number
}
```

### 3. Purchase Model

**File**: `server/models/Purchase.js`

```javascript
{
  courseId: ObjectId,     // Ref: Course._id
  userId: String,         // Ref: User._id
  amount: Number,         // Price paid
  status: Enum["pending", "completed", "failed"],
  timestamps: true
}
```

### 4. CourseProgress Model

**File**: `server/models/CourseProgress.js`

```javascript
{
  userId: String,         // Ref: User._id
  courseId: String,       // Ref: Course._id
  completed: Boolean,     // All lectures completed
  lectureCompleted: [String]  // Array of completed lectureIds
}
```

---

## API Routes

### Base URL: `/api`

### Course Routes (Public)

**File**: `server/routes/courseRoute.js`

| Method | Endpoint | Controller | Description |
|--------|----------|------------|-------------|
| GET | `/course/all` | `getAllCourses` | List all published courses |
| GET | `/course/:id` | `getCourseId` | Get single course details |

### User Routes (Protected)

**File**: `server/routes/userRoutes.js`

| Method | Endpoint | Controller | Description |
|--------|----------|------------|-------------|
| GET | `/user/data` | `getUserData` | Get user profile |
| GET | `/user/enrolled-courses` | `userEnrolledCourses` | Get user's enrolled courses |
| POST | `/user/purchase` | `purchaseCourse` | Initiate Stripe checkout |
| POST | `/user/update-course-progress` | `updateUserCourseProgress` | Mark lecture as complete |
| POST | `/user/get-course-progress` | `getUserCourseProgress` | Get progress for a course |
| POST | `/user/add-rating` | `addUserRating` | Submit course rating |

### Educator Routes (Protected - Educator Role Only)

**File**: `server/routes/educatorRoutes.js`

| Method | Endpoint | Controller | Description |
|--------|----------|------------|-------------|
| GET | `/educator/update-role` | `updateRoleToEducator` | Upgrade user to educator |
| POST | `/educator/add-course` | `addCourse` | Create new course (with image upload) |
| GET | `/educator/courses` | `getEducatorCourses` | Get educator's courses |
| GET | `/educator/dashboard` | `educatorDashboard` | Get dashboard stats & earnings |
| GET | `/educator/enrolled-students` | `getEnrolledStudentsData` | Get students enrolled in courses |

### Webhook Routes

**File**: `server/routes/` (inline in server.js)

| Method | Endpoint | Handler | Description |
|--------|----------|---------|-------------|
| POST | `/clerk` | `clerkWebhooks` | Sync user data from Clerk |
| POST | `/stripe` | `stripeWebhooks` | Handle Stripe payment events |

---

## Authentication Flow

### 1. User Registration/Login

```
┌─────────────┐
│   Frontend  │
│  Clerk      │
│  <UserButton/> │
└──────┬──────┘
       │ User signs in via Clerk UI
       ▼
┌─────────────┐
│    Clerk    │
│   Servers   │
└──────┬──────┘
       │ Triggers webhook
       ▼
┌─────────────┐
│   Backend   │
│ /clerk      │
│ webhook     │
└──────┬──────┘
       │ Creates/updates User in MongoDB
       ▼
┌─────────────┐
│   MongoDB   │
│   User      │
│  Collection │
└─────────────┘
```

### 2. Protected API Access

```javascript
// Frontend: Obtain JWT token
const { getToken } = useAuth();
const token = await getToken();

// Include in API request
axios.post('/api/user/purchase', 
  { courseId }, 
  { headers: { Authorization: `Bearer ${token}` } }
);

// Backend: Clerk middleware validates token
app.use('/api/user', clerkMiddleware());

// Controller: Access authenticated user
const userId = req.auth.userId;
```

### 3. Role-Based Access Control

```javascript
// Educator protection middleware
export const protectEducator = async (req, res, next) => {
  const userId = req.auth.userId;
  const response = await clerkClient.users.getUser(userId);
  
  if (response.publicMetadata.role !== "educator") {
    return res.json({ success: false, message: "Unauthorized Access" });
  }
  next();
};

// Apply to educator routes
educatorRouter.use(protectEducator);
```

### 4. Role Elevation (Student → Educator)

```
User clicks "Become Educator"
        ↓
GET /api/educator/update-role (with JWT)
        ↓
Backend: clerkClient.users.updateUserMetadata(userId, {
  publicMetadata: { role: "educator" }
})
        ↓
Clerk updates user metadata
        ↓
Frontend updates isEducator state in AppContext
        ↓
User can access /educator routes
```

---

## Data Flow

### Student Enrollment Flow

```
1. Browse Courses
   GET /api/course/all → Display CourseCard[]

2. View Course Details
   GET /api/course/:id → Display course info, chapters, ratings

3. Initiate Purchase
   POST /api/user/purchase
   ├── Create Purchase record (status: "pending")
   ├── Create Stripe Checkout Session
   └── Return Stripe URL

4. Redirect to Stripe
   window.location.href = stripeUrl

5. Complete Payment
   Stripe processes payment
        ↓
   Stripe webhook → POST /stripe
        ↓
   Update Purchase.status = "completed"
   Add course to User.enrolledCourses
   Add user to Course.enrolledStudents

6. Post-Purchase Redirect
   Navigate to /loading/my-enrollments
        ↓
   Fetch enrolled courses
        ↓
   Display in MyEnrollments.jsx

7. Access Course Content
   Click course → /player/:courseId
        ↓
   Verify enrollment
        ↓
   Display video lectures
```

### Course Creation Flow (Educator)

```
1. Fill Course Form (AddCourse.jsx)
   ├── Course title, description, price
   ├── Quill editor → HTML description
   ├── Add chapters with lectures
   └── Upload thumbnail image

2. Submit Form
   POST /api/educator/add-course
   Content-Type: multipart/form-data

3. Backend Processing
   ├── Multer handles file upload
   ├── Cloudinary.upload() → thumbnail URL
   ├── Create Course document:
   │   ├── Generate unique IDs for chapters/lectures
   │   ├── Set educator ID from auth
   │   └── Save to MongoDB
   └── Return success response

4. Frontend Response
   ├── Show success toast
   └── Reset form
```

### Progress Tracking Flow

```
1. Watch Lecture (Player.jsx)
   Display YouTube video

2. Mark Complete
   POST /api/user/update-course-progress
   { courseId, lectureId }

3. Backend Update
   Find/Create CourseProgress document
   Add lectureId to lectureCompleted[]
   Check if all lectures completed → set completed: true

4. Update UI
   Progress bar updates
   Checkmark appears on lecture
```

---

## Third-Party Integrations

### 1. Clerk (Authentication)

**Purpose**: User authentication, management, and webhooks

**Frontend**:
```javascript
import { ClerkProvider, SignedIn, UserButton } from "@clerk/clerk-react";

<ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
  <SignedIn>
    <UserButton />
  </SignedIn>
</ClerkProvider>
```

**Backend**:
```javascript
import { clerkMiddleware, clerkClient } from "@clerk/express";

// Protect routes
app.use("/api/user", clerkMiddleware());

// Access user
const userId = req.auth.userId;

// Update metadata
await clerkClient.users.updateUserMetadata(userId, {...});
```

**Webhooks**: `user.created`, `user.updated`, `user.deleted`

---

### 2. Stripe (Payments)

**Purpose**: Process course purchases

**Frontend**:
```javascript
const { data } = await axios.post(
  backendUrl + "/api/user/purchase",
  { courseId },
  { headers: { Authorization: `Bearer ${token}` } }
);
window.location.href = data.url; // Stripe checkout
```

**Backend**:
```javascript
const session = await stripe.checkout.sessions.create({
  line_items: [{
    price_data: {
      product_data: { name: courseTitle },
      unit_amount: Math.round(price * 100), // cents
      currency: "usd"
    },
    quantity: 1
  }],
  mode: "payment",
  success_url: `${frontendUrl}/loading/my-enrollments`,
  cancel_url: `${frontendUrl}/course-list`
});
```

**Webhooks**: `checkout.session.completed`, `checkout.session.expired`

---

### 3. Cloudinary (Image Storage)

**Purpose**: Store course thumbnails

**Configuration**:
```javascript
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});
```

**Upload**:
```javascript
const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
  folder: "course_images"
});
// Returns: { secure_url: "https://..." }
```

---

### 4. YouTube (Video Hosting)

**Purpose**: Host course lecture videos

**Frontend**:
```javascript
import YouTube from "react-youtube";

<YouTube
  videoId={getVideoId(lectureUrl)}
  opts={{ width: "100%", height: "100%" }}
/>
```

**Embed URLs**: Videos embedded via YouTube iframe API

---

### 5. Quill (Rich Text Editor)

**Purpose**: Create formatted course descriptions

**Frontend**:
```javascript
import Quill from "quill";

const quillRef = useRef();

<Quill
  ref={quillRef}
  theme="snow"
  modules={{ toolbar: [["bold", "italic"], ["list"], ["link"]] }}
/>

// Get HTML
const description = quillRef.current.root.innerHTML;
```

---

## Environment Configuration

### Server `.env`

```env
# Server
PORT=5000

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/lms

# Clerk
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret

# Currency
CURRENCY=usd
```

### Client `.env`

```env
# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Backend
VITE_BACKEND_URL=http://localhost:5000

# Display
VITE_CURRENCY=$
```

---

## Deployment

### Frontend (Vercel)

**File**: `client/vercel.json`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Environment Variables**:
- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_BACKEND_URL` (production backend URL)
- `VITE_CURRENCY`

**Deploy**:
```bash
cd client
npm run build
vercel deploy
```

### Backend (Vercel)

**File**: `server/vercel.json`

```json
{
  "version": 2,
  "builds": [{
    "src": "server.js",
    "use": "@vercel/node"
  }],
  "routes": [{
    "src": "/(.*)",
    "dest": "server.js"
  }]
}
```

**Environment Variables**:
- `PORT` (Vercel sets this automatically)
- `MONGODB_URI`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET_KEY`
- `CURRENCY`

**Deploy**:
```bash
cd server
vercel deploy
```

---

## Key Features Summary

### Student Features
- ✅ Browse and search courses by category
- ✅ View detailed course information with free preview lectures
- ✅ Secure payment via Stripe
- ✅ Track learning progress with visual progress bars
- ✅ Rate completed courses (1-5 stars)
- ✅ Access enrolled courses anytime
- ✅ Responsive mobile-friendly design

### Educator Features
- ✅ Upgrade from student to educator role
- ✅ Create courses with rich text descriptions (Quill)
- ✅ Upload course thumbnails (Cloudinary)
- ✅ Organize content into chapters and lectures
- ✅ Set pricing and discounts
- ✅ View dashboard analytics (earnings, enrollments, ratings)
- ✅ Track student enrollments per course

### Technical Highlights
- 🔐 JWT authentication with Clerk
- 🛡️ Protected routes with role-based access control
- 🔄 Webhook-driven data synchronization (Clerk, Stripe)
- ☁️ Cloud-based storage (MongoDB Atlas, Cloudinary)
- ⚡ Fast builds with Vite
- 📱 Responsive design with Tailwind CSS
- 🎥 Video hosting via YouTube
- 💳 Payment processing with Stripe

---

## Quick Start Guide

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Clerk account
- Stripe account
- Cloudinary account

### Installation

```bash
# Clone repository
git clone <repo-url>
cd lms-main

# Install frontend
cd client
npm install

# Install backend
cd ../server
npm install
```

### Running Locally

```bash
# Terminal 1: Backend
cd server
npm run dev  # Runs on http://localhost:5000

# Terminal 2: Frontend
cd client
npm run dev  # Runs on http://localhost:5173
```

### Build for Production

```bash
# Frontend
cd client
npm run build

# Backend (Vercel handles this automatically)
```

---

## Project Statistics

- **Frontend Files**: ~30 React components
- **Backend Files**: ~15 API endpoints
- **Database Models**: 4 (User, Course, Purchase, CourseProgress)
- **Third-Party Services**: 5 (Clerk, Stripe, Cloudinary, YouTube, MongoDB)
- **Lines of Code**: ~10,000+ (estimated)

---

*Documentation generated for LLM context understanding - March 2026*
