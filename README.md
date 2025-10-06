# Lumora LMS - React + Firebase

A comprehensive Learning Management System built with React and Firebase, featuring content access control, payment integration, and role-based permissions.

## 🚀 Features

### Core Features
- **User Authentication** - Firebase Auth with role-based access
- **Course Management** - Upload and manage courses, PDFs, videos
- **Payment Integration** - PayPal (global) + InterSend (Kenya)
- **Content Access Control** - Free previews with premium upgrades
- **Progress Tracking** - Track learning progress and completion
- **Admin Dashboard** - Comprehensive management interface

### Content Access Model
- **PDF Access**: First 10 pages free, $2 for full access
- **Video Episodes**: First episode free, $3 per additional episode
- **Course Enrollment**: Free enrollment, pay for premium content

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Configuration
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Enable Storage for file uploads
5. Copy your config to `.env`:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 3. Payment Setup

#### PayPal
1. Create PayPal Developer account
2. Create REST API app
3. Add client ID to `.env`:
```env
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id
```

#### InterSend (Kenya)
1. Register at InterSend
2. Get API credentials
3. Add to `.env`:
```env
REACT_APP_INTERSEND_API_KEY=your_api_key
REACT_APP_INTERSEND_MERCHANT_ID=your_merchant_id
```

### 4. Firestore Collections Structure

#### Users Collection
```javascript
{
  firstName: "John",
  lastName: "Doe", 
  email: "john@example.com",
  role: "student", // student, teacher, admin
  enrolledCourses: ["courseId1", "courseId2"],
  purchasedContent: ["pdf_123", "episode_456"],
  createdAt: timestamp
}
```

#### Courses Collection
```javascript
{
  title: "Course Title",
  description: "Course description",
  category: "Programming",
  level: "Beginner",
  price: 0, // 0 for free courses
  instructor: {
    name: "Instructor Name",
    id: "instructorId"
  },
  thumbnail: "image_url",
  pdfUrl: "pdf_file_url",
  pdfId: "unique_pdf_id",
  episodes: [
    {
      id: "episode_1",
      title: "Episode 1",
      videoUrl: "video_url",
      duration: "10:30"
    }
  ],
  featured: true,
  createdAt: timestamp
}
```

### 5. Run the Application
```bash
npm start
```

## 📱 User Roles & Permissions

### Student
- Browse and enroll in courses
- Access free content (10 PDF pages, first video episode)
- Purchase premium content
- Track learning progress

### Teacher
- Upload course materials
- Set pricing for content
- View student analytics
- Manage course content

### Admin
- Full system access
- User management
- Payment monitoring
- Content moderation

## 💳 Payment Flow

### PDF Purchase ($2.00)
1. User views first 10 pages for free
2. Click "Purchase" for full access
3. Choose PayPal or InterSend
4. Complete payment
5. Instant access to full PDF

### Video Episode Purchase ($3.00)
1. First episode always free
2. Subsequent episodes require purchase
3. Individual episode pricing
4. Instant access after payment

## 🔧 Development

### Project Structure
```
src/
├── components/
│   ├── Auth/          # Login, Register
│   ├── Course/        # CourseCard, PDFViewer, VideoPlayer
│   ├── Payment/       # PaymentModal
│   ├── Layout/        # Header, Footer
│   └── Admin/         # Dashboard, Management
├── pages/             # Home, Courses, CourseDetail
├── contexts/          # AuthContext
├── hooks/             # useFirestore
├── services/          # Firebase config
└── utils/             # Payment services
```

### Key Components

#### PDFViewer
- Displays PDF with page restrictions
- Shows first 10 pages free
- Integrates with payment system

#### VideoPlayer
- Custom video player with controls
- Episode-based access control
- First episode always free

#### PaymentModal
- Dual payment integration
- PayPal for global users
- InterSend for Kenya mobile money

## 🚀 Deployment

### Firebase Hosting
```bash
npm run build
firebase deploy
```

### Environment Variables
Ensure all environment variables are set in your hosting platform.

## 📊 Analytics & Monitoring

The admin dashboard provides:
- User registration metrics
- Course enrollment statistics
- Revenue tracking
- Payment analytics
- Content performance

## 🔒 Security Features

- Firebase Authentication
- Role-based access control
- Secure payment processing
- Content access validation
- Admin-only routes protection

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For support, email support@lumora.com or create an issue in the repository.