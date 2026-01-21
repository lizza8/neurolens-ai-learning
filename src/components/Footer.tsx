import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="h-16 border-t border-primary/30 bg-background/50 backdrop-blur-sm mb-16 md:mb-0">
      <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-center gap-8">
        <Link 
          to="/privacy" 
          className="text-body-sm text-foreground hover:text-primary hover:text-glow transition-all duration-normal"
        >
          Privacy
        </Link>
        <a 
          href="https://discord.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-body-sm text-foreground hover:text-primary hover:text-glow transition-all duration-normal"
        >
          Discord
        </a>
        <span className="text-body-sm text-neutral-400">v1.0.0</span>
      </div>
    </footer>
  );
}
