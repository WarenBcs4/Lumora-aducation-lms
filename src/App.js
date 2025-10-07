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
import TeacherDashboard from './pages/TeacherDashboard';
import CourseUpload from './components/Teacher/CourseUpload';
import TestUpload from './pages/TestUpload';
import AdminDashboard from './components/Admin/Dashboard';
import './App.css';

function AppContent() {
  const { currentUser } = useAuth();
  
  return (
    <div className="App">
      <Header />
      <main>
            <Routes>
              <Route path="/" element={currentUser ? <Dashboard /> : <Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
              <Route path="/my-learning" element={<MyLearning />} />
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
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