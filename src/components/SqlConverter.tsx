import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Header } from './sql-converter/Header';
import { Title } from './sql-converter/Title';
import { FileUpload } from './sql-converter/FileUpload';
import { ConversionOutput } from './sql-converter/ConversionOutput';
import { ProgressIndicator } from './sql-converter/ProgressIndicator';
import { ConvertButton } from './sql-converter/ConvertButton';

const SqlConverter = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState<{ name: string; content: string }[]>([]);
  const [isAnimated, setIsAnimated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [conversionTime, setConversionTime] = useState(0);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error("Please select files to convert first");
      return;
    }
  
    setIsConverting(true);
    setConvertedFiles([]);
    setProgress(0);
    setConversionTime(0);
  
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
  
    // Start progress simulation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(prev + Math.random() * 10 + 5, 100); // Increment progress randomly
      });
    }, 500); // Update every 500ms
  
    // Start time tracking
    const timeInterval = setInterval(() => {
      setConversionTime(prev => prev + 0.5); // Increment time every 500ms
    }, 500);
  
    try {
      const response = await fetch('http://localhost:5000/convert-multiple', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Conversion failed');
      }
  
      const result = await response.json();
      setConvertedFiles(result.files); // Assuming the backend returns an array of { name, content }
  
      toast.success("Conversion completed successfully!");
    } catch (error) {
      toast.error("Error during conversion: " + error.message);
    } finally {
      clearInterval(progressInterval);
      clearInterval(timeInterval);
      setIsConverting(false);
      setProgress(100); // Ensure progress is set to 100% at the end
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 text-foreground p-6">
      <div className="max-w-6xl mx-auto">
        <Header />
        <Title isAnimated={isAnimated} />
        
        <div className="grid md:grid-cols-2 gap-6">
          <FileUpload 
            files={files}
            onFileChange={setFiles}
            isAnimated={isAnimated}
          />
          <ConversionOutput 
            convertedFiles={convertedFiles}
            isAnimated={isAnimated} 
          />
        </div>

        <ProgressIndicator 
          isConverting={isConverting} 
          progress={progress} 
          conversionTime={conversionTime} 
        />

        <ConvertButton 
          isConverting={isConverting}
          disabled={isConverting || files.length === 0}
          onClick={handleConvert}
          isAnimated={isAnimated}
        />
      </div>
    </div>
  );
};

export default SqlConverter;