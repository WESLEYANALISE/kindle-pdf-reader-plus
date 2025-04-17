
import React from 'react';
import { usePDFReader } from '@/hooks/usePDFReader';
import FileUpload from '@/components/FileUpload';
import PDFViewer from '@/components/PDFViewer';
import ReadingControls from '@/components/ReadingControls';
import Header from '@/components/Header';

const Index = () => {
  const {
    pdfUrl,
    pdfFile,
    currentPage,
    numPages,
    scale,
    fontSize,
    isDarkMode,
    highlights,
    bookmarks,
    pageContents,
    isPageTurning,
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
  } = usePDFReader();

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      <Header />
      
      <main className="flex-1 container mx-auto p-4 md:p-6 relative">
        {!pdfUrl ? (
          <div className="py-12">
            <h1 className="text-3xl font-bold text-center mb-8">Bem-vindo ao KindlePDF</h1>
            <p className="text-lg text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
              Carregue seu arquivo PDF para começar a ler com uma experiência semelhante a um livro,
              incluindo destaque de texto, ajuste de tamanho de fonte, modo escuro e efeito de virada de página.
            </p>
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex justify-between items-center mb-4 w-full">
              <h2 className="text-xl font-semibold truncate">
                {pdfFile?.name || 'Documento PDF'}
              </h2>
            </div>
            
            <div className="reader-container py-4 flex justify-center items-start w-full">
              <PDFViewer
                pdfUrl={pdfUrl}
                currentPage={currentPage}
                scale={scale}
                fontSize={fontSize}
                highlights={highlights}
                pageContents={pageContents}
                isPageTurning={isPageTurning}
                isDarkMode={isDarkMode}
                onDocumentLoadSuccess={handleDocumentLoadSuccess}
              />
            </div>
            
            <ReadingControls
              currentPage={currentPage}
              numPages={numPages}
              scale={scale}
              fontSize={fontSize}
              isDarkMode={isDarkMode}
              bookmarks={bookmarks}
              onPrevPage={prevPage}
              onNextPage={nextPage}
              onZoom={zoom}
              onToggleDarkMode={toggleDarkMode}
              onChangeFontSize={changeFontSize}
              onToggleBookmark={toggleBookmark}
              onGoToPage={goToPage}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
