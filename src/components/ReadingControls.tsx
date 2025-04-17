
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Moon, 
  Sun, 
  ZoomIn, 
  ZoomOut,
  BookOpen,
  Bookmark,
  TextSelect,
  Type
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { PDFReaderState } from '../hooks/usePDFReader';

interface ReadingControlsProps {
  currentPage: number;
  numPages: number;
  scale: number;
  fontSize: 'md' | 'lg' | 'xl' | '2xl';
  isDarkMode: boolean;
  bookmarks: number[];
  onPrevPage: () => void;
  onNextPage: () => void;
  onZoom: (delta: number) => void;
  onToggleDarkMode: () => void;
  onChangeFontSize: (size: 'md' | 'lg' | 'xl' | '2xl') => void;
  onToggleBookmark: (page: number) => void;
  onGoToPage: (page: number) => void;
}

const ReadingControls: React.FC<ReadingControlsProps> = ({
  currentPage,
  numPages,
  scale,
  fontSize,
  isDarkMode,
  bookmarks,
  onPrevPage,
  onNextPage,
  onZoom,
  onToggleDarkMode,
  onChangeFontSize,
  onToggleBookmark,
  onGoToPage
}) => {
  const isBookmarked = bookmarks.includes(currentPage);

  const handleGoToPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value, 10);
    if (!isNaN(page) && page >= 1 && page <= numPages) {
      onGoToPage(page);
    }
  };

  const fontSizeNames = {
    'md': 'Médio',
    'lg': 'Grande',
    'xl': 'Extra Grande',
    '2xl': 'Máximo'
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex space-x-2 bg-white dark:bg-gray-800 rounded-full shadow-lg p-2 border border-gray-200 dark:border-gray-700">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleDarkMode} 
          title={isDarkMode ? "Modo claro" : "Modo escuro"}
          className="rounded-full"
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Type className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuGroup>
              {(['md', 'lg', 'xl', '2xl'] as const).map(size => (
                <DropdownMenuItem 
                  key={size} 
                  onClick={() => onChangeFontSize(size)}
                  className={fontSize === size ? 'bg-secondary' : ''}
                >
                  {fontSizeNames[size]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant={isBookmarked ? "default" : "ghost"}
          size="icon" 
          onClick={() => onToggleBookmark(currentPage)}
          className="rounded-full"
        >
          <Bookmark className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onZoom(-0.1)} 
          className="rounded-full"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <span className="flex items-center justify-center w-12 text-sm">
          {Math.round(scale * 100)}%
        </span>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onZoom(0.1)}
          className="rounded-full"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onPrevPage} 
          disabled={currentPage <= 1}
          className="rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center space-x-1">
          <input
            type="number"
            min={1}
            max={numPages}
            value={currentPage}
            onChange={handleGoToPage}
            className="w-12 h-8 text-center rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          />
          <span className="text-sm whitespace-nowrap">
            / {numPages}
          </span>
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onNextPage} 
          disabled={currentPage >= numPages}
          className="rounded-full"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Bookmarks dropdown */}
      {bookmarks.length > 0 && (
        <div className="absolute right-0 bottom-14">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Marcadores</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                {bookmarks.sort((a, b) => a - b).map((page) => (
                  <DropdownMenuItem key={page} onClick={() => onGoToPage(page)}>
                    Página {page}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

export default ReadingControls;
