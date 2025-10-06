import React, { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const TestUpload = () => {
  const { addDocument } = useFirestore('courses');
  const { currentUser, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const testUpload = async () => {
    setLoading(true);
    
    try {
      const testCourse = {
        title: 'Test Course',
        description: 'This is a test course',
        category: 'Programming',
        level: 'Beginner',
        price: 0,
        thumbnail: 'https://via.placeholder.com/300x200',
        instructor: {
          id: currentUser?.uid || 'test',
          name: 'Test Teacher'
        },
        featured: false,
        studentsCount: 0,
        rating: 0
      };

      console.log('Testing upload with data:', testCourse);
      const result = await addDocument(testCourse);
      console.log('Upload result:', result);
      
      if (result) {
        toast.success(`Course created with ID: ${result}`);
      } else {
        toast.error('Upload failed');
      }
    } catch (error) {
      console.error('Test upload error:', error);
      toast.error('Test failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Test Upload</h2>
      <button
        onClick={testUpload}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Upload'}
      </button>
    </div>
  );
};

export default TestUpload;