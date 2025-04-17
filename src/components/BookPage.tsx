
import React, { useEffect, useState } from 'react';
import { PageContent } from '@/hooks/usePDFReader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface BookPageProps {
  content: PageContent;
  pageNumber: number;
  fontSize: 'md' | 'lg' | 'xl' | '2xl';
  isLeft: boolean;
  isFlipping: boolean;
  isDarkMode: boolean;
  highlights: { page: number; text: string; rects: DOMRect[] }[];
}

const BookPage: React.FC<BookPageProps> = ({
  content,
  pageNumber,
  fontSize,
  isLeft,
  isFlipping,
  isDarkMode,
  highlights
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const fontSizeClass = {
    'md': 'text-lg',
    'lg': 'text-xl',
    'xl': 'text-2xl',
    '2xl': 'text-3xl',
  }[fontSize];

  const highlightsForPage = highlights.filter(h => h.page === pageNumber);

  // Function to highlight text
  const highlightText = (text: string) => {
    if (highlightsForPage.length === 0) return text;
    
    // Simple highlighting approach - replace highlighted phrases with marked versions
    let result = text;
    highlightsForPage.forEach(highlight => {
      const regex = new RegExp(highlight.text, 'gi');
      result = result.replace(regex, `<mark class="bg-reader-highlight">${highlight.text}</mark>`);
    });
    
    return result;
  };

  return (
    <div
      className={cn(
        'book-page w-full h-full relative bg-reader-page dark:bg-gray-800 overflow-hidden',
        isDarkMode ? 'text-gray-200' : 'text-gray-800',
        isFlipping && (isLeft ? 'animate-page-turn-left' : 'animate-page-turn-right'),
        isLoaded ? 'opacity-100' : 'opacity-0',
        'transition-opacity duration-500'
      )}
    >
      <div className="absolute inset-0 pointer-events-none page-shadow"></div>
      <ScrollArea className="p-8 h-full">
        <div className={`${fontSizeClass} leading-relaxed book-content`}>
          {/* Page number */}
          <div className="text-center mb-4 text-gray-600 dark:text-gray-400">
            Página {pageNumber}
          </div>
          
          {/* Text content with highlighted text */}
          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: highlightText(content.text) }}
          />
          
          {/* Images */}
          {content.images && content.images.map((src, idx) => (
            <div key={idx} className="my-4 flex justify-center">
              <img src={src} alt={`Image ${idx + 1}`} className="max-w-full" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BookPage;
