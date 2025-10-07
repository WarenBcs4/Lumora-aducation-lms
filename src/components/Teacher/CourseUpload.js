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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-light text-slate-800 mb-3" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>Create New Course</h1>
            <p className="text-slate-500 font-light">Share your knowledge with the world</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Course Title"
                  value={courseData.title}
                  onChange={handleInputChange}
                  className="w-full px-0 py-4 text-lg bg-transparent border-0 border-b border-slate-200 focus:border-blue-400 focus:outline-none transition-colors duration-300 placeholder-slate-400"
                  style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                />
              </div>
              
              <div>
                <select
                  name="category"
                  required
                  value={courseData.category}
                  onChange={handleInputChange}
                  className="w-full px-0 py-4 text-lg bg-transparent border-0 border-b border-slate-200 focus:border-blue-400 focus:outline-none transition-colors duration-300 text-slate-600"
                  style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                >
                  <option value="" className="text-slate-400">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <textarea
                  name="description"
                  required
                  rows={4}
                  placeholder="Course Description"
                  value={courseData.description}
                  onChange={handleInputChange}
                  className="w-full px-0 py-4 text-lg bg-transparent border-0 border-b border-slate-200 focus:border-blue-400 focus:outline-none transition-colors duration-300 placeholder-slate-400 resize-none"
                  style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <select
                    name="level"
                    value={courseData.level}
                    onChange={handleInputChange}
                    className="w-full px-0 py-4 text-lg bg-transparent border-0 border-b border-slate-200 focus:border-blue-400 focus:outline-none transition-colors duration-300 text-slate-600"
                    style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    placeholder="Price ($)"
                    value={courseData.price}
                    onChange={handleInputChange}
                    className="w-full px-0 py-4 text-lg bg-transparent border-0 border-b border-slate-200 focus:border-blue-400 focus:outline-none transition-colors duration-300 placeholder-slate-400"
                    style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'thumbnail')}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label 
                      htmlFor="thumbnail-upload" 
                      className="cursor-pointer flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-300 group"
                    >
                      <Upload className="h-8 w-8 text-slate-400 group-hover:text-blue-400 transition-colors duration-300 mb-2" />
                      <span className="text-sm text-slate-500 group-hover:text-blue-500 transition-colors duration-300" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                        {courseData.thumbnail ? courseData.thumbnail.name : 'Upload Thumbnail'}
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <div className="relative group">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, 'pdfFile')}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label 
                      htmlFor="pdf-upload" 
                      className="cursor-pointer flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-300 group"
                    >
                      <FileText className="h-8 w-8 text-slate-400 group-hover:text-blue-400 transition-colors duration-300 mb-2" />
                      <span className="text-sm text-slate-500 group-hover:text-blue-500 transition-colors duration-300" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                        {courseData.pdfFile ? courseData.pdfFile.name : 'Upload PDF'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {courseData.episodes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-light text-slate-700" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>Video Episodes</h3>
                    <button
                      type="button"
                      onClick={addEpisode}
                      className="flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-300"
                      style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Episode
                    </button>
                  </div>

                  {courseData.episodes.map((episode, index) => (
                    <div key={episode.id} className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-slate-700" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>Episode {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeEpisode(index)}
                          className="text-slate-400 hover:text-red-500 transition-colors duration-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          placeholder="Episode title"
                          value={episode.title}
                          onChange={(e) => updateEpisode(index, 'title', e.target.value)}
                          className="px-0 py-3 bg-transparent border-0 border-b border-slate-200 focus:border-blue-400 focus:outline-none transition-colors duration-300 placeholder-slate-400"
                          style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                        />
                        <input
                          type="text"
                          placeholder="Duration (e.g., 10:30)"
                          value={episode.duration}
                          onChange={(e) => updateEpisode(index, 'duration', e.target.value)}
                          className="px-0 py-3 bg-transparent border-0 border-b border-slate-200 focus:border-blue-400 focus:outline-none transition-colors duration-300 placeholder-slate-400"
                          style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                        />
                      </div>

                      <div>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => updateEpisode(index, 'videoFile', e.target.files[0])}
                          className="hidden"
                          id={`video-upload-${index}`}
                        />
                        <label 
                          htmlFor={`video-upload-${index}`} 
                          className="cursor-pointer flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-300 group"
                        >
                          <Video className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors duration-300 mr-2" />
                          <span className="text-sm text-slate-500 group-hover:text-blue-500 transition-colors duration-300" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                            {episode.videoFile ? episode.videoFile.name : 'Upload video'}
                          </span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={addEpisode}
                  className="flex items-center px-6 py-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-300 border border-blue-200 hover:border-blue-300"
                  style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Video Episode
                </button>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-4 px-8 rounded-2xl font-medium transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
                style={{fontFamily: 'Inter, system-ui, sans-serif'}}
              >
                {loading ? 'Creating Course...' : 'Create Course'}
              </button>
            </div>
            
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-blue-800 mb-1" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>Quick Course Creation</h3>
                  <p className="text-sm text-blue-700 font-light leading-relaxed" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                    File uploads are temporarily disabled for faster processing. Your course will be created instantly with professional placeholder content.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseUpload;