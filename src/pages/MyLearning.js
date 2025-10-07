import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { Home, MessageCircle, Calendar, Settings, Star, Clock, BookOpen, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const MyLearning = () => {
  const { currentUser, userProfile } = useAuth();
  const { documents: allCourses, getDocuments } = useFirestore('courses');
  const [activeTab, setActiveTab] = useState('All');
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const studyData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.2 },
    { day: 'Wed', hours: 1.8 },
    { day: 'Thu', hours: 4.1 },
    { day: 'Fri', hours: 2.9 },
    { day: 'Sat', hours: 3.5 },
    { day: 'Sun', hours: 2.1 }
  ];

  const upcomingSchedule = [
    { time: '09:00 AM', title: 'React Fundamentals', type: 'Live Session' },
    { time: '02:00 PM', title: 'JavaScript ES6+', type: 'Workshop' },
    { time: '04:30 PM', title: 'UI/UX Design', type: 'Assignment Due' }
  ];

  useEffect(() => {
    getDocuments();
  }, []);

  useEffect(() => {
    if (allCourses.length) {
      if (userProfile?.enrolledCourses) {
        const enrolled = allCourses.filter(course => 
          userProfile.enrolledCourses.includes(course.id)
        );
        setEnrolledCourses(enrolled);
      } else {
        // Show all courses for demo if no enrollment data
        setEnrolledCourses(allCourses.slice(0, 3));
      }
    }
  }, [allCourses, userProfile]);

  const filterCourses = () => {
    switch (activeTab) {
      case 'Active':
        return enrolledCourses.filter(course => course.status !== 'completed');
      case 'Upcoming':
        return enrolledCourses.filter(course => new Date(course.startDate) > new Date());
      case 'Completed':
        return enrolledCourses.filter(course => course.status === 'completed');
      default:
        return enrolledCourses;
    }
  };

  const getCourseColor = (index) => {
    const colors = ['bg-purple-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-pink-100', 'bg-indigo-100'];
    return colors[index % colors.length];
  };

  const getTextColor = (index) => {
    const colors = ['text-purple-600', 'text-blue-600', 'text-green-600', 'text-yellow-600', 'text-pink-600', 'text-indigo-600'];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-20 bg-gray-900 flex flex-col items-center py-6 space-y-8">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">L</span>
        </div>
        
        <nav className="flex flex-col space-y-6">
          <button className="p-3 rounded-lg bg-blue-600 text-white">
            <Home className="h-5 w-5" />
          </button>
          <button className="p-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            <MessageCircle className="h-5 w-5" />
          </button>
          <button className="p-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            <Calendar className="h-5 w-5" />
          </button>
          <button className="p-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Course Section */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
            <p className="text-gray-600">Continue your learning journey</p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
            {['All', 'Active', 'Upcoming', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Course Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterCourses().map((course, index) => (
              <div key={course.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-full h-32 ${getCourseColor(index)} rounded-xl mb-4 flex items-center justify-center`}>
                  <BookOpen className={`h-8 w-8 ${getTextColor(index)}`} />
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {course.category}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {course.level}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{course.rating?.toFixed(1) || '4.5'}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{course.duration || '8 weeks'}</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.random() * 100}%` }}
                  ></div>
                </div>
                
                <button className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors">
                  Continue Learning
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 p-8 space-y-6">
          {/* Calendar Widget */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">May 2024</h3>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                <div key={day} className="p-2 text-gray-500 font-medium">{day}</div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                <div 
                  key={date} 
                  className={`p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                    date === 15 ? 'bg-blue-600 text-white' : 'text-gray-700'
                  }`}
                >
                  {date}
                </div>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              {upcomingSchedule.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.time} • {item.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hours Spent Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Hours Spent</h3>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studyData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis hide />
                  <Bar dataKey="hours" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <div className="text-2xl font-bold text-gray-900">22.1h</div>
              <div className="text-sm text-gray-500">This week</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLearning;