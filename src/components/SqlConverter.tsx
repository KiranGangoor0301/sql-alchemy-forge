
import { useState } from 'react';
import { Upload, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const SqlConverter = () => {
  const [files, setFiles] = useState<File[]>([]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Sybase ➔ Oracle SQL Converter
          </h1>
          <p className="text-lg text-slate-400 font-light">
            Transform your Sybase SQL files into Oracle SQL format with ease and precision
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Panel */}
          <Card className="p-6 bg-slate-800 border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-200">Upload Files</h2>
            <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept=".sql,.txt"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                multiple
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <Upload className="h-12 w-12 text-slate-400" />
                <span className="font-medium text-slate-300">Browse files...</span>
                <span className="text-sm text-slate-400">
                  Supported formats: .sql, .txt
                </span>
              </label>
            </div>
            {files.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-slate-400">
                  {files.length} file(s) selected
                </p>
              </div>
            )}
          </Card>

          {/* Output Panel */}
          <Card className="p-6 bg-slate-800 border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-200">Converted Output</h2>
            <div className="flex flex-col items-center justify-center h-[200px] text-slate-400">
              <ArrowRight className="h-12 w-12 mb-3" />
              <p>No Files Converted Yet</p>
            </div>
          </Card>
        </div>

        {/* Convert Button */}
        <div className="mt-8 text-center">
          <Button 
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-6"
          >
            Convert Files
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SqlConverter;
