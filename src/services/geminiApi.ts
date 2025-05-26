import { GoogleGenerativeAI } from "@google/generative-ai";

export interface GeminiApiConfig {
  apiKey: string;
}

export interface GeminiApiResponse {
  content: string;
  success: boolean;
  error?: string;
}

export class GeminiApiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor(private config: GeminiApiConfig) {
    if (!config.apiKey) {
      throw new Error("API key is required");
    }
    this.initialize();
  }

  private initialize(): void {
    try {
      this.genAI = new GoogleGenerativeAI(this.config.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    } catch (error) {
      throw new Error(`Failed to initialize Gemini API: ${error}`);
    }
  }

  async generateResponse(prompt: string): Promise<GeminiApiResponse> {
    if (!prompt?.trim()) {
      return {
        content: "",
        success: false,
        error: "Prompt cannot be empty",
      };
    }

    if (!this.model) {
      return {
        content: "",
        success: false,
        error: "Gemini API not initialized",
      };
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        return {
          content: "",
          success: false,
          error: "No response generated",
        };
      }

      return {
        content: text,
        success: true,
      };
    } catch (error: any) {
      let errorMessage = "Failed to generate response";

      if (error.message?.includes("API_KEY_INVALID")) {
        errorMessage = "Invalid API key";
      } else if (error.message?.includes("SAFETY")) {
        errorMessage = "Content blocked by safety filters";
      } else if (error.message?.includes("QUOTA_EXCEEDED")) {
        errorMessage = "API quota exceeded";
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        content: "",
        success: false,
        error: errorMessage,
      };
    }
  }

  updateApiKey(apiKey: string): void {
    if (!apiKey?.trim()) {
      throw new Error("API key cannot be empty");
    }
    this.config.apiKey = apiKey;
    this.initialize();
  }

  isConfigured(): boolean {
    return !!this.config.apiKey && !!this.model;
  }
}

export const geminiApiService = {
  create: (config: GeminiApiConfig) => new GeminiApiService(config),
};