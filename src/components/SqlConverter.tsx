
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
  const [progress, setProgress] = useState(0);
  const [conversionTime, setConversionTime] = useState(0);
  const [convertedContent, setConvertedContent] = useState<string | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const timeIntervalRef = useRef<number | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);

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

  const handleConvert = () => {
    if (files.length === 0) {
      toast.error("Please select files to convert first");
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setConversionTime(0);
    setConvertedContent(null);
    
    progressIntervalRef.current = window.setInterval(() => {
      setProgress(prev => {
        const increment = Math.max(1, 10 * Math.exp(-prev / 25));
        const newProgress = prev + increment;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 150);
    
    timeIntervalRef.current = window.setInterval(() => {
      setConversionTime(prev => prev + 0.1);
    }, 100);
    
    setTimeout(() => {
      completeConversion();
    }, 3000 + Math.random() * 2000);
  };

  const completeConversion = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
    
    setProgress(100);
    setIsConverting(false);
    
    const sampleContent = files.map(file => 
      `-- Converted from Sybase to Oracle format
/* Original file: ${file.name} */
BEGIN
  EXECUTE IMMEDIATE 'CREATE SEQUENCE my_seq START WITH 1 INCREMENT BY 1';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -955 THEN
      RAISE;
    END IF;
END;
/

CREATE OR REPLACE PROCEDURE sample_proc AS
BEGIN
  FOR rec IN (SELECT * FROM users WHERE active = 1) LOOP
    UPDATE user_stats SET login_count = login_count + 1
    WHERE user_id = rec.id;
  END LOOP;
END;
/`).join('\n\n');
    
    setConvertedContent(sampleContent);
    toast.success("Conversion completed successfully!", {
      description: `Converted ${files.length} file(s) in ${conversionTime.toFixed(1)}s`,
    });
  };

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
    };
  }, []);

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
            convertedContent={convertedContent}
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
