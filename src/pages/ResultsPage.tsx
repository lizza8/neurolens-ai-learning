import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Maximize2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import ParticleBackground from '../components/ParticleBackground';
import { getAIResponse, analyzeImage } from '../services/aiService';

interface ResultsPageProps {
  scanData: { type: 'image' | 'text'; content: string; file?: File } | null;
  apiKey?: string;
}

export default function ResultsPage({ scanData, apiKey }: ResultsPageProps) {
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showExpanded, setShowExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState<{
    explanation: string;
    quiz: {
      question: string;
      options: Array<{ id: string; text: string }>;
      correctAnswer: string;
    } | null;
  } | null>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchAIResponse = async () => {
      if (!scanData) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        let response;
        
        if (scanData.type === 'text') {
          response = await getAIResponse(scanData.content, apiKey);
        } else if (scanData.file) {
          response = await analyzeImage(scanData.file, apiKey);
        } else {
          // Fallback for image without file
          response = await getAIResponse(
            `Explain the content from this image: ${scanData.content}`,
            apiKey
          );
        }
        
        setAiResponse(response);
        
        if (response.quiz) {
          setTimeout(() => {
            setShowQuiz(true);
          }, 750);
        }
      } catch (error) {
        console.error('Error fetching AI response:', error);
        setAiResponse({
          explanation: '**Error**\n\nFailed to generate AI response. Please try again.',
          quiz: null,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAIResponse();
  }, [scanData, apiKey]);
  
  const parseMarkdown = (text: string) => {
    // Simple markdown parser for basic formatting
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('### ')) {
        elements.push(<h3 key={key++} className="text-body-lg font-heading text-foreground mb-2">{line.slice(4)}</h3>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={key++} className="text-h4 font-heading text-foreground mb-3">{line.slice(3)}</h2>);
      } else if (line.startsWith('# ')) {
        elements.push(<h1 key={key++} className="text-h3 font-heading text-foreground mb-4">{line.slice(2)}</h1>);
      } else if (line.startsWith('- ')) {
        elements.push(<li key={key++} className="ml-4 text-neutral-200">{formatInlineMarkdown(line.slice(2))}</li>);
      } else if (line.trim() === '') {
        elements.push(<br key={key++} />);
      } else if (line.trim()) {
        elements.push(<p key={key++} className="mb-4 text-foreground">{formatInlineMarkdown(line)}</p>);
      }
    }

    return elements;
  };

  const formatInlineMarkdown = (text: string) => {
    const parts: (string | JSX.Element)[] = [];
    let currentText = text;
    let key = 0;

    // Handle bold text **text**
    const boldRegex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(currentText)) !== null) {
      if (match.index > lastIndex) {
        parts.push(currentText.slice(lastIndex, match.index));
      }
      parts.push(
        <strong key={key++} className="text-primary text-glow font-medium">
          {match[1]}
        </strong>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < currentText.length) {
      parts.push(currentText.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const checkAnswer = (answerId: string) => {
    if (!aiResponse?.quiz) return null;
    
    if (answerId === aiResponse.quiz.correctAnswer) {
      return {
        isCorrect: true,
        message: '✓ Correct! Great job understanding the concept.',
      };
    } else {
      const correctOption = aiResponse.quiz.options.find(
        opt => opt.id === aiResponse.quiz!.correctAnswer
      );
      return {
        isCorrect: false,
        message: `✗ Not quite. The correct answer is: ${correctOption?.text}`,
      };
    }
  };
  
  return (
    <div className="relative min-h-screen pt-[72px]">
      <ParticleBackground />
      
      <div className="relative z-10 min-h-[calc(100vh-72px)] px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <Button
            onClick={() => navigate('/input')}
            className="h-12 px-6 bg-transparent text-foreground border border-primary hover:bg-primary/10 hover:text-primary font-normal"
          >
            <ArrowLeft className="w-5 h-5 mr-2" strokeWidth={2} />
            Scan Another
          </Button>
          
          <Card className="p-8 bg-card border border-primary/30 shadow-lg animate-fade-up">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-h3 font-heading text-foreground">
                  AI Explanation
                </h2>
                <Button
                  onClick={() => setShowExpanded(!showExpanded)}
                  className="h-10 w-10 p-0 bg-transparent text-foreground border border-primary hover:bg-primary/10 hover:text-primary"
                >
                  <Maximize2 className="w-5 h-5" strokeWidth={2} />
                </Button>
              </div>
              
              {scanData && (
                <div className="mb-4 p-4 bg-muted/50 rounded-md border border-primary/20">
                  <p className="text-body-sm text-neutral-300">
                    {scanData.type === 'image' ? 'Scanned Image' : 'Your Question'}:{' '}
                    <span className="text-foreground">
                      {scanData.type === 'text' 
                        ? scanData.content 
                        : scanData.content}
                    </span>
                  </p>
                </div>
              )}
              
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" strokeWidth={2} />
                  <p className="text-body text-neutral-200">
                    AI is analyzing your content...
                  </p>
                </div>
              ) : aiResponse ? (
                <div className="space-y-4 text-body text-foreground markdown-content">
                  {parseMarkdown(aiResponse.explanation)}
                </div>
              ) : (
                <p className="text-body text-neutral-200">
                  No content to display. Please scan something first.
                </p>
              )}
              
              {showExpanded && aiResponse && (
                <div className="mt-6 p-6 bg-muted/30 rounded-md border border-primary/20 space-y-4 text-body text-neutral-200 animate-fade-up">
                  <h3 className="text-h4 font-heading text-foreground">Additional Context</h3>
                  <p>
                    This explanation was generated by advanced AI to help you understand the topic better.
                    The AI analyzes your question or image and provides detailed, accurate information
                    tailored to your learning needs.
                  </p>
                </div>
              )}
            </div>
          </Card>
          
          {showQuiz && aiResponse?.quiz && (
            <Card className="p-8 bg-card border border-primary/30 shadow-lg animate-fade-up">
              <div className="space-y-6">
                <h2 className="text-h3 font-heading text-foreground">
                  Practice Quiz
                </h2>
                
                <p className="text-body text-neutral-200">
                  {aiResponse.quiz.question}
                </p>
                
                <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                  <div className="space-y-4">
                    {aiResponse.quiz.options.map((option) => (
                      <div
                        key={option.id}
                        className={`flex items-start space-x-3 p-4 rounded-md border transition-all duration-normal cursor-pointer ${
                          selectedAnswer === option.id
                            ? 'border-primary bg-primary/10 shadow-glow-sm'
                            : 'border-primary/30 hover:border-primary/50 hover:bg-primary/5'
                        }`}
                        onClick={() => setSelectedAnswer(option.id)}
                      >
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label
                          htmlFor={option.id}
                          className="text-body text-foreground cursor-pointer flex-1"
                        >
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
                
                {selectedAnswer && (() => {
                  const result = checkAnswer(selectedAnswer);
                  return result ? (
                    <div className={`p-4 rounded-md border ${
                      result.isCorrect 
                        ? 'bg-success/10 border-success/30' 
                        : 'bg-warning/10 border-warning/30'
                    }`}>
                      <p className={`text-body ${
                        result.isCorrect 
                          ? 'text-success-foreground' 
                          : 'text-warning-foreground'
                      }`}>
                        {result.message}
                      </p>
                    </div>
                  ) : null;
                })()}
              </div>
            </Card>
          )}
          
          <div className="flex justify-center">
            <img
              src="https://c.animaapp.com/mkenkjzjobtdOI/img/ai_5.png"
              alt="holographic grid neon environment"
              className="w-full max-w-3xl h-auto rounded-md border border-primary/30 shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
