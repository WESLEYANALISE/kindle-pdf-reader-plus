
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    if (files.length === 0) return;

    const file = files[0];
    
    // Check file type
    if (file.type !== 'application/pdf') {
      toast.error('Por favor, selecione um arquivo PDF válido.');
      return;
    }

    // Check file size (limit to 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('O arquivo é muito grande. Tamanho máximo de 50MB.');
      return;
    }

    onFileUpload(file);
    toast.success('PDF carregado com sucesso!');
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={`w-full max-w-xl mx-auto rounded-lg border-2 border-dashed p-8 flex flex-col items-center justify-center cursor-pointer transition-colors
        ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="application/pdf" 
        onChange={handleFileInputChange}
      />
      
      <UploadCloud className="h-16 w-16 text-gray-500 mb-4" />
      
      <h3 className="text-lg font-semibold mb-2">Arraste e solte o seu PDF aqui</h3>
      <p className="text-sm text-gray-500 mb-4 text-center">
        ou clique para selecionar um arquivo do seu computador
      </p>
      
      <Button variant="outline" size="sm">
        Selecionar arquivo PDF
      </Button>
      
      <div className="mt-4 text-xs text-gray-400">
        Suporta arquivos PDF (máx. 50MB)
      </div>
    </div>
  );
};

export default FileUpload;
