import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, DollarSign } from 'lucide-react';

const CourseCard = ({ course }) => {
  const {
    id,
    title,
    description,
    thumbnail,
    instructorName,
    pricing,
    price,
    category,
    level
  } = course;

  const coursePrice = pricing?.fullCoursePrice || price || 0;

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200">
      <div className="relative overflow-hidden">
        <img
          src={thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop'}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3">
          <span className="bg-orange-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
            {level}
          </span>
        </div>
        {coursePrice === 0 && (
          <div className="absolute top-3 left-3">
            <span className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
              Free
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="mb-3">
          <span className="inline-block bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-medium">
            {category}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>
        
        <div className="text-sm text-gray-500 mb-4">
          By {instructorName || 'Lumora Instructor'}
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-medium text-gray-700">4.8</span>
            <span className="text-xs text-gray-500">(124)</span>
          </div>
          
          <div className="text-right">
            <span className="text-2xl font-bold text-orange-600">
              {coursePrice === 0 ? 'Free' : `$${coursePrice}`}
            </span>
          </div>
        </div>
        
        <Link
          to={`/course/${id}`}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 text-center block transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          Explore Course
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;