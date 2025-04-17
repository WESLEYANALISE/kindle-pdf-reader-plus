
import React from 'react';
import { Book } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Book className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">KindlePDF</h1>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Seu leitor de PDF elegante
        </div>
      </div>
    </header>
  );
};

export default Header;
