
import { FileDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface ConversionOutputProps {
  convertedContent: string | null;
  isAnimated: boolean;
}

export const ConversionOutput = ({ convertedContent, isAnimated }: ConversionOutputProps) => {
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

  return (
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
  );
};
