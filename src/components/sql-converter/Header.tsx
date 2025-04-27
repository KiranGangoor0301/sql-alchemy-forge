import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
  };

  return (
    <header className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          className="text-muted-foreground hover:text-foreground transition-colors" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" /> Sign out
        </Button>
      </div>
      <ThemeToggle />
    </header>
  );
};
