
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
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
  fontSize: string;
  isDarkMode: boolean;
  bookmarks: number[];
  onPrevPage: () => void;
  onNextPage: () => void;
  onZoom: (delta: number) => void;
  onToggleDarkMode: () => void;
  onChangeFontSize: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
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

  return (
    <div className="flex flex-col space-y-4">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onToggleDarkMode} 
            title={isDarkMode ? "Modo claro" : "Modo escuro"}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" title="Tamanho da fonte">
                <Type className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => onChangeFontSize('sm')}>
                  <span className={fontSize === 'sm' ? 'font-bold' : ''}>Pequeno</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onChangeFontSize('md')}>
                  <span className={fontSize === 'md' ? 'font-bold' : ''}>Médio</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onChangeFontSize('lg')}>
                  <span className={fontSize === 'lg' ? 'font-bold' : ''}>Grande</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onChangeFontSize('xl')}>
                  <span className={fontSize === 'xl' ? 'font-bold' : ''}>Extra grande</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            variant={isBookmarked ? "default" : "outline"} 
            size="icon" 
            onClick={() => onToggleBookmark(currentPage)}
            title={isBookmarked ? "Remover marcador" : "Adicionar marcador"}
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon" title="Destacar texto">
            <TextSelect className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => onZoom(-0.1)} title="Diminuir zoom">
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="text-sm font-medium w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          
          <Button variant="outline" size="icon" onClick={() => onZoom(0.1)} title="Aumentar zoom">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Page Navigation */}
      <div className="page-controls">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onPrevPage} 
          disabled={currentPage <= 1}
          title="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center space-x-2">
          <input
            type="number"
            min={1}
            max={numPages}
            value={currentPage}
            onChange={handleGoToPage}
            className="w-12 h-8 text-center rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          />
          <span className="text-sm whitespace-nowrap">
            de {numPages}
          </span>
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onNextPage} 
          disabled={currentPage >= numPages}
          title="Próxima página"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Bookmarks dropdown */}
      {bookmarks.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Marcadores</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              {bookmarks.sort((a, b) => a - b).map((page) => (
                <DropdownMenuItem key={page} onClick={() => onGoToPage(page)}>
                  Página {page}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default ReadingControls;
