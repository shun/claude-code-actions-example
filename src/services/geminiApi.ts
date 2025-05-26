export interface GeminiResponse {
  content: string;
  success: boolean;
}

interface GeminiApiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface GeminiApiError {
  error: {
    message: string;
  };
}

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export async function sendGeminiMessage(message: string): Promise<GeminiResponse> {
  if (!message || !message.trim()) {
    throw new Error("Message cannot be empty");
  }

  const apiKey = localStorage.getItem("gemini-api-key");
  if (!apiKey || !apiKey.trim()) {
    throw new Error("Gemini API key not found. Please configure it in settings.");
  }

  const requestBody = {
    contents: [
      {
        parts: [{ text: message.trim() }]
      }
    ]
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorMessage = `${response.status} ${response.statusText}`;
      
      try {
        const errorData: GeminiApiError = await response.json();
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        }
      } catch {
        // If we can't parse the error response, use the status text
      }
      
      throw new Error(`Gemini API error: ${errorMessage}`);
    }

    const data: GeminiApiResponse = await response.json();

    if (!data.candidates || data.candidates.length === 0 || 
        !data.candidates[0].content?.parts || 
        data.candidates[0].content.parts.length === 0) {
      throw new Error("No response from Gemini API");
    }

    // Combine all text parts from the response
    const content = data.candidates[0].content.parts
      .map(part => part.text)
      .join("");

    return {
      content,
      success: true,
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("Gemini API")) {
      throw error;
    }
    
    throw new Error(`Failed to connect to Gemini API: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}