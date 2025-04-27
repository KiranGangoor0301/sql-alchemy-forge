
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  isConverting: boolean;
  progress: number;
  conversionTime: number;
}

export const ProgressIndicator = ({ isConverting, progress, conversionTime }: ProgressIndicatorProps) => {
  if (!isConverting) return null;

  return (
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
  );
};
