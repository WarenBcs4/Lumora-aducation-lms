import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Users, Star, Play, FileText, Lock } from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../contexts/AuthContext';
import PDFViewer from '../components/Course/PDFViewer';
import VideoPlayer from '../components/Course/VideoPlayer';
import PaymentModal from '../components/Payment/PaymentModal';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const { id } = useParams();
  const { currentUser, userProfile } = useAuth();
  const { getDocument, updateDocument } = useFirestore('courses');
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, item: null, amount: 0 });
  const [enrolled, setEnrolled] = useState(false);
  const [purchasedContent, setPurchasedContent] = useState([]);

  useEffect(() => {
    loadCourse();
  }, [id]);

  useEffect(() => {
    if (currentUser && userProfile) {
      setEnrolled(userProfile.enrolledCourses?.includes(id));
      setPurchasedContent(userProfile.purchasedContent || []);
    }
  }, [currentUser, userProfile, id]);

  const loadCourse = async () => {
    const courseData = await getDocument(id);
    setCourse(courseData);
  };

  const handleEnroll = async () => {
    if (!currentUser) {
      toast.error('Please login to enroll');
      return;
    }

    try {
      const updatedCourses = [...(userProfile.enrolledCourses || []), id];
      await updateDocument(currentUser.uid, { enrolledCourses: updatedCourses });
      setEnrolled(true);
      toast.success('Enrolled successfully!');
    } catch (error) {
      toast.error('Enrollment failed');
    }
  };

  const handlePurchase = (item, type) => {
    const amount = type === 'pdf' ? 2 : 3;
    setPaymentModal({
      isOpen: true,
      item: { ...item, type },
      amount
    });
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    try {
      const contentId = `${paymentModal.item.type}_${paymentModal.item.id}`;
      const updatedContent = [...purchasedContent, contentId];
      
      await updateDocument(currentUser.uid, { purchasedContent: updatedContent });
      setPurchasedContent(updatedContent);
      
      setPaymentModal({ isOpen: false, item: null, amount: 0 });
      toast.success('Purchase successful!');
    } catch (error) {
      toast.error('Purchase processing failed');
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isPDFPurchased = purchasedContent.includes(`pdf_${course.pdfId}`);
  const purchasedEpisodes = course.episodes?.filter(ep => 
    purchasedContent.includes(`episode_${ep.id}`)
  ).map(ep => ep.id) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {course.duration}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {course.studentsCount || 0} students
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-400" />
                  {course.rating?.toFixed(1) || 'New'}
                </div>
              </div>

              <div className="text-sm text-gray-600">
                By {course.instructor?.name} • {course.category} • {course.level}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-4">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </div>
              
              {!enrolled ? (
                <button
                  onClick={handleEnroll}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors mb-3"
                >
                  Enroll Now
                </button>
              ) : (
                <div className="bg-green-100 text-green-800 py-2 px-4 rounded-md text-center mb-3">
                  ✓ Enrolled
                </div>
              )}

              <div className="text-sm text-gray-600">
                • First 10 PDF pages free<br/>
                • First video episode free<br/>
                • Full access after purchase
              </div>
            </div>
          </div>
        </div>

        {/* Course Content Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'videos', 'pdf', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">What you'll learn</h3>
                  <ul className="space-y-2">
                    {course.learningObjectives?.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Course Content</h3>
                  <div className="space-y-2">
                    {course.episodes?.map((episode, index) => (
                      <div key={episode.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center">
                          <Play className="h-4 w-4 mr-2 text-blue-600" />
                          <span>{episode.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">{episode.duration}</span>
                          {index > 0 && !purchasedEpisodes.includes(episode.id) && (
                            <Lock className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'videos' && enrolled && (
              <div className="space-y-6">
                <VideoPlayer
                  episodes={course.episodes || []}
                  currentEpisode={currentEpisode}
                  courseId={id}
                  purchasedEpisodes={purchasedEpisodes}
                  onPurchaseClick={(episode) => handlePurchase(episode, 'episode')}
                />
                
                <div className="grid gap-2">
                  {course.episodes?.map((episode, index) => (
                    <button
                      key={episode.id}
                      onClick={() => setCurrentEpisode(index)}
                      className={`p-3 text-left border rounded-lg hover:bg-gray-50 ${
                        currentEpisode === index ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{episode.title}</span>
                        <div className="flex items-center space-x-2">
                          {index === 0 && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Free</span>}
                          {index > 0 && purchasedEpisodes.includes(episode.id) && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Purchased</span>
                          )}
                          {index > 0 && !purchasedEpisodes.includes(episode.id) && (
                            <Lock className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'pdf' && enrolled && course.pdfUrl && (
              <PDFViewer
                pdfUrl={course.pdfUrl}
                courseId={id}
                isPurchased={isPDFPurchased}
                onPurchaseClick={() => handlePurchase({ id: course.pdfId, title: course.title }, 'pdf')}
              />
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-8 text-gray-500">
                Reviews feature coming soon...
              </div>
            )}

            {!enrolled && activeTab !== 'overview' && (
              <div className="text-center py-8">
                <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Enrollment Required</h3>
                <p className="text-gray-600 mb-4">Please enroll in this course to access the content.</p>
                <button
                  onClick={handleEnroll}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Enroll Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, item: null, amount: 0 })}
        item={paymentModal.item}
        amount={paymentModal.amount}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default CourseDetail;