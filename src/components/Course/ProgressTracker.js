import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';

const ProgressTracker = ({ courseId, userId, progress = 0, completedSections = [], totalSections = 0 }) => {
  const progressPercentage = Math.round((completedSections.length / totalSections) * 100) || progress;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Progress</h3>
        <span className="text-sm text-gray-600">{progressPercentage}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-green-600 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center">
          <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
          <span>{completedSections.length} completed</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 text-gray-400 mr-1" />
          <span>{totalSections - completedSections.length} remaining</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;