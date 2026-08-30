const API_BASE_URL = "http://127.0.0.1:8000/api/ai";

export interface ProductAIResponse {
  question: string;
  answer: string;
}

export async function askProductAI(
  question: string,
): Promise<ProductAIResponse> {
  const response = await fetch(`${API_BASE_URL}/product-assistant/`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      question: question,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to get AI response.");
  }

  return data;
}
