import { Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

interface NavBarProps {
  language: 'EN' | 'KA';
  onLanguageToggle: () => void;
  onSettingsClick: () => void;
}

export default function NavBar({ language, onLanguageToggle, onSettingsClick }: NavBarProps) {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <h1 className="text-h3 font-heading text-primary text-glow-strong tracking-tight uppercase">
            NeuroLens
          </h1>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-2">
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink
                    className={`h-12 px-5 flex items-center text-body font-normal transition-all duration-normal ${
                      isActive('/')
                        ? 'text-primary border-b-[3px] border-primary text-glow'
                        : 'text-foreground hover:text-primary hover:text-glow'
                    }`}
                  >
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/input">
                  <NavigationMenuLink
                    className={`h-12 px-5 flex items-center text-body font-normal transition-all duration-normal ${
                      isActive('/input')
                        ? 'text-primary border-b-[3px] border-primary text-glow'
                        : 'text-foreground hover:text-primary hover:text-glow'
                    }`}
                  >
                    Scan
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/results">
                  <NavigationMenuLink
                    className={`h-12 px-5 flex items-center text-body font-normal transition-all duration-normal ${
                      isActive('/results')
                        ? 'text-primary border-b-[3px] border-primary text-glow'
                        : 'text-foreground hover:text-primary hover:text-glow'
                    }`}
                  >
                    Results
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/chat">
                  <NavigationMenuLink
                    className={`h-12 px-5 flex items-center text-body font-normal transition-all duration-normal ${
                      isActive('/chat')
                        ? 'text-primary border-b-[3px] border-primary text-glow'
                        : 'text-foreground hover:text-primary hover:text-glow'
                    }`}
                  >
                    Chat
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            onClick={onLanguageToggle}
            className="h-12 px-5 bg-transparent text-foreground border border-primary hover:bg-primary/10 hover:text-primary font-normal"
          >
            {language}
          </Button>
          
          <Button
            onClick={onSettingsClick}
            className="h-12 w-12 p-0 bg-transparent text-foreground border border-primary hover:bg-primary/10 hover:text-primary"
          >
            <Settings className="w-6 h-6" strokeWidth={2} />
          </Button>
        </div>
      </div>
      
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 backdrop-blur-md bg-background/90 border-t border-border flex items-center justify-around px-4 z-50">
        <Link to="/" className="flex flex-col items-center gap-1">
          <div className={`text-caption ${isActive('/') ? 'text-primary text-glow' : 'text-foreground'}`}>
            Home
          </div>
        </Link>
        <Link to="/input" className="flex flex-col items-center gap-1">
          <div className={`text-caption ${isActive('/input') ? 'text-primary text-glow' : 'text-foreground'}`}>
            Scan
          </div>
        </Link>
        <Link to="/results" className="flex flex-col items-center gap-1">
          <div className={`text-caption ${isActive('/results') ? 'text-primary text-glow' : 'text-foreground'}`}>
            Results
          </div>
        </Link>
        <Link to="/chat" className="flex flex-col items-center gap-1">
          <div className={`text-caption ${isActive('/chat') ? 'text-primary text-glow' : 'text-foreground'}`}>
            Chat
          </div>
        </Link>
      </div>
    </nav>
  );
}
