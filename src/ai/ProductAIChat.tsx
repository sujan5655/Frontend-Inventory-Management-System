import { useState } from "react";
import type { FormEvent } from "react";
import { askProductAI } from "./aiApi";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ProductAIChat() {
  const [isOpen, setIsOpen] = useState(false);

  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm your AI shopping assistant. Ask me about our products, prices, stock, or recommendations.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    // Add user's message immediately
    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: trimmedQuestion,
      },
    ]);

    setQuestion("");
    setError("");
    setLoading(true);

    try {
      const response = await askProductAI(trimmedQuestion);

      // Add AI response
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: response.answer,
        },
      ]);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unable to connect to the AI assistant.");
      }
    } finally {
      setLoading(false);
    }
  };

  const askQuickQuestion = (text: string) => {
    setQuestion(text);
  };

  return (
    <>
      {/* ================================= */}
      {/* CHAT WINDOW */}
      {/* ================================= */}

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[600px] w-[380px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* HEADER */}

          <div className="flex items-center justify-between bg-green-600 px-5 py-4 text-white">
            <div>
              <h2 className="font-semibold">AI Shopping Assistant</h2>

              <p className="text-xs text-green-100">
                Ask me about our products
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-2xl leading-none hover:text-gray-200"
            >
              ×
            </button>
          </div>

          {/* ================================= */}
          {/* MESSAGES */}
          {/* ================================= */}

          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    message.role === "user"
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-6">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}

            {/* LOADING */}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
                  AI is thinking...
                </div>
              </div>
            )}

            {/* ERROR */}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>

          {/* ================================= */}
          {/* QUICK QUESTIONS */}
          {/* ================================= */}

          <div className="border-t bg-white px-3 py-2">
            <div className="flex gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={() =>
                  askQuickQuestion("Show me the best products you have")
                }
                className="whitespace-nowrap rounded-full border px-3 py-1 text-xs text-gray-600 hover:bg-gray-100"
              >
                Best products
              </button>

              <button
                type="button"
                onClick={() => askQuickQuestion("Show me products under 5000")}
                className="whitespace-nowrap rounded-full border px-3 py-1 text-xs text-gray-600 hover:bg-gray-100"
              >
                Under 5000
              </button>

              <button
                type="button"
                onClick={() =>
                  askQuickQuestion("What products do you recommend?")
                }
                className="whitespace-nowrap rounded-full border px-3 py-1 text-xs text-gray-600 hover:bg-gray-100"
              >
                Recommend
              </button>
            </div>
          </div>

          {/* ================================= */}
          {/* INPUT */}
          {/* ================================= */}

          <form onSubmit={handleSubmit} className="border-t bg-white p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask about products..."
                disabled={loading}
                className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />

              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================================= */}
      {/* FLOATING BUTTON */}
      {/* ================================= */}

      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-3xl text-white shadow-xl transition hover:scale-105 hover:bg-green-700"
        aria-label="Open AI shopping assistant"
      >
        {isOpen ? "×" : "🤖"}
      </button>
    </>
  );
}
