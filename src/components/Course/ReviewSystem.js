import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import toast from 'react-hot-toast';

const ReviewSystem = ({ courseId }) => {
  const { currentUser, userProfile } = useAuth();
  const { documents: reviews, addDocument, getDocuments } = useFirestore('reviews');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    getDocuments([{ field: 'courseId', operator: '==', value: courseId }]);
  }, [courseId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please login to submit a review');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      await addDocument({
        courseId,
        userId: currentUser.uid,
        userName: `${userProfile?.firstName} ${userProfile?.lastName}`,
        rating,
        comment,
        helpful: 0,
        createdAt: new Date()
      });

      setRating(0);
      setComment('');
      setShowReviewForm(false);
      toast.success('Review submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={() => interactive && onStarClick && onStarClick(index + 1)}
      />
    ));
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Reviews</h3>
          <div className="flex items-center mt-1">
            <div className="flex">{renderStars(Math.round(averageRating))}</div>
            <span className="ml-2 text-sm text-gray-600">
              {averageRating.toFixed(1)} ({reviews.length} reviews)
            </span>
          </div>
        </div>
        
        {currentUser && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Write Review
          </button>
        )}
      </div>

      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex">
              {renderStars(rating, true, setRating)}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share your experience with this course..."
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{review.userName}</h4>
                <div className="flex items-center mt-1">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span className="ml-2 text-sm text-gray-500">
                    {new Date(review.createdAt?.toDate()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            {review.comment && (
              <p className="text-gray-700 mb-3">{review.comment}</p>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <button className="flex items-center hover:text-blue-600">
                <ThumbsUp className="h-4 w-4 mr-1" />
                Helpful ({review.helpful || 0})
              </button>
              <button className="flex items-center hover:text-blue-600">
                <MessageCircle className="h-4 w-4 mr-1" />
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSystem;