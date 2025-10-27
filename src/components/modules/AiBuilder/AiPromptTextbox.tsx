import React, { useState, useRef } from "react";
import { Send, Plus, X, Image } from "lucide-react";

const AIPromptTextBox = () => {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleSubmit = async () => {
    if (!prompt.trim() || isSubmitting) return;

    setIsSubmitting(true);

    // Simulate API call
    console.log("Submitting prompt:", prompt);

    // Reset after submission
    setTimeout(() => {
      setPrompt("");
      setIsSubmitting(false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Text input container */}
      <div className="relative">
        <div className="relative border border-gray-300 rounded-lg bg-white shadow-sm hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all duration-200">
          {/* Plus button */}
          <button
            type="button"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors z-10"
            aria-label="Add attachment"
          >
            <Plus size={18} />
          </button>

          {/* Text input */}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="w-full pl-12 pr-14 py-4 text-gray-900 placeholder-gray-500 bg-transparent border-none outline-none resize-none min-h-[60px] max-h-32 rounded-lg"
            rows={1}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          />

          {/* Send button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!prompt.trim() || isSubmitting}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-200 z-10 ${
              prompt.trim() && !isSubmitting
                ? "bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            aria-label="Send message"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>

        {/* Helper text */}
        <div className="flex justify-between items-center mt-2 px-1">
          <span className="text-xs text-gray-500">
            Press Enter to send, Shift + Enter for new line
          </span>
          <span className="text-xs text-gray-500">{prompt.length}/2000</span>
        </div>
      </div>
    </div>
  );
};

export default AIPromptTextBox;
