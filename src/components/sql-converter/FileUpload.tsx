
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

interface FileUploadProps {
  files: File[];
  onFileChange: (files: File[]) => void;
  isAnimated: boolean;
}

export const FileUpload = ({ files, onFileChange, isAnimated }: FileUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      onFileChange(newFiles);
      
      toast.success(`${newFiles.length} file(s) selected`, {
        description: newFiles.map(file => file.name).join(', '),
        duration: 3000,
      });
    }
  };

  return (
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
  );
};
