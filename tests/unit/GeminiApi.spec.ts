import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { sendGeminiMessage, type GeminiResponse } from "@/services/geminiApi";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe("GeminiApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('test-api-key');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("sends request to correct Gemini API endpoint", async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: "Hello! How can I help you?" }]
          }
        }
      ]
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    await sendGeminiMessage("Hello");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=test-api-key",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: "Hello" }]
            }
          ]
        })
      }
    );
  });

  it("returns formatted response from Gemini API", async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: "Hello! How can I help you?" }]
          }
        }
      ]
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await sendGeminiMessage("Hello");

    expect(result).toEqual({
      content: "Hello! How can I help you?",
      success: true,
    });
  });

  it("throws error when API key is not found", async () => {
    localStorageMock.getItem.mockReturnValue(null);

    await expect(sendGeminiMessage("Hello")).rejects.toThrow(
      "Gemini API key not found. Please configure it in settings."
    );

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("throws error when API key is empty", async () => {
    localStorageMock.getItem.mockReturnValue("");

    await expect(sendGeminiMessage("Hello")).rejects.toThrow(
      "Gemini API key not found. Please configure it in settings."
    );

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("handles API error responses", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      json: () => Promise.resolve({
        error: {
          message: "Invalid API key"
        }
      }),
    });

    await expect(sendGeminiMessage("Hello")).rejects.toThrow(
      "Gemini API error: Invalid API key"
    );
  });

  it("handles API error responses without detailed message", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: () => Promise.resolve({}),
    });

    await expect(sendGeminiMessage("Hello")).rejects.toThrow(
      "Gemini API error: 500 Internal Server Error"
    );
  });

  it("handles network errors", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(sendGeminiMessage("Hello")).rejects.toThrow(
      "Failed to connect to Gemini API: Network error"
    );
  });

  it("handles empty message input", async () => {
    await expect(sendGeminiMessage("")).rejects.toThrow(
      "Message cannot be empty"
    );

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("handles whitespace-only message input", async () => {
    await expect(sendGeminiMessage("   ")).rejects.toThrow(
      "Message cannot be empty"
    );

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("handles response without candidates", async () => {
    const mockResponse = {
      candidates: []
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    await expect(sendGeminiMessage("Hello")).rejects.toThrow(
      "No response from Gemini API"
    );
  });

  it("handles response with empty content", async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: []
          }
        }
      ]
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    await expect(sendGeminiMessage("Hello")).rejects.toThrow(
      "No response from Gemini API"
    );
  });

  it("handles response with multiple parts", async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [
              { text: "Hello! " },
              { text: "How can I help you?" }
            ]
          }
        }
      ]
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await sendGeminiMessage("Hello");

    expect(result).toEqual({
      content: "Hello! How can I help you?",
      success: true,
    });
  });

  it("reads API key from localStorage", async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: "Test response" }]
          }
        }
      ]
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    await sendGeminiMessage("Test");

    expect(localStorageMock.getItem).toHaveBeenCalledWith("gemini-api-key");
  });
});