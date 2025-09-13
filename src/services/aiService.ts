import { ChatOptions, Message } from '../types/chat';
import { getConversationHistory, addToConversationHistory } from './chatStorage';

interface APIError extends Error {
  isRateLimitError?: boolean;
  statusCode?: number;
  modelUsed?: string;
}

interface AIModel {
  name: string;
  model: string;
  apiBase: string;
  apiKey: string;
  priority?: number; // For fallback ordering
}

const AI_MODELS: AIModel[] = [
  {
    name: "Groq Llama3-70B (Best for Coding)",
    model: "llama-3.3-70b-versatile",
    apiBase: "https://api.groq.com/openai/v1",
    apiKey: "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",
    priority: 1
  },
  {
    name: "Groq Mixtral (Long Context)",
    model: "mixtral-8x7b-32768",
    apiBase: "https://api.groq.com/openai/v1",
    apiKey: "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",
    priority: 2
  },
  {
    name: "Groq Llama3-8B (Fast)",
    model: "llama-3.1-8b-instant",
    apiBase: "https://api.groq.com/openai/v1",
    apiKey: "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",
    priority: 3
  },
  {
    name: "Groq Compound (Ultra High Throughput)",
    model: "groq/compound",
    apiBase: "https://api.groq.com/openai/v1",
    apiKey: "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",
    priority: 4
  },
  {
    name: "Meta Llama 4 Scout (Latest & Fast)",
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    apiBase: "https://api.groq.com/openai/v1",
    apiKey: "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",
    priority: 5
  },
  {
    name: "MoonshotAI Kimi K2 (High RPM)",
    model: "moonshotai/kimi-k2-instruct",
    apiBase: "https://api.groq.com/openai/v1",
    apiKey: "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",
    priority: 6
  },
  {
    name: "OpenRouter Sonoma Sky Alpha",
    model: "openrouter/sonoma-sky-alpha",
    apiBase: "https://openrouter.ai/api/v1",
    apiKey: "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",
    priority: 7
  },
  {
    name: "Deepseek R1 Distill Llama 70B",
    model: "deepseek-r1-distill-llama-70b",
    apiBase: "https://api.groq.com/openai/v1",
    apiKey: "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",
    priority: 8
  }
];

// Function to check if error is rate limit related
function isRateLimitError(error: any, responseText?: string): boolean {
  const rateLimitIndicators = [
    'rate limit',
    'too many requests',
    'quota exceeded',
    'usage limit',
    'requests per minute',
    'daily limit',
    'monthly limit'
  ];
  
  const errorMessage = (error.message || responseText || '').toLowerCase();
  return rateLimitIndicators.some(indicator => errorMessage.includes(indicator));
}

// Function to make API call to a specific model
async function callAIModel(modelConfig: AIModel, messages: any[], originalModel: string): Promise<string> {
  const payload = {
    model: modelConfig.model,
    messages: messages,
    max_tokens: 1000,
    temperature: 0.7
  };

  const response = await fetch(`${modelConfig.apiBase}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${modelConfig.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const responseText = await response.text();
  
  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`) as APIError;
    error.statusCode = response.status;
    error.modelUsed = modelConfig.name;
    
    // Check if it's a rate limit error
    if (response.status === 429 || isRateLimitError(error, responseText)) {
      error.isRateLimitError = true;
    }
    
    throw error;
  }

  const data = JSON.parse(responseText);
  const aiResponse = data.choices?.[0]?.message?.content;
  
  if (!aiResponse) {
    throw new Error('No response content from AI model');
  }
  
  return aiResponse;
}

export function getAvailableModels(): AIModel[] {
  return AI_MODELS;
}

export async function chatWithAI(message: string, options: ChatOptions & { selectedModel?: string } = {}): Promise<string> {
  const {
    selectedModel = "llama-3.3-70b-versatile",
    imageUrl = null,
    chatId = null,
    senderId = null
  } = options;

  try {
    // Get conversation history if available
    let messages: any[] = [];
    if (chatId && senderId) {
      const history = getConversationHistory(chatId, senderId);
      messages = history.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
    }

    // Find the selected model
    const primaryModel = AI_MODELS.find(m => m.model === selectedModel) || AI_MODELS[0];
    
    // Create fallback model list (sorted by priority, excluding the primary model)
    const fallbackModels = AI_MODELS
      .filter(m => m.model !== selectedModel)
      .sort((a, b) => (a.priority || 999) - (b.priority || 999));
    
    // Prepare message format
    const newMessage: any = {
      role: "user",
      content: []
    };

    // Add text content
    newMessage.content.push({
      type: "text",
      text: message
    });

    // Add image if provided
    if (imageUrl) {
      newMessage.content.push({
        type: "image_url",
        image_url: { url: imageUrl }
      });
    }

    // For non-OpenRouter models, use simple string content
    if (!primaryModel.model.includes('openrouter')) {
      newMessage.content = message;
    }

    messages.push(newMessage);

    // Try primary model first
    let aiResponse: string;
    let modelUsed = primaryModel.name;
    
    try {
      aiResponse = await callAIModel(primaryModel, messages, selectedModel);
    } catch (primaryError: any) {
      console.warn(`Primary model ${primaryModel.name} failed:`, primaryError.message);
      
      // If primary model fails due to rate limit, try fallback models
      if (primaryError.isRateLimitError && fallbackModels.length > 0) {
        console.log('Trying fallback models due to rate limit...');
        
        let lastError = primaryError;
        
        for (const fallbackModel of fallbackModels) {
          try {
            console.log(`Trying fallback model: ${fallbackModel.name}`);
            
            // Adjust message format for different model types
            let fallbackMessages = [...messages];
            if (!fallbackModel.model.includes('openrouter') && typeof newMessage.content !== 'string') {
              fallbackMessages[fallbackMessages.length - 1] = {
                role: "user",
                content: message
              };
            }
            
            aiResponse = await callAIModel(fallbackModel, fallbackMessages, selectedModel);
            modelUsed = fallbackModel.name;
            console.log(`Successfully used fallback model: ${fallbackModel.name}`);
            break;
          } catch (fallbackError: any) {
            console.warn(`Fallback model ${fallbackModel.name} failed:`, fallbackError.message);
            lastError = fallbackError;
            continue;
          }
        }
        
        // If all models failed, throw the last error with additional info
        if (!aiResponse!) {
          const error = new Error(`All AI models are currently unavailable. Last error: ${lastError.message}`) as APIError;
          error.isRateLimitError = true;
          error.modelUsed = 'All models';
          throw error;
        }
      } else {
        // If not a rate limit error or no fallback models, re-throw the original error
        throw primaryError;
      }
    }

    // Add success indicator if fallback was used
    if (modelUsed !== primaryModel.name) {
      aiResponse = `[Using ${modelUsed}]\n\n${aiResponse}`;
    }

    // Save to memory
    if (chatId && senderId) {
      addToConversationHistory(chatId, senderId, "user", message, imageUrl || undefined);
      addToConversationHistory(chatId, senderId, "assistant", aiResponse);
    }

    return aiResponse;

  } catch (err: any) {
    console.error('AI Service Error:', err);
    
    // Re-throw structured errors for better handling in UI
    if (err.isRateLimitError) {
      throw err;
    }
    
    // For other errors, create a structured error
    const error = new Error(err.message || 'Unknown AI service error') as APIError;
    error.statusCode = err.statusCode;
    error.modelUsed = err.modelUsed;
    throw error;
  }
}