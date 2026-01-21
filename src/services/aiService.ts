interface AIResponse {
  explanation: string;
  quiz: {
    question: string;
    options: Array<{ id: string; text: string }>;
    correctAnswer: string;
  } | null;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function getChatResponse(
  message: string, 
  conversationHistory: ChatMessage[] = [],
  apiKey?: string,
  useBackend: boolean = false
): Promise<string> {
  // Try backend first if enabled
  if (useBackend) {
    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          history: conversationHistory 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.answer || data.response || 'No response generated.';
      }
    } catch (error) {
      console.log('Backend not available, falling back to OpenAI API');
    }
  }

  // Fallback to OpenAI API
  if (!apiKey) {
    return "**NeuroLens AI Tutor**\n\nPlease add your OpenAI API key in settings to enable the AI chatbot, or ensure the backend server is running at http://localhost:8000";
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are NeuroLens, a futuristic AI tutor. Provide accurate, clear, and educational answers to any user input.

Rules:
1. Give 100% correct answers.
2. If text question: give step-by-step explanation and optional 1–2 practice questions.
3. If scanned document/image: analyze text/diagram, summarize content, highlight key points.
4. Use bullet points for clarity.
5. Keep answers concise and educational.
6. Remember user context for follow-up questions.
7. Highlight key terms in **bold**.
8. Friendly, professional, cyberpunk futuristic tutor vibe.

Example format:
- Main concept: **Key term explanation**
- Step-by-step:
   1. First point
   2. Second point
   3. Third point
- Example: Real-world application
- Practice question: "Test understanding question?"`
          },
          ...conversationHistory,
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content || 'No response generated.';
  } catch (error) {
    console.error('Chat Error:', error);
    return `**Error**\n\nFailed to get response: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

export async function getAIResponse(question: string, apiKey?: string): Promise<AIResponse> {
  // If no API key is provided, return a placeholder response
  if (!apiKey) {
    return {
      explanation: `**Understanding Your Question**\n\nYou asked: "${question}"\n\nThis is a placeholder response. To get real AI-powered answers, please add your OpenAI API key in the settings.\n\n**How to add your API key:**\n1. Click the settings icon in the navigation bar\n2. Enter your OpenAI API key\n3. Ask your question again\n\nOnce configured, NeuroLens will provide detailed, accurate explanations powered by GPT-4.`,
      quiz: {
        question: "What do you need to enable AI-powered responses?",
        options: [
          { id: 'a', text: 'An OpenAI API key' },
          { id: 'b', text: 'A premium subscription' },
          { id: 'c', text: 'Special hardware' },
          { id: 'd', text: 'Nothing, it works automatically' },
        ],
        correctAnswer: 'a',
      },
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are NeuroLens, an advanced AI learning assistant. Your role is to:
1. Provide clear, accurate, and comprehensive explanations
2. Break down complex topics into understandable parts
3. Use examples and analogies when helpful
4. Highlight key concepts with **bold** formatting
5. Structure your response with proper markdown formatting

After your explanation, generate a relevant multiple-choice quiz question to test understanding.

Format your response as JSON with this structure:
{
  "explanation": "Your detailed explanation here with markdown formatting",
  "quiz": {
    "question": "A relevant question to test understanding",
    "options": [
      {"id": "a", "text": "First option"},
      {"id": "b", "text": "Second option"},
      {"id": "c", "text": "Third option"},
      {"id": "d", "text": "Fourth option"}
    ],
    "correctAnswer": "a"
  }
}`
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.choices[0].message.content || '';
    
    // Try to parse as JSON first
    try {
      const jsonResponse = JSON.parse(responseText);
      return jsonResponse;
    } catch {
      // If not JSON, treat as plain text explanation
      return {
        explanation: responseText,
        quiz: null,
      };
    }
  } catch (error) {
    console.error('AI Service Error:', error);
    
    // Return error message as explanation
    return {
      explanation: `**Error Processing Request**\n\nThere was an issue connecting to the AI service. Please check:\n\n- Your API key is valid\n- You have sufficient API credits\n- Your internet connection is stable\n\nError details: ${error instanceof Error ? error.message : 'Unknown error'}`,
      quiz: null,
    };
  }
}

export async function analyzeImage(imageFile: File, apiKey?: string): Promise<AIResponse> {
  if (!apiKey) {
    return {
      explanation: `**Image Analysis**\n\nYou uploaded: ${imageFile.name}\n\nTo analyze images with AI, please add your OpenAI API key in the settings. Once configured, NeuroLens will:\n\n- Extract text from images\n- Explain diagrams and charts\n- Answer questions about visual content\n- Generate practice questions based on the image`,
      quiz: null,
    };
  }

  try {
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: `You are NeuroLens, an AI learning assistant analyzing educational content. Analyze the image and:
1. Describe what you see
2. Explain key concepts shown
3. Provide educational insights
4. Generate a relevant quiz question

Format as JSON with explanation and quiz fields.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this educational content and explain what it teaches.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: base64Image,
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.choices[0].message.content || '';
    
    try {
      const jsonResponse = JSON.parse(responseText);
      return jsonResponse;
    } catch {
      return {
        explanation: responseText,
        quiz: null,
      };
    }
  } catch (error) {
    console.error('Image Analysis Error:', error);
    
    return {
      explanation: `**Error Analyzing Image**\n\nCouldn't process the image. This might be because:\n\n- The API key doesn't have access to vision models\n- The image format is not supported\n- There was a network issue\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`,
      quiz: null,
    };
  }
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}
