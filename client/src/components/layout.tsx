import { useEffect } from 'react';
import { useStore } from '@/lib/data';
import { Link, useLocation } from 'wouter';
import { 
  Search, 
  Moon, 
  Sun, 
  User, 
  Globe, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme, language, setLanguage, isAdmin, logout } = useStore();
  const [location, setLocation] = useLocation();

  // Handle theme class on body
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme); // Assuming store handles 'dark'/'light' properly, though default is forced to dark in CSS for now if we want to stick to the requested style, but let's allow toggle.
  }, [theme]);

  // Actually, let's implement a real theme toggle
  const toggleTheme = () => {
    const root = window.document.documentElement;
    const isDark = root.classList.contains('dark');
    if (isDark) {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  };

  // Ensure dark mode is on by default on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen font-sans text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto h-full px-4 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2 group">
              <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg group-hover:shadow-primary/50 transition-all">
                <Sparkles className="size-5" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight group-hover:text-primary transition-colors">
                Ani<span className="text-secondary">Release</span>
              </span>
            </a>
          </Link>

          {/* Desktop Nav Actions */}
          <div className="flex items-center gap-2 md:gap-4">
             {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
                  <Globe className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl bg-background/90 backdrop-blur-xl border-white/10">
                <DropdownMenuItem onClick={() => setLanguage('it')}>Italiano</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="rounded-full hover:bg-white/5"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Admin / Login */}
            {isAdmin ? (
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 text-primary">
                    <User className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl bg-background/90 backdrop-blur-xl border-white/10">
                  <DropdownMenuItem onClick={() => setLocation('/admin')}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="mr-2 size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-white/5"
                onClick={() => setLocation('/admin')}
              >
                <User className="size-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12 px-4 container mx-auto">
        {children}
      </main>
    </div>
  );
}
