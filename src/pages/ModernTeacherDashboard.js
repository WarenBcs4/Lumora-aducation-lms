import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { BookOpen, Users, DollarSign, TrendingUp, Upload, BarChart3, Settings, Search, Bell, MessageCircle, Play, FileText, Video, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';

const ModernTeacherDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const { documents: courses, getDocuments } = useFirestore('courses');
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const revenueData = [
    { month: 'Jan', revenue: 1200, students: 45 },
    { month: 'Feb', revenue: 1800, students: 62 },
    { month: 'Mar', revenue: 1500, students: 58 },
    { month: 'Apr', revenue: 2200, students: 78 },
    { month: 'May', revenue: 2800, students: 95 },
    { month: 'Jun', revenue: 3200, students: 112 }
  ];

  const students = [
    { name: 'Alice Johnson', progress: 85, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face' },
    { name: 'Bob Smith', progress: 72, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
    { name: 'Carol Davis', progress: 94, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' }
  ];

  useEffect(() => {
    if (currentUser) {
      getDocuments([{ field: 'instructorId', operator: '==', value: currentUser.uid }]);
    }
  }, [currentUser]);

  useEffect(() => {
    setTeacherCourses(courses);
  }, [courses]);

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalStudents = teacherCourses.reduce((sum, course) => sum + (course.totalEnrollments || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Lumora LMS</span>
          </div>
          
          <nav className="space-y-2">
            <Link to="/teacher/dashboard" className="flex items-center px-3 py-2 text-blue-600 bg-blue-50 rounded-lg">
              <BookOpen className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
            <Link to="/teacher/courses" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <BookOpen className="h-5 w-5 mr-3" />
              My Courses
            </Link>
            <Link to="/teacher/upload" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Upload className="h-5 w-5 mr-3" />
              Upload Content
            </Link>
            <Link to="/teacher/students" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Users className="h-5 w-5 mr-3" />
              Students
            </Link>
            <Link to="/teacher/analytics" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <BarChart3 className="h-5 w-5 mr-3" />
              Analytics
            </Link>
            <Link to="/teacher/settings" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search courses, students..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <MessageCircle className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">
                  {userProfile?.firstName || 'Teacher'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {userProfile?.firstName || 'Teacher'}!</h1>
            <p className="text-gray-600">Here's what's happening with your courses today</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{teacherCourses.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-100">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${totalRevenue}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-100">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Content Upload */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Content Upload</h2>
                  <Link to="/teacher/upload" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Upload New
                  </Link>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Drag & drop your files here</h3>
                  <p className="text-gray-600 mb-4">Support for PDF, eBooks, and video files</p>
                  
                  <div className="flex justify-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-red-500" />
                      <span className="text-sm text-gray-600">PDF</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-600">eBook</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Video className="h-5 w-5 text-purple-500" />
                      <span className="text-sm text-gray-600">Video</span>
                    </div>
                  </div>
                  
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Choose Files
                  </button>
                </div>
              </div>

              {/* Analytics */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Revenue Analytics</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
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
              {/* Monetization */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Monetization</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PDF Price</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">$</span>
                      <input 
                        type="number" 
                        defaultValue="2" 
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video Episode Price</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">$</span>
                      <input 
                        type="number" 
                        defaultValue="3" 
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                    Update Pricing
                  </button>
                </div>
              </div>

              {/* Student Management */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Students</h2>
                
                <div className="space-y-4">
                  {students.map((student, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <img 
                        src={student.avatar} 
                        alt={student.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{student.name}</h3>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{student.progress}% complete</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Video */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Course</h2>
                
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop"
                    alt="Featured Course"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-white bg-opacity-90 p-3 rounded-full hover:bg-opacity-100">
                      <Play className="h-6 w-6 text-blue-600" />
                    </button>
                  </div>
                </div>
                
                <h3 className="font-medium text-gray-900 mt-3">React Fundamentals</h3>
                <p className="text-sm text-gray-600">125 students enrolled</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTeacherDashboard;