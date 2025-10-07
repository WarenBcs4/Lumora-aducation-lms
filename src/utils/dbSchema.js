// Lumora LMS Database Schema Implementation
export const createCourseDocument = (courseData, instructorData) => ({
  title: courseData.title,
  slug: courseData.title.toLowerCase().replace(/\s+/g, '-'),
  description: courseData.description,
  category: courseData.category,
  level: courseData.level,
  thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
  
  pricing: {
    type: courseData.price > 0 ? 'paid' : 'free',
    fullCoursePrice: courseData.price,
    currency: 'USD'
  },
  
  instructorId: instructorData.uid,
  instructorName: instructorData.name,
  
  totalEnrollments: 0,
  averageRating: 0,
  totalReviews: 0,
  
  status: 'published',
  isPublished: true,
  isFeatured: false,
  
  createdAt: new Date(),
  updatedAt: new Date()
});

export const createUserDocument = (userData) => ({
  uid: userData.uid,
  email: userData.email,
  displayName: userData.displayName || `${userData.firstName} ${userData.lastName}`,
  role: userData.role || 'student',
  status: 'active',
  emailVerified: userData.emailVerified || false,
  
  enrolledCourses: [],
  completedCourses: [],
  totalSpent: 0,
  
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLoginAt: new Date()
});

export const createPaymentDocument = (paymentData) => ({
  transactionId: `txn_${Date.now()}`,
  paymentProvider: paymentData.provider,
  userId: paymentData.userId,
  courseId: paymentData.courseId,
  amount: paymentData.amount,
  currency: paymentData.currency || 'USD',
  status: 'completed',
  createdAt: new Date()
});