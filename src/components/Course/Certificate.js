import React from 'react';
import { Award, Download, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Certificate = ({ courseName, studentName, completionDate, instructorName }) => {
  const generatePDF = async () => {
    const element = document.getElementById('certificate');
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('landscape');
    const imgWidth = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${courseName}-certificate.pdf`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Certificate of Completion</h2>
        <div className="flex space-x-2">
          <button
            onClick={generatePDF}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </button>
        </div>
      </div>

      <div id="certificate" className="border-4 border-blue-600 p-12 text-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Award className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Certificate of Completion</h1>
        
        <p className="text-lg text-gray-600 mb-6">This is to certify that</p>
        
        <h2 className="text-3xl font-bold text-blue-600 mb-6">{studentName}</h2>
        
        <p className="text-lg text-gray-600 mb-2">has successfully completed the course</p>
        
        <h3 className="text-2xl font-semibold text-gray-900 mb-8">{courseName}</h3>
        
        <div className="flex justify-between items-end mt-12">
          <div className="text-left">
            <div className="border-t border-gray-400 pt-2">
              <p className="text-sm text-gray-600">Date of Completion</p>
              <p className="font-semibold">{completionDate}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="border-t border-gray-400 pt-2">
              <p className="text-sm text-gray-600">Instructor</p>
              <p className="font-semibold">{instructorName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;