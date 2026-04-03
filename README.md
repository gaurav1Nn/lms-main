# Learning Management System (LMS)

A full-stack e-learning platform built with the MERN stack.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Stripe Account
- AWS Account (S3 for video storage)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd lms
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Setup Environment Variables

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
STRIPE_SECRET_KEY=your_stripe_secret_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
REFRESH_TOKEN_EXPIRY=7d

# AWS S3 Configuration
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
S3_BUCKET_NAME=your_s3_bucket_name
PRESIGNED_GET_EXPIRY=14400
PRESIGNED_PUT_EXPIRY=900
```

Create a `.env` file inside the `client/` directory:

```env
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_BACKEND_URL=http://localhost:5000
```

### 4. Start the Application

**Start the Backend Server:**

```bash
cd server
npm run start
```

**Start the Frontend App (in a separate terminal):**

```bash
cd client
npm run dev
```
