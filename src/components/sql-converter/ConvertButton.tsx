
import { Button } from '@/components/ui/button';

interface ConvertButtonProps {
  isConverting: boolean;
  disabled: boolean;
  onClick: () => void;
  isAnimated: boolean;
}

export const ConvertButton = ({ isConverting, disabled, onClick, isAnimated }: ConvertButtonProps) => {
  return (
    <div className={`mt-10 text-center transition-all duration-700 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <Button 
        onClick={onClick}
        disabled={disabled}
        size="lg"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:pointer-events-none"
      >
        {isConverting ? 'Converting...' : 'Convert Files'}
      </Button>
    </div>
  );
};
