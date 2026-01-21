import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import ParticleBackground from '../components/ParticleBackground';

interface InputPageProps {
  onScanComplete: (data: { type: 'image' | 'text'; content: string; file?: File }) => void;
}

export default function InputPage({ onScanComplete }: InputPageProps) {
  const navigate = useNavigate();
  const [inputMode, setInputMode] = useState<'image' | 'text'>('image');
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowTooltip(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setShowTooltip(false);
    }
  };
  
  const handleScan = () => {
    if (inputMode === 'image' && !selectedFile) {
      setShowTooltip(true);
      return;
    }
    
    if (inputMode === 'text' && !textInput.trim()) {
      setShowTooltip(true);
      return;
    }
    
    setIsScanning(true);
    
    setTimeout(() => {
      onScanComplete({
        type: inputMode,
        content: inputMode === 'image' ? selectedFile!.name : textInput,
        file: inputMode === 'image' ? selectedFile! : undefined,
      });
      navigate('/results');
    }, 2500);
  };
  
  return (
    <div className="relative min-h-screen pt-[72px]">
      <ParticleBackground />
      
      <div className="relative z-10 min-h-[calc(100vh-72px)] flex items-center justify-center px-6 py-16">
        <Card className="w-full max-w-2xl p-8 bg-card border border-primary/30 shadow-lg relative overflow-hidden">
          {isScanning && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-scan-beam" />
              <div className="absolute inset-0 border-2 border-primary/50 rounded-md animate-pulse-glow" />
            </>
          )}
          
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-h2 font-heading text-foreground mb-2">
                Scan Your Knowledge
              </h1>
              <p className="text-body text-neutral-200">
                Upload an image or enter your question
              </p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setInputMode('image')}
                className={`h-12 px-6 font-normal ${
                  inputMode === 'image'
                    ? 'bg-gradient-primary text-primary-foreground border-0 shadow-glow-md'
                    : 'bg-transparent text-foreground border border-primary hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <Upload className="w-5 h-5 mr-2" strokeWidth={2} />
                Image Upload
              </Button>
              
              <Button
                onClick={() => setInputMode('text')}
                className={`h-12 px-6 font-normal ${
                  inputMode === 'text'
                    ? 'bg-gradient-primary text-primary-foreground border-0 shadow-glow-md'
                    : 'bg-transparent text-foreground border border-primary hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <Type className="w-5 h-5 mr-2" strokeWidth={2} />
                Text Input
              </Button>
            </div>
            
            {inputMode === 'image' ? (
              <div
                className="border-2 border-dashed border-primary/50 rounded-md p-12 text-center hover:border-primary transition-all duration-normal cursor-pointer animate-float"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isScanning}
                />
                
                <Upload className="w-16 h-16 mx-auto mb-4 text-primary" strokeWidth={1.5} />
                
                {selectedFile ? (
                  <div className="space-y-2">
                    <p className="text-body text-foreground">{selectedFile.name}</p>
                    <p className="text-body-sm text-neutral-300">Click to change file</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-body text-foreground">
                      Drag and drop your image here
                    </p>
                    <p className="text-body-sm text-neutral-300">
                      or click to browse
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Label htmlFor="question" className="text-body text-foreground">
                  Enter your question
                </Label>
                <textarea
                  id="question"
                  value={textInput}
                  onChange={(e) => {
                    setTextInput(e.target.value);
                    setShowTooltip(false);
                  }}
                  placeholder="What would you like to learn about?"
                  className="w-full h-48 px-4 py-3 bg-input border border-primary/50 rounded-md text-body text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary resize-none"
                  disabled={isScanning}
                />
              </div>
            )}
            
            {showTooltip && (
              <p className="text-body-sm text-error text-center">
                {inputMode === 'image' ? 'Please upload an image' : 'Please enter a question'}
              </p>
            )}
            
            <Button
              onClick={handleScan}
              disabled={isScanning}
              className="w-full h-12 bg-gradient-primary text-primary-foreground border-0 shadow-glow-md hover:shadow-glow-lg hover:scale-105 transition-all duration-normal font-normal disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isScanning ? 'Processing AI Scan...' : 'Process AI Scan'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
