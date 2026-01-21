import { useNavigate } from 'react-router-dom';
import { Upload, Scan, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ParticleBackground from '../components/ParticleBackground';

export default function LandingPage() {
  const navigate = useNavigate();
  
  return (
    <div className="relative min-h-screen pt-[72px]">
      <ParticleBackground />
      
      <div className="relative z-10">
        <section className="min-h-[70vh] flex items-center justify-center px-6 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-h1 md:text-[64px] font-heading text-primary text-glow-strong uppercase tracking-tight animate-flicker">
              NeuroLens — Learn Anything Instantly
            </h1>
            
            <p className="text-body-lg text-foreground max-w-2xl mx-auto">
              Scan textbooks, diagrams, or charts and get AI explanations in real-time.
            </p>
            
            <Button
              onClick={() => navigate('/input')}
              className="h-12 px-8 bg-gradient-primary text-primary-foreground border-0 shadow-glow-md hover:shadow-glow-lg hover:scale-105 transition-all duration-normal font-normal"
            >
              Scan Your Knowledge
            </Button>
          </div>
        </section>
        
        <section className="px-6 py-16 max-w-[1440px] mx-auto">
          <h2 className="text-h2 font-heading text-center text-foreground mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Upload,
                title: 'Upload',
                description: 'Upload your textbook page, diagram, or any learning material',
                delay: '0ms',
              },
              {
                icon: Scan,
                title: 'AI Scan',
                description: 'Our AI analyzes and processes your content in real-time',
                delay: '100ms',
              },
              {
                icon: Sparkles,
                title: 'Answer',
                description: 'Get instant explanations, insights, and practice questions',
                delay: '200ms',
              },
            ].map((step, index) => (
              <Card
                key={index}
                className="p-6 bg-card border border-primary/30 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-normal animate-fade-up"
                style={{ animationDelay: step.delay }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow-md">
                    <step.icon className="w-8 h-8 text-primary-foreground" strokeWidth={2} />
                  </div>
                  <h3 className="text-h4 font-heading text-foreground">{step.title}</h3>
                  <p className="text-body text-neutral-200">{step.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
        
        <section className="px-6 py-16 max-w-[1440px] mx-auto">
          <h2 className="text-h2 font-heading text-center text-foreground mb-12">
            Why NeuroLens
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                title: 'Instant Learning',
                description: 'Get explanations in seconds, not hours of research',
                image: 'https://c.animaapp.com/mkenkjzjobtdOI/img/ai_2.png',
              },
              {
                title: 'AI Insights',
                description: 'Deep analysis powered by advanced neural networks',
                image: 'https://c.animaapp.com/mkenkjzjobtdOI/img/ai_3.png',
              },
              {
                title: 'Practice Quizzes',
                description: 'Test your knowledge with AI-generated questions',
                image: 'https://c.animaapp.com/mkenkjzjobtdOI/img/ai_4.png',
              },
            ].map((benefit, index) => (
              <Card
                key={index}
                className="p-6 bg-card border border-primary/30 shadow-md hover:shadow-lg transition-all duration-normal flex flex-col md:flex-row gap-6 items-center"
              >
                <img
                  src={benefit.image}
                  alt={`Placeholder alt tag for asset ai_${index + 2}`}
                  className="w-full md:w-48 h-32 object-cover rounded-md"
                  loading="lazy"
                />
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-h4 font-heading text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-body text-neutral-200">{benefit.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
