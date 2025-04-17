
import { useState, useEffect } from 'react';

export interface PDFReaderState {
  pdfFile: File | null;
  pdfUrl: string | null;
  currentPage: number;
  numPages: number;
  scale: number;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  isDarkMode: boolean;
  highlights: { page: number; text: string; rects: DOMRect[] }[];
  bookmarks: number[];
}

const initialState: PDFReaderState = {
  pdfFile: null,
  pdfUrl: null,
  currentPage: 1,
  numPages: 0,
  scale: 1.0,
  fontSize: 'md',
  isDarkMode: false,
  highlights: [],
  bookmarks: [],
};

export const usePDFReader = () => {
  const [state, setState] = useState<PDFReaderState>(initialState);

  // Handle file upload
  const handleFileUpload = (file: File) => {
    // Revoke previous URL to prevent memory leaks
    if (state.pdfUrl) {
      URL.revokeObjectURL(state.pdfUrl);
    }

    const fileUrl = URL.createObjectURL(file);
    
    setState(prev => ({
      ...prev,
      pdfFile: file,
      pdfUrl: fileUrl,
      currentPage: 1,
      highlights: [],
      bookmarks: []
    }));
  };

  // Set the number of pages after document loads
  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setState(prev => ({
      ...prev,
      numPages
    }));
  };

  // Navigate to a specific page
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= state.numPages) {
      setState(prev => ({
        ...prev,
        currentPage: pageNumber
      }));
    }
  };

  // Navigate to next page
  const nextPage = () => {
    if (state.currentPage < state.numPages) {
      setState(prev => ({
        ...prev,
        currentPage: prev.currentPage + 1
      }));
    }
  };

  // Navigate to previous page
  const prevPage = () => {
    if (state.currentPage > 1) {
      setState(prev => ({
        ...prev,
        currentPage: prev.currentPage - 1
      }));
    }
  };

  // Zoom in/out
  const zoom = (delta: number) => {
    setState(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(2.5, prev.scale + delta))
    }));
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setState(prev => ({
      ...prev,
      isDarkMode: !prev.isDarkMode
    }));

    // Update document class for dark mode
    if (!state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Change font size
  const changeFontSize = (size: 'sm' | 'md' | 'lg' | 'xl') => {
    setState(prev => ({
      ...prev,
      fontSize: size
    }));
  };

  // Add highlight
  const addHighlight = (page: number, text: string, rects: DOMRect[]) => {
    setState(prev => ({
      ...prev,
      highlights: [...prev.highlights, { page, text, rects }]
    }));
  };

  // Toggle bookmark
  const toggleBookmark = (page: number) => {
    setState(prev => {
      const isBookmarked = prev.bookmarks.includes(page);
      
      return {
        ...prev,
        bookmarks: isBookmarked
          ? prev.bookmarks.filter(b => b !== page)
          : [...prev.bookmarks, page]
      };
    });
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (state.pdfUrl) {
        URL.revokeObjectURL(state.pdfUrl);
      }
    };
  }, [state.pdfUrl]);

  return {
    ...state,
    handleFileUpload,
    handleDocumentLoadSuccess,
    goToPage,
    nextPage,
    prevPage,
    zoom,
    toggleDarkMode,
    changeFontSize,
    addHighlight,
    toggleBookmark
  };
};
