import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { Search, Bell, BookOpen, Clock, Award, TrendingUp, ChevronDown, User, Settings, LogOut, Calendar, Play, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';

const ModernDashboard = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const { documents: courses, getDocuments } = useFirestore('courses');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [recentCourses, setRecentCourses] = useState([]);
  const navigate = useNavigate();

  const progressData = [
    { day: 'Mon', hours: 3.2 },
    { day: 'Tue', hours: 2.8 },
    { day: 'Wed', hours: 4.1 },
    { day: 'Thu', hours: 3.5 },
    { day: 'Fri', hours: 2.9 },
    { day: 'Sat', hours: 1.8 },
    { day: 'Sun', hours: 2.3 }
  ];

  const upcomingEvents = [
    { title: 'React Advanced Workshop', date: 'May 25, 2024', time: '2:00 PM', type: 'workshop' },
    { title: 'JavaScript Assessment', date: 'May 27, 2024', time: '10:00 AM', type: 'assessment' },
    { title: 'UI/UX Design Review', date: 'May 30, 2024', time: '3:30 PM', type: 'review' }
  ];

  useEffect(() => {
    getDocuments();
  }, []);

  useEffect(() => {
    if (courses.length) {
      setRecentCourses(courses.slice(0, 4));
    }
  }, [courses]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const stats = [
    { 
      label: 'Available Courses', 
      value: courses.length || 0, 
      icon: '🧠', 
      gradient: 'from-blue-400 to-blue-600',
      glow: 'shadow-blue-200'
    },
    { 
      label: 'Hours Learned', 
      value: '24.5', 
      icon: '⏱️', 
      gradient: 'from-purple-400 to-purple-600',
      glow: 'shadow-purple-200'
    },
    { 
      label: 'Certificates Earned', 
      value: '3', 
      icon: '🎓', 
      gradient: 'from-green-400 to-green-600',
      glow: 'shadow-green-200'
    },
    { 
      label: 'Study Streak', 
      value: '12 days', 
      icon: '🔥', 
      gradient: 'from-orange-400 to-orange-600',
      glow: 'shadow-orange-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Lumora LMS
                </span>
              </div>
            </div>

            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search courses, topics..."
                  className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-3 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-xl transition-all duration-300">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 p-2 hover:bg-white/50 rounded-xl transition-all duration-300"
                >
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
                    alt="Profile"
                    className="h-8 w-8 rounded-full ring-2 ring-white/50"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {userProfile?.firstName || 'User'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 py-2">
                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-white/50 transition-colors">
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </Link>
                    {userProfile?.role === 'teacher' && (
                      <Link to="/teacher-dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-white/50 transition-colors">
                        <BookOpen className="h-4 w-4 mr-3" />
                        Teacher Dashboard
                      </Link>
                    )}
                    <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-white/50 transition-colors">
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
            Welcome back, {userProfile?.firstName || 'User'}! 👋
          </h1>
          <p className="text-lg text-gray-600 font-light">Here's what's happening with your learning journey today.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`group bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 hover:shadow-2xl hover:${stat.glow} transition-all duration-500 hover:scale-105`}>
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{stat.icon}</div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Available Courses */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Available Courses</h2>
                <Link to="/courses" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                  View All
                  <ChevronDown className="h-4 w-4 ml-1 rotate-[-90deg]" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {recentCourses.map((course, index) => (
                  <Link key={course.id} to={`/course/${course.id}`} className="group block">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{course.category}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span className="text-sm font-medium">4.8</span>
                            </div>
                            <span className="text-lg font-bold text-blue-600">
                              {(course.pricing?.fullCoursePrice || course.price || 0) === 0 ? 'Free' : `$${course.pricing?.fullCoursePrice || course.price}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Weekly Activity */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Weekly Activity</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <YAxis hide />
                    <Bar dataKey="hours" fill="url(#gradient)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#1D4ED8" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Upcoming Events */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white/50 rounded-2xl hover:bg-white/70 transition-colors">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 animate-pulse"></div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">🎉</div>
                  <div>
                    <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
                    <p className="text-sm opacity-90">7-day learning streak</p>
                  </div>
                </div>
                <p className="text-sm opacity-80 leading-relaxed">Keep up the great work! You're on fire 🔥</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;