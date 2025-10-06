import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ pdfUrl, courseId, isPurchased = false, onPurchaseClick }) => {
  const { currentUser } = useAuth();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const freePageLimit = 10;
  const canViewPage = isPurchased || pageNumber <= freePageLimit;

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error) => {
    setError('Failed to load PDF');
    setLoading(false);
  };

  const goToPrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      if (!canViewPage && pageNumber >= freePageLimit) {
        onPurchaseClick?.();
        return;
      }
      setPageNumber(pageNumber + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">PDF Viewer</h3>
        <div className="text-sm text-gray-500">
          Page {pageNumber} of {numPages}
          {!isPurchased && (
            <span className="ml-2 text-blue-600">
              (Free: {Math.min(freePageLimit, numPages)} pages)
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        {canViewPage ? (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            className="flex justify-center"
          >
            <Page
              pageNumber={pageNumber}
              width={Math.min(800, window.innerWidth - 100)}
              className="shadow-lg"
            />
          </Document>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 bg-gray-100 rounded-lg">
            <Lock className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Premium Content
            </h3>
            <p className="text-gray-600 text-center mb-4">
              You've reached the free page limit. Purchase this PDF to continue reading.
            </p>
            <button
              onClick={onPurchaseClick}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Purchase for $2.00
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </button>

        <div className="flex items-center space-x-2">
          <input
            type="number"
            min="1"
            max={numPages}
            value={pageNumber}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= numPages) {
                if (!isPurchased && page > freePageLimit) {
                  onPurchaseClick?.();
                } else {
                  setPageNumber(page);
                }
              }
            }}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
          />
          <span className="text-gray-500">of {numPages}</span>
        </div>

        <button
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      {!isPurchased && pageNumber > freePageLimit - 2 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 text-sm">
            You're approaching the free page limit. Purchase this PDF for full access.
          </p>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;