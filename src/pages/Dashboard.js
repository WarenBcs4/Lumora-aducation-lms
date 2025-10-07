import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { Search, Bell, BookOpen, Clock, TrendingUp, Users, Award, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';

const Dashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const { documents: courses, getDocuments } = useFirestore('courses');
  const [recentCourses, setRecentCourses] = useState([]);

  const progressData = [
    { month: 'Jan', progress: 65 },
    { month: 'Feb', progress: 72 },
    { month: 'Mar', progress: 68 },
    { month: 'Apr', progress: 85 },
    { month: 'May', progress: 92 }
  ];

  const activityData = [
    { day: 'Mon', hours: 3.2 },
    { day: 'Tue', hours: 2.8 },
    { day: 'Wed', hours: 4.1 },
    { day: 'Thu', hours: 3.5 },
    { day: 'Fri', hours: 2.9 },
    { day: 'Sat', hours: 1.8 },
    { day: 'Sun', hours: 2.3 }
  ];

  const upcomingEvents = [
    { title: 'React Advanced Workshop', date: 'May 25, 2024', time: '2:00 PM' },
    { title: 'JavaScript Assessment', date: 'May 27, 2024', time: '10:00 AM' },
    { title: 'UI/UX Design Review', date: 'May 30, 2024', time: '3:30 PM' }
  ];

  useEffect(() => {
    getDocuments();
  }, []);

  useEffect(() => {
    if (courses.length) {
      setRecentCourses(courses.slice(0, 4));
    }
  }, [courses]);

  const stats = [
    { label: 'Available Courses', value: courses.length || 0, icon: BookOpen, color: 'bg-orange-500' },
    { label: 'Hours Learned', value: '24.5', icon: Clock, color: 'bg-orange-400' },
    { label: 'Certificates', value: '3', icon: Award, color: 'bg-orange-600' },
    { label: 'Study Streak', value: '12 days', icon: TrendingUp, color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                  Lumora LMS
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search courses, topics..."
                  className="w-64 pl-10 pr-4 py-2 bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300 transition-all duration-300"
                />
              </div>
              
              <button className="relative p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50/50 rounded-xl transition-all duration-300">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-orange-500 rounded-full animate-pulse"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
                  alt="Profile"
                  className="h-8 w-8 rounded-full ring-2 ring-white/50"
                />
                <span className="text-sm font-medium text-gray-700">
                  {userProfile?.firstName || 'User'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userProfile?.firstName || 'Student'}! 👋
          </h1>
          <p className="text-gray-600">Here's what's happening with your learning journey today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Available Courses */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Available Courses</h2>
                <Link to="/courses" className="text-orange-600 hover:text-orange-700 text-sm font-medium">View All</Link>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {recentCourses.map((course, index) => (
                  <Link key={course.id} to={`/course/${course.id}`} className="group border border-gray-200 hover:border-orange-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 block">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors duration-300">
                        <BookOpen className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1 group-hover:text-orange-600 transition-colors duration-300">{course.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{course.category}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-orange-600">
                            {(course.pricing?.fullCoursePrice || course.price || 0) === 0 ? 'Free' : `$${course.pricing?.fullCoursePrice || course.price}`}
                          </div>
                          <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full">
                            {course.level}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Learning Progress Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Learning Progress</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Line 
                      type="monotone" 
                      dataKey="progress" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Upcoming Events */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Weekly Activity</h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis hide />
                    <Bar dataKey="hours" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-gray-900">20.6h</div>
                <div className="text-sm text-gray-500">Total this week</div>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Award className="h-8 w-8" />
                <div>
                  <h3 className="font-semibold">Achievement Unlocked!</h3>
                  <p className="text-sm opacity-90">7-day learning streak</p>
                </div>
              </div>
              <p className="text-sm opacity-80">Keep up the great work! You're on fire 🔥</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;