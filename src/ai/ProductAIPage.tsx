import { useState } from "react";
import type { FormEvent } from "react";
import { askProductAI } from "./aiApi";

export default function ProductAIPage() {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!question.trim()) {
      return;
    }

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const data = await askProductAI(question.trim());

      setAnswer(data.answer);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            AI Shopping Assistant
          </h1>

          <p className="mt-2 text-gray-500">Ask me about our products.</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about our products..."
              disabled={loading}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Thinking..." : "Ask AI"}
            </button>
          </form>

          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {answer && (
            <div className="mt-6 rounded-xl bg-gray-50 p-5">
              <h2 className="mb-3 text-lg font-semibold text-gray-800">
                AI Assistant
              </h2>

              <div className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                {answer}
              </div>
            </div>
          )}
        </div>

        {!answer && !loading && !error && (
          <div className="mt-6 text-center">
            <p className="mb-3 text-sm text-gray-500">Try asking:</p>

            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setQuestion("Show me the best products you have")
                }
                className="rounded-full bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-100"
              >
                Best products
              </button>

              <button
                type="button"
                onClick={() => setQuestion("Show me products under 5000")}
                className="rounded-full bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-100"
              >
                Products under 5000
              </button>

              <button
                type="button"
                onClick={() =>
                  setQuestion("What Samsung products do you have?")
                }
                className="rounded-full bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-100"
              >
                Samsung products
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
