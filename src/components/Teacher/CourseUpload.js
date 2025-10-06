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
    
    if (!currentUser || userProfile?.role !== 'teacher') {
      toast.error('Only teachers can upload courses');
      return;
    }

    setLoading(true);

    try {
      // Check if we're in offline mode
      const isOffline = !navigator.onLine;
      
      if (isOffline) {
        toast.error('You are offline. Please check your internet connection.');
        setLoading(false);
        return;
      }

      let thumbnailUrl = '';
      let pdfUrl = '';
      const episodeUrls = [];

      // Upload files with retry logic
      if (courseData.thumbnail) {
        try {
          thumbnailUrl = await uploadFile(
            courseData.thumbnail, 
            `courses/${currentUser.uid}/thumbnail_${Date.now()}`
          );
        } catch (uploadError) {
          console.warn('Thumbnail upload failed:', uploadError);
          thumbnailUrl = 'https://via.placeholder.com/300x200/3B82F6/white?text=Course';
        }
      }

      if (courseData.pdfFile) {
        try {
          pdfUrl = await uploadFile(
            courseData.pdfFile, 
            `courses/${currentUser.uid}/pdf_${Date.now()}`
          );
        } catch (uploadError) {
          console.warn('PDF upload failed:', uploadError);
          toast.error('PDF upload failed. Please try again.');
          setLoading(false);
          return;
        }
      }

      for (let i = 0; i < courseData.episodes.length; i++) {
        const episode = courseData.episodes[i];
        if (episode.videoFile) {
          try {
            const videoUrl = await uploadFile(
              episode.videoFile,
              `courses/${currentUser.uid}/videos/episode_${i}_${Date.now()}`
            );
            episodeUrls.push({
              ...episode,
              videoUrl,
              videoFile: undefined
            });
          } catch (uploadError) {
            console.warn(`Episode ${i} upload failed:`, uploadError);
            episodeUrls.push({
              ...episode,
              videoUrl: 'https://via.placeholder.com/640x360/8B5CF6/white?text=Video',
              videoFile: undefined
            });
          }
        }
      }

      const courseId = await addDocument({
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        level: courseData.level,
        price: parseFloat(courseData.price),
        thumbnail: thumbnailUrl,
        pdfUrl,
        pdfId: `pdf_${Date.now()}`,
        episodes: episodeUrls,
        instructor: {
          id: currentUser.uid,
          name: `${userProfile?.firstName || 'Teacher'} ${userProfile?.lastName || ''}`
        },
        featured: false,
        studentsCount: 0,
        rating: 0,
        createdAt: new Date()
      });

      if (courseId) {
        toast.success('Course uploaded successfully!');
        
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
      } else {
        toast.error('Upload failed. Please check your connection and try again.');
      }

    } catch (error) {
      console.error('Course upload error:', error);
      toast.error('Upload failed. Please check your connection and try again.');
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
            {loading ? 'Uploading...' : 'Upload Course'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseUpload;