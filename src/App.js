import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import NetworkStatus from './components/Common/NetworkStatus';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import MyLearning from './pages/MyLearning';
import ModernTeacherDashboard from './pages/ModernTeacherDashboard';
import CourseUpload from './components/Teacher/CourseUpload';
import TestUpload from './pages/TestUpload';
import ProtectedRoute from './components/Common/ProtectedRoute';
import AdminDashboard from './components/Admin/Dashboard';
import './App.css';

function AppContent() {
  const { currentUser, userProfile } = useAuth();
  
  const getDashboardComponent = () => {
    if (!currentUser) return <Home />;
    
    switch (userProfile?.role) {
      case 'teacher':
        return <ModernTeacherDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Dashboard />;
    }
  };
  
  return (
    <div className="App">
      <Header />
      <main>
            <Routes>
              <Route path="/" element={getDashboardComponent()} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/my-learning" element={<MyLearning />} />
              <Route path="/teacher/dashboard" element={<ModernTeacherDashboard />} />
              <Route path="/teacher/upload" element={<CourseUpload />} />
              <Route path="/test-upload" element={<TestUpload />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </main>
          <NetworkStatus />
          <Toaster position="top-right" />
        </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;