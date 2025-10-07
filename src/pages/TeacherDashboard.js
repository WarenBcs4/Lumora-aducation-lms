import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { BookOpen, Users, DollarSign, TrendingUp, Plus, Upload, BarChart3, Settings, Search, Bell, MessageCircle, Play, FileText, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';

const TeacherDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const { documents: courses, getDocuments } = useFirestore('courses');
  const [teacherCourses, setTeacherCourses] = useState([]);

  const revenueData = [
    { month: 'Jan', revenue: 1200 },
    { month: 'Feb', revenue: 1800 },
    { month: 'Mar', revenue: 1500 },
    { month: 'Apr', revenue: 2200 },
    { month: 'May', revenue: 2800 },
    { month: 'Jun', revenue: 3200 }
  ];

  useEffect(() => {
    if (currentUser) {
      getDocuments([{ field: 'instructor.id', operator: '==', value: currentUser.uid }]);
    }
  }, [currentUser]);

  useEffect(() => {
    setTeacherCourses(courses);
  }, [courses]);

  const totalStudents = teacherCourses.reduce((sum, course) => sum + (course.studentsCount || 0), 0);
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const avgRating = teacherCourses.length > 0 
    ? teacherCourses.reduce((sum, course) => sum + (course.rating || 0), 0) / teacherCourses.length 
    : 0;

  const stats = [
    { label: 'Total Courses', value: teacherCourses.length, icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Total Students', value: totalStudents, icon: Users, color: 'bg-green-500' },
    { label: 'Total Revenue', value: `$${totalRevenue}`, icon: DollarSign, color: 'bg-purple-500' },
    { label: 'Avg Rating', value: avgRating.toFixed(1), icon: TrendingUp, color: 'bg-orange-500' }
  ];

  if (userProfile?.role !== 'teacher') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only teachers can access this dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
            <p className="text-gray-600">Manage your courses and track performance</p>
          </div>
          <Link
            to="/teacher/upload"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Course
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Revenue Overview</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/teacher/upload"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Plus className="h-5 w-5 text-blue-600 mr-3" />
                <span>Upload New Course</span>
              </Link>
              <Link
                to="/teacher/analytics"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
                <span>View Analytics</span>
              </Link>
              <Link
                to="/teacher/students"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Users className="h-5 w-5 text-purple-600 mr-3" />
                <span>Manage Students</span>
              </Link>
            </div>
          </div>
        </div>

        {/* My Courses */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">My Courses</h2>
          
          {teacherCourses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Course</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Students</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Rating</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teacherCourses.map((course) => (
                    <tr key={course.id} className="border-b border-gray-100">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <img
                            src={course.thumbnail || '/api/placeholder/50/50'}
                            alt={course.title}
                            className="w-12 h-12 rounded-lg mr-3"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900">{course.title}</h3>
                            <p className="text-sm text-gray-600">{course.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-900">{course.studentsCount || 0}</td>
                      <td className="py-4 px-4 text-gray-900">{course.rating?.toFixed(1) || 'N/A'}</td>
                      <td className="py-4 px-4 text-gray-900">${course.price}</td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <Link
                            to={`/course/${course.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-4">Start by uploading your first course</p>
              <Link
                to="/teacher/upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload Course
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;