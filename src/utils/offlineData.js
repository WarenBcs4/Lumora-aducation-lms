// Mock data for offline mode
export const mockCourses = [
  {
    id: 'course1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React development',
    category: 'Programming',
    level: 'Beginner',
    price: 0,
    thumbnail: 'https://via.placeholder.com/300x200/3B82F6/white?text=React',
    instructor: { name: 'John Doe', id: 'instructor1' },
    featured: true,
    studentsCount: 150,
    rating: 4.5,
    duration: '8 weeks',
    episodes: [
      { id: 'ep1', title: 'Introduction to React', duration: '15:30' },
      { id: 'ep2', title: 'Components and Props', duration: '20:45' }
    ]
  },
  {
    id: 'course2',
    title: 'JavaScript ES6+',
    description: 'Modern JavaScript features and best practices',
    category: 'Programming',
    level: 'Intermediate',
    price: 29.99,
    thumbnail: 'https://via.placeholder.com/300x200/F59E0B/white?text=JavaScript',
    instructor: { name: 'Jane Smith', id: 'instructor2' },
    featured: true,
    studentsCount: 200,
    rating: 4.7,
    duration: '6 weeks',
    episodes: [
      { id: 'ep1', title: 'Arrow Functions', duration: '12:20' },
      { id: 'ep2', title: 'Destructuring', duration: '18:15' }
    ]
  },
  {
    id: 'course3',
    title: 'UI/UX Design Principles',
    description: 'Create beautiful and user-friendly interfaces',
    category: 'Design',
    level: 'Beginner',
    price: 19.99,
    thumbnail: 'https://via.placeholder.com/300x200/8B5CF6/white?text=Design',
    instructor: { name: 'Mike Johnson', id: 'instructor3' },
    featured: false,
    studentsCount: 85,
    rating: 4.3,
    duration: '4 weeks',
    episodes: [
      { id: 'ep1', title: 'Design Fundamentals', duration: '25:10' },
      { id: 'ep2', title: 'Color Theory', duration: '22:30' }
    ]
  }
];

export const mockUsers = [
  {
    id: 'user1',
    firstName: 'Demo',
    lastName: 'Student',
    email: 'student@demo.com',
    role: 'student',
    enrolledCourses: ['course1', 'course2'],
    purchasedContent: ['pdf_course1', 'episode_course2_ep2']
  },
  {
    id: 'user2',
    firstName: 'Demo',
    lastName: 'Teacher',
    email: 'teacher@demo.com',
    role: 'teacher',
    enrolledCourses: [],
    purchasedContent: []
  }
];

export const getOfflineData = (collection, conditions = []) => {
  switch (collection) {
    case 'courses':
      return mockCourses;
    case 'users':
      return mockUsers;
    default:
      return [];
  }
};