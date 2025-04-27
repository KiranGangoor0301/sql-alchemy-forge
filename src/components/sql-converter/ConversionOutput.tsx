import { FileDown, ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface ConvertedFile {
  name: string;
  content: string;
}

interface ConversionOutputProps {
  convertedFiles: ConvertedFile[];
  isAnimated: boolean;
}

export const ConversionOutput = ({ convertedFiles, isAnimated }: ConversionOutputProps) => {
  const handleDownload = (file: ConvertedFile) => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name || 'converted_output.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("File downloaded successfully!");
  };

  return (
    <Card className={`p-6 border-border/40 shadow-lg hover:shadow-xl transition-all duration-500 ${isAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
      <h2 className="text-xl font-semibold mb-4 text-foreground">Converted Output</h2>
      {convertedFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground bg-muted/10 rounded-lg p-3">
          <ArrowRight className="h-12 w-12 mb-3 animate-pulse" />
          <p>No Files Converted Yet</p>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          {convertedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between border border-border rounded-lg p-3 bg-muted/30">
              <div className="flex items-center">
                <FileText className="h-6 w-6 mr-2 text-blue-500" />
                <p className="text-sm">{file.name}</p>
              </div>
              <Button 
                onClick={() => handleDownload(file)}
                className="bg-green-600 hover:bg-green-700 transition-colors"
                size="sm"
              >
                <FileDown className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};