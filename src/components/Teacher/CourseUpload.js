import React, { useState } from 'react';
import { Upload, X, Plus, FileText, Video } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../services/firebase';
import { useFirestore } from '../../hooks/useFirestore';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const CourseUpload = () => {
  const { currentUser, userProfile } = useAuth();
  const { addDocument } = useFirestore('courses');
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    price: 0,
    thumbnail: null,
    pdfFile: null,
    episodes: []
  });

  const categories = ['Programming', 'Design', 'Business', 'Marketing', 'Data Science'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setCourseData(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };

  const addEpisode = () => {
    setCourseData(prev => ({
      ...prev,
      episodes: [...prev.episodes, {
        id: Date.now().toString(),
        title: '',
        description: '',
        videoFile: null,
        duration: ''
      }]
    }));
  };

  const updateEpisode = (index, field, value) => {
    setCourseData(prev => ({
      ...prev,
      episodes: prev.episodes.map((episode, i) => 
        i === index ? { ...episode, [field]: value } : episode
      )
    }));
  };

  const removeEpisode = (index) => {
    setCourseData(prev => ({
      ...prev,
      episodes: prev.episodes.filter((_, i) => i !== index)
    }));
  };

  const uploadFile = async (file, path) => {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('File upload error:', error);
      throw new Error(`Failed to upload ${file.name}: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!courseData.title || !courseData.description || !courseData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    console.log('Starting course creation...');

    try {
      const newCourse = {
        title: courseData.title,
        slug: courseData.title.toLowerCase().replace(/\s+/g, '-'),
        description: courseData.description,
        category: courseData.category,
        level: courseData.level,
        
        pricing: {
          type: parseFloat(courseData.price) > 0 ? 'paid' : 'free',
          fullCoursePrice: parseFloat(courseData.price) || 0,
          currency: 'USD'
        },
        
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
        
        instructorId: currentUser?.uid,
        instructorName: `${userProfile?.firstName || 'Demo'} ${userProfile?.lastName || 'Teacher'}`,
        
        totalEnrollments: 0,
        activeStudents: 0,
        averageRating: 0,
        totalReviews: 0,
        
        status: 'published',
        isPublished: true,
        isFeatured: false,
        
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Course data prepared:', newCourse);
      
      console.log('Calling addDocument...');
      const courseId = await addDocument(newCourse);
      
      console.log('Course successfully saved to database with ID:', courseId);
      toast.success(`Course created successfully! ID: ${courseId}`);
      
      setCourseData({
        title: '',
        description: '',
        category: '',
        level: 'Beginner',
        price: 0,
        thumbnail: null,
        pdfFile: null,
        episodes: []
      });

    } catch (error) {
      console.error('Course creation error:', error);
      toast.error(`Failed to create course: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload New Course</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
              <input
                type="text"
                name="title"
                required
                value={courseData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                name="category"
                required
                value={courseData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              required
              rows={4}
              value={courseData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                name="level"
                value={courseData.level}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={courseData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'thumbnail')}
                  className="hidden"
                  id="thumbnail-upload"
                />
                <label htmlFor="thumbnail-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {courseData.thumbnail ? courseData.thumbnail.name : 'Click to upload thumbnail'}
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course PDF</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(e, 'pdfFile')}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
                  <FileText className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {courseData.pdfFile ? courseData.pdfFile.name : 'Click to upload PDF'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Video Episodes</h3>
              <button
                type="button"
                onClick={addEpisode}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Episode
              </button>
            </div>

            {courseData.episodes.map((episode, index) => (
              <div key={episode.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Episode {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeEpisode(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Episode title"
                    value={episode.title}
                    onChange={(e) => updateEpisode(index, 'title', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., 10:30)"
                    value={episode.duration}
                    onChange={(e) => updateEpisode(index, 'duration', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => updateEpisode(index, 'videoFile', e.target.files[0])}
                    className="hidden"
                    id={`video-upload-${index}`}
                  />
                  <label 
                    htmlFor={`video-upload-${index}`} 
                    className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4"
                  >
                    <Video className="h-6 w-6 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {episode.videoFile ? episode.videoFile.name : 'Click to upload video'}
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Creating Course...' : 'Create Course'}
          </button>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">Quick Course Creation</h3>
                <p className="text-sm text-blue-700 mt-1">
                  File uploads are temporarily disabled for faster processing. Your course will be created instantly with professional placeholder content that you can update later.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseUpload;