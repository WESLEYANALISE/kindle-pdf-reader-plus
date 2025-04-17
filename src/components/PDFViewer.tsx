
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { PDFReaderState } from '../hooks/usePDFReader';
import { Loader2 } from 'lucide-react';

// Set up the worker source for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfUrl: string | null;
  currentPage: number;
  scale: number;
  fontSize: string;
  highlights: PDFReaderState['highlights'];
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  pdfUrl,
  currentPage,
  scale,
  fontSize,
  highlights,
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

  // Function to handle text highlighting
  const handleHighlight = () => {
    // This is a placeholder for the highlight functionality
    // In a real implementation, we would store the selection range
    // and add a background color to it
    console.log('Highlighting:', selectedText);
  };

  useEffect(() => {
    // Add event listener for mouseup to detect text selection
    document.addEventListener('mouseup', handleTextSelection);
    
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
    };
  }, []);

  // Function to render highlights
  const renderHighlights = () => {
    return highlights
      .filter(h => h.page === currentPage)
      .map((highlight, index) => (
        <div 
          key={index}
          className="absolute bg-reader-highlight pointer-events-none"
          style={{
            left: `${highlight.rects[0].left}px`,
            top: `${highlight.rects[0].top}px`,
            width: `${highlight.rects[0].width}px`,
            height: `${highlight.rects[0].height}px`
          }}
        />
      ));
  };

  if (!pdfUrl) return null;

  return (
    <div className="pdf-container flex flex-col items-center relative">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => console.error('Error loading PDF:', error)}
        loading={
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando PDF...</span>
          </div>
        }
        className="pdf-document"
      >
        <div className="relative">
          <Page
            pageNumber={currentPage}
            scale={scale}
            className={`pdf-page reader-text-${fontSize}`}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            onLoadSuccess={() => setIsLoading(false)}
            onRenderSuccess={() => {
              // Additional rendering logic if needed
            }}
          />
          {!isLoading && renderHighlights()}
        </div>
      </Document>
    </div>
  );
};

export default PDFViewer;
