import { X, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'EN' | 'KA';
  onLanguageChange: (lang: 'EN' | 'KA') => void;
  glowIntensity: number;
  onGlowIntensityChange: (value: number) => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export default function SettingsDrawer({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  glowIntensity,
  onGlowIntensityChange,
  apiKey,
  onApiKeyChange,
}: SettingsDrawerProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  
  if (!isOpen) return null;
  
  return (
    <>
      <div 
        className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-muted border-l border-primary/30 z-50 p-6 overflow-y-auto animate-in slide-in-from-right duration-normal">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-h3 font-heading text-foreground">Settings</h2>
          <Button
            onClick={onClose}
            className="h-10 w-10 p-0 bg-transparent text-foreground border border-primary hover:bg-primary/10 hover:text-primary"
          >
            <X className="w-6 h-6" strokeWidth={2} />
          </Button>
        </div>
        
        <div className="space-y-8">
          <div className="space-y-4">
            <Label className="text-body text-foreground">Language</Label>
            <RadioGroup 
              value={language} 
              onValueChange={(value) => onLanguageChange(value as 'EN' | 'KA')}
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="EN" id="en" />
                <Label htmlFor="en" className="text-body text-foreground cursor-pointer">
                  English
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="KA" id="ka" />
                <Label htmlFor="ka" className="text-body text-foreground cursor-pointer">
                  ქართული
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-4">
            <Label className="text-body text-foreground">Glow Intensity</Label>
            <div className="space-y-2">
              <Slider
                value={[glowIntensity]}
                onValueChange={(values) => onGlowIntensityChange(values[0])}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="text-body-sm text-neutral-300 text-center">
                {glowIntensity}%
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <Label className="text-body text-foreground">OpenAI API Key</Label>
            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => onApiKeyChange(e.target.value)}
                  placeholder="sk-..."
                  className="w-full h-12 px-4 pr-12 bg-input border border-primary/50 rounded-md text-body text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-foreground transition-colors"
                >
                  {showApiKey ? (
                    <EyeOff className="w-5 h-5" strokeWidth={2} />
                  ) : (
                    <Eye className="w-5 h-5" strokeWidth={2} />
                  )}
                </button>
              </div>
              <div className="text-body-sm text-neutral-300">
                Get your API key from{' '}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-glow underline"
                >
                  OpenAI Platform
                </a>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <Label className="text-body text-foreground">Theme</Label>
            <div className="text-body-sm text-neutral-300">
              Dark mode (neon scheme)
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
