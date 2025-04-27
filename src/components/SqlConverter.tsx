
import { useState, useRef, useEffect } from 'react';
import { Upload, ArrowRight, FileDown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ui/theme-toggle';
import { toast } from 'sonner';

const SqlConverter = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [conversionTime, setConversionTime] = useState(0);
  const [convertedContent, setConvertedContent] = useState<string | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const timeIntervalRef = useRef<number | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Set animation state after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(newFiles);
      // Reset states when new files are selected
      setProgress(0);
      setConversionTime(0);
      setConvertedContent(null);
      
      // Show toast notification
      toast.success(`${newFiles.length} file(s) selected`, {
        description: newFiles.map(file => file.name).join(', '),
        duration: 3000,
      });
    }
  };

  const handleConvert = () => {
    if (files.length === 0) {
      toast.error("Please select files to convert first");
      return;
    }

    // Start conversion process
    setIsConverting(true);
    setProgress(0);
    setConversionTime(0);
    setConvertedContent(null);
    
    // Start progress bar animation
    progressIntervalRef.current = window.setInterval(() => {
      setProgress(prev => {
        // Simulate progress that slows down as it approaches completion
        const increment = Math.max(1, 10 * Math.exp(-prev / 25));
        const newProgress = prev + increment;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 150);
    
    // Start timer
    timeIntervalRef.current = window.setInterval(() => {
      setConversionTime(prev => prev + 0.1);
    }, 100);
    
    // Simulate conversion completion after some time
    setTimeout(() => {
      completeConversion();
    }, 3000 + Math.random() * 2000);
  };

  const completeConversion = () => {
    // Clear intervals
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
    
    // Set progress to 100% when done
    setProgress(100);
    setIsConverting(false);
    
    // Generate sample converted content based on file name(s)
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
    // Clean up intervals on component unmount
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
    };
  }, []);

  const handleDownload = () => {
    if (!convertedContent) return;
    
    const blob = new Blob([convertedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted_oracle_sql.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("File downloaded successfully!");
  };

  const handleLogout = () => {
    signOut();
  };

  const fadeInClass = isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 text-foreground p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between mb-4 items-center transition-all duration-300">
          <Button 
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground transition-colors" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
          <ThemeToggle />
        </div>
        
        <div className={`text-center mb-12 mt-8 transition-all duration-700 ease-out ${fadeInClass}`}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent transform hover:scale-105 transition-transform duration-300">
            Sybase ➔ Oracle SQL Converter
          </h1>
          <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
            Transform your Sybase SQL files into Oracle SQL format with ease and precision
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Panel */}
          <Card className={`p-6 border-border/40 shadow-lg hover:shadow-xl transition-all duration-500 ${isAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Upload Files</h2>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-blue-500 transition-colors group">
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
                className="cursor-pointer flex flex-col items-center gap-3 group-hover:scale-105 transition-transform duration-300"
              >
                <Upload className="h-12 w-12 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                <span className="font-medium">Browse files...</span>
                <span className="text-sm text-muted-foreground">
                  Supported formats: .sql, .txt
                </span>
              </label>
            </div>
            {files.length > 0 && (
              <div className="mt-4 animate-fade-in">
                <p className="text-sm text-muted-foreground">
                  {files.length} file(s) selected
                </p>
                <ul className="mt-2 text-sm max-h-[100px] overflow-auto border border-border/40 rounded-md p-2 bg-muted/20">
                  {files.map((file, index) => (
                    <li key={index} className="text-foreground py-1 px-2 odd:bg-muted/10 flex items-center">
                      <span className="w-4 h-4 inline-block rounded-full bg-blue-500/20 mr-2"></span>
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          {/* Output Panel */}
          <Card className={`p-6 border-border/40 shadow-lg hover:shadow-xl transition-all duration-500 ${isAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Converted Output</h2>
            {!convertedContent ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground bg-muted/10 rounded-lg p-3">
                <ArrowRight className="h-12 w-12 mb-3 animate-pulse" />
                <p>No Files Converted Yet</p>
              </div>
            ) : (
              <div className="h-[200px] overflow-auto border border-border rounded-lg p-3 bg-muted/30 animate-fade-in">
                <pre className="text-xs text-foreground whitespace-pre-wrap font-mono">{convertedContent}</pre>
                <Button 
                  onClick={handleDownload}
                  className="mt-4 bg-green-600 hover:bg-green-700 transition-colors animate-fade-in"
                  size="sm"
                >
                  <FileDown className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Progress Section */}
        {isConverting && (
          <div className="mt-8 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">Converting...</span>
              <span className="text-sm text-muted-foreground font-mono bg-muted/20 px-2 py-1 rounded">
                Time: {conversionTime.toFixed(1)}s
              </span>
            </div>
            <Progress 
              value={progress} 
              className="h-3 transition-all duration-300 overflow-hidden"
            />
            <div className="w-full bg-muted/30 h-1 mt-1 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500/30 animate-pulse rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Convert Button */}
        <div className={`mt-10 text-center transition-all duration-700 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Button 
            onClick={handleConvert}
            disabled={isConverting || files.length === 0}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isConverting ? 'Converting...' : 'Convert Files'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SqlConverter;
