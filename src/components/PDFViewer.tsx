
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { PageContent, PDFReaderState } from '../hooks/usePDFReader';
import { Loader2 } from 'lucide-react';
import BookPage from './BookPage';

// Set up the worker source for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfUrl: string | null;
  currentPage: number;
  scale: number;
  fontSize: 'md' | 'lg' | 'xl' | '2xl';
  highlights: PDFReaderState['highlights'];
  pageContents: Record<number, PageContent>;
  isPageTurning: boolean;
  isDarkMode: boolean;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  pdfUrl,
  currentPage,
  scale,
  fontSize,
  highlights,
  pageContents,
  isPageTurning,
  isDarkMode,
  onDocumentLoadSuccess
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedText, setSelectedText] = useState('');

  // Function to handle text selection
  const handleTextSelection = () => {
    const selection = window.getSelection();
    
    if (selection && !selection.isCollapsed) {
      setSelectedText(selection.toString());
    }
  };

  useEffect(() => {
    // Add event listener for mouseup to detect text selection
    document.addEventListener('mouseup', handleTextSelection);
    
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
    };
  }, []);

  if (!pdfUrl) return null;

  const currentContent = pageContents[currentPage] || { text: 'Carregando conteúdo...', images: [] };

  return (
    <div className="pdf-viewer-container">
      {/* Original PDF Document (hidden, used for extraction) */}
      <div className="hidden">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => console.error('Error loading PDF:', error)}
        >
          <Page
            pageNumber={currentPage}
            renderTextLayer={true}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>

      {/* Book-like interface */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Preparando seu livro...</span>
        </div>
      )}

      <div className={`book-container ${isLoading ? 'hidden' : 'block'}`}>
        <div 
          className="book relative bg-white dark:bg-gray-900 rounded-lg shadow-2xl mx-auto"
          style={{ 
            width: `${Math.min(800, window.innerWidth - 40)}px`,
            height: `${Math.min(1000, window.innerHeight - 240)}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'center top'
          }}
          onLoad={() => setIsLoading(false)}
        >
          <BookPage
            content={currentContent}
            pageNumber={currentPage}
            fontSize={fontSize}
            isLeft={true}
            isFlipping={isPageTurning}
            isDarkMode={isDarkMode}
            highlights={highlights}
          />
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
