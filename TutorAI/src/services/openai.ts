const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export interface LessonContent {
  title: string;
  content: string;
  keyPoints: string[];
  examples: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface WalkthroughStep {
  id: string;
  title: string;
  content: string;
  explanation: string;
}

class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';
  private maxRetries = 5;
  private baseDelay = 2000; // 2 second base delay

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequestWithRetry(url: string, options: RequestInit): Promise<Response> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);
        
        if (response.status === 429) {
          if (attempt === this.maxRetries) {
            throw new Error(`OpenAI API rate limit exceeded after ${this.maxRetries + 1} attempts`);
          }
          
          // Exponential backoff: 1s, 2s, 4s
          const delay = this.baseDelay * Math.pow(2, attempt);
          console.log(`Rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/${this.maxRetries + 1})`);
          await this.sleep(delay);
          continue;
        }
        
        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }
        
        return response;
      } catch (error) {
        lastError = error as Error;
        if (attempt === this.maxRetries) {
          throw lastError;
        }
        
        // For non-429 errors, still retry with a shorter delay
        const delay = this.baseDelay * Math.pow(2, attempt);
        console.log(`Request failed, retrying in ${delay}ms (attempt ${attempt + 1}/${this.maxRetries + 1})`);
        await this.sleep(delay);
      }
    }
    
    throw lastError!;
  }

  private parseAIResponse(content: string): any {
    try {
      // First, try to extract JSON from markdown code blocks
      const jsonBlockMatch = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
      if (jsonBlockMatch) {
        return JSON.parse(jsonBlockMatch[1].trim());
      }
      
      // If no code block, try parsing the content directly
      return JSON.parse(content.trim());
    } catch (error) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid response format from AI service');
    }
  }

  async generateLesson(topic: string, difficulty: string, userLevel?: string): Promise<LessonContent> {
    const prompt = `You are a friendly and knowledgeable tutor. Create a comprehensive lesson on "${topic}" at ${difficulty} level.

${userLevel ? `Student background: ${userLevel}` : ''}

Please provide:
1. A clear, engaging explanation of the topic
2. 3-4 key points to remember
3. 2-3 practical examples
4. Use markdown formatting for better readability
5. Include mathematical expressions using LaTeX notation when relevant (wrap in $ for inline or $$ for block)

Format your response as a JSON object with the following structure:
{
  "title": "lesson title",
  "content": "main lesson content in markdown",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "examples": ["example 1", "example 2"]
}`;

    try {
      const response = await this.makeRequestWithRetry(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are an expert educational tutor.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      const data = await response.json();
      const content = this.parseAIResponse(data.choices[0].message.content);
      
      return {
        ...content,
        difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced'
      };
    } catch (error) {
      console.error('Error generating lesson:', error);
      throw new Error('Failed to generate lesson. Please try again.');
    }
  }

  async generateQuiz(topic: string, difficulty: string, lessonContent: string): Promise<QuizQuestion[]> {
    const prompt = `Based on this lesson about "${topic}":

${lessonContent}

Create 5 multiple-choice questions at ${difficulty} level. Each question should:
1. Test understanding of key concepts
2. Have 4 options
3. Include a detailed explanation for the correct answer
4. Be appropriately challenging for the difficulty level

Format as JSON array:
[
  {
    "id": "q1",
    "question": "question text",
    "options": ["option A", "option B", "option C", "option D"],
    "correctAnswer": 0,
    "explanation": "detailed explanation of why this is correct"
  }
]`;

    try {
      const response = await this.makeRequestWithRetry(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are an expert at creating educational assessments.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 1500,
          temperature: 0.7
        })
      });

      const data = await response.json();
      return this.parseAIResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw new Error('Failed to generate quiz. Please try again.');
    }
  }

  async generateWalkthrough(
    question: string,
    userAnswer: string,
    correctAnswer: string,
    topic: string
  ): Promise<WalkthroughStep[]> {
    const prompt = `A student answered "${userAnswer}" to this question: "${question}"

The correct answer is: "${correctAnswer}"

Topic: ${topic}

Create a step-by-step walkthrough to help the student understand:
1. Why their answer was incorrect
2. The correct approach to solving this problem
3. Key concepts they should remember

Format as JSON array with 3-4 steps:
[
  {
    "id": "step1",
    "title": "Understanding the Problem",
    "content": "step content",
    "explanation": "why this step is important"
  }
]`;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a patient tutor helping students learn from mistakes.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating walkthrough:', error);
      throw new Error('Failed to generate walkthrough. Please try again.');
    }
  }
}

export const openaiService = new OpenAIService(OPENAI_API_KEY || '');