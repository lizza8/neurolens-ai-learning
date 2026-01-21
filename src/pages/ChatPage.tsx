import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ParticleBackground from '../components/ParticleBackground';
import { getChatResponse } from '../services/aiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatPageProps {
  apiKey?: string;
}

export default function ChatPage({ apiKey }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '**Welcome to NeuroLens AI Tutor!** 🚀\n\nI\'m here to help you learn anything. Ask me questions about:\n- Math, Science, History, Languages\n- Programming, Technology\n- Any topic you want to understand better\n\nHow can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={key++} className="text-body-lg font-heading text-foreground mb-2 mt-4">
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={key++} className="text-h4 font-heading text-foreground mb-3 mt-4">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={key++} className="text-h3 font-heading text-foreground mb-4 mt-4">
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={key++} className="ml-4 text-neutral-200 mb-1">
            {formatInlineMarkdown(line.slice(2))}
          </li>
        );
      } else if (line.match(/^\d+\./)) {
        elements.push(
          <li key={key++} className="ml-4 text-neutral-200 mb-1 list-decimal">
            {formatInlineMarkdown(line.replace(/^\d+\.\s*/, ''))}
          </li>
        );
      } else if (line.trim() === '') {
        elements.push(<br key={key++} />);
      } else if (line.trim()) {
        elements.push(
          <p key={key++} className="mb-2 text-foreground">
            {formatInlineMarkdown(line)}
          </p>
        );
      }
    }

    return elements;
  };

  const formatInlineMarkdown = (text: string) => {
    const parts: (string | JSX.Element)[] = [];
    let currentText = text;
    let key = 0;

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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await getChatResponse(
        userMessage.content,
        conversationHistory,
        apiKey
      );

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: '**Error**\n\nSorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative min-h-screen pt-[72px]">
      <ParticleBackground />
      
      <div className="relative z-10 h-[calc(100vh-72px)] flex flex-col px-6 py-8 max-w-5xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-h2 font-heading text-primary text-glow-strong mb-2">
            NeuroLens AI Tutor
          </h1>
          <p className="text-body text-neutral-200">
            Your personal AI learning assistant
          </p>
        </div>

        <Card className="flex-1 flex flex-col bg-card/80 backdrop-blur-sm border border-primary/30 shadow-lg overflow-hidden mb-4">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-primary text-primary-foreground'
                      : 'bg-muted/50 border border-primary/20'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" strokeWidth={2} />
                      <span className="text-body-sm font-medium text-primary">NeuroLens</span>
                    </div>
                  )}
                  <div className="text-body markdown-content">
                    {message.role === 'assistant' ? (
                      parseMarkdown(message.content)
                    ) : (
                      <p className="text-foreground">{message.content}</p>
                    )}
                  </div>
                  <div className="text-caption text-neutral-400 mt-2">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-4 bg-muted/50 border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" strokeWidth={2} />
                    <span className="text-body text-neutral-200">NeuroLens is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-primary/20 p-4 bg-muted/30">
            <div className="flex gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 min-h-[48px] max-h-[120px] px-4 py-3 bg-input border border-primary/50 rounded-md text-body text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary resize-none"
                rows={1}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="h-12 w-12 p-0 bg-gradient-primary text-primary-foreground border-0 shadow-glow-md hover:shadow-glow-lg hover:scale-105 transition-all duration-normal disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
                ) : (
                  <Send className="w-5 h-5" strokeWidth={2} />
                )}
              </Button>
            </div>
            
            {!apiKey && (
              <p className="text-body-sm text-warning mt-2 text-center">
                Add your OpenAI API key in settings to enable AI responses
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
