
import { useState, useEffect } from 'react';
import * as pdfjs from 'pdfjs-dist';

export interface PageContent {
  text: string;
  images: string[];
}

export interface PDFReaderState {
  pdfFile: File | null;
  pdfUrl: string | null;
  currentPage: number;
  numPages: number;
  scale: number;
  fontSize: 'md' | 'lg' | 'xl' | '2xl';
  isDarkMode: boolean;
  highlights: { page: number; text: string; rects: DOMRect[] }[];
  bookmarks: number[];
  pageContents: Record<number, PageContent>;
  isPageTurning: boolean;
}

const initialState: PDFReaderState = {
  pdfFile: null,
  pdfUrl: null,
  currentPage: 1,
  numPages: 0,
  scale: 1.0,
  fontSize: 'xl',
  isDarkMode: false,
  highlights: [],
  bookmarks: [],
  pageContents: {},
  isPageTurning: false,
};

// Configure the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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
      bookmarks: [],
      pageContents: {},
    }));
  };

  // Set the number of pages after document loads
  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setState(prev => ({
      ...prev,
      numPages
    }));
  };

  // Extract text and images from the PDF
  const extractPageContent = async (pageNumber: number) => {
    if (!state.pdfUrl) return;

    try {
      const loadingTask = pdfjs.getDocument(state.pdfUrl);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(pageNumber);
      
      // Extract text
      const textContent = await page.getTextContent();
      const text = textContent.items
        .map((item: any) => 'str' in item ? item.str : '')
        .join(' ');
      
      // For images, we would normally use the render context
      // This is simplified - in a real app you'd extract each image
      const images: string[] = [];
      
      setState(prev => ({
        ...prev,
        pageContents: {
          ...prev.pageContents,
          [pageNumber]: { text, images }
        }
      }));
      
      return { text, images };
    } catch (error) {
      console.error('Error extracting content:', error);
      return { text: '', images: [] };
    }
  };

  // Navigate to a specific page with animation
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= state.numPages && pageNumber !== state.currentPage) {
      setState(prev => ({
        ...prev,
        isPageTurning: true
      }));
      
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          currentPage: pageNumber,
          isPageTurning: false
        }));
      }, 500); // Duration of the animation
    }
  };

  // Navigate to next page
  const nextPage = () => {
    if (state.currentPage < state.numPages) {
      goToPage(state.currentPage + 1);
    }
  };

  // Navigate to previous page
  const prevPage = () => {
    if (state.currentPage > 1) {
      goToPage(state.currentPage - 1);
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
  const changeFontSize = (size: 'md' | 'lg' | 'xl' | '2xl') => {
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

  // Load page content when current page changes
  useEffect(() => {
    if (state.pdfUrl && state.currentPage && !state.pageContents[state.currentPage]) {
      extractPageContent(state.currentPage);
    }
  }, [state.pdfUrl, state.currentPage]);

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
    toggleBookmark,
    extractPageContent
  };
};
