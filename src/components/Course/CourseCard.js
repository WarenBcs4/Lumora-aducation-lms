import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, DollarSign } from 'lucide-react';

const CourseCard = ({ course }) => {
  const {
    id,
    title,
    description,
    thumbnail,
    instructor,
    price,
    duration,
    studentsCount,
    rating,
    category,
    level
  } = course;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={thumbnail || '/api/placeholder/300/200'}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
            {level}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-sm text-blue-600 font-medium">{category}</span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {description}
        </p>
        
        <div className="text-sm text-gray-500 mb-3">
          By {instructor?.name || 'Unknown Instructor'}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {duration || 'Self-paced'}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {studentsCount || 0} students
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">
              {rating ? rating.toFixed(1) : 'New'}
            </span>
          </div>
          
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-lg font-bold text-green-600">
              {price === 0 ? 'Free' : `$${price}`}
            </span>
          </div>
        </div>
        
        <Link
          to={`/course/${id}`}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center block"
        >
          View Course
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;