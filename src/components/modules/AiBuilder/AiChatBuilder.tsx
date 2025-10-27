"use client";

import React, { useRef, useState, useEffect } from "react";
import { Plus, Send, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAiCreateCaseStudy } from "@/service/query/portfolio.service";
import { useToast } from "@/context/ToastContext";
import { useGlobalContext } from "@/context/appContext";
import { AxiosError } from "axios";

const AiBuilderChat = () => {
  const [prompt, setPrompt] = useState("");
  const [currentStage, setCurrentStage] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { addToast } = useToast();
  const { setPreviewData, setShowPreview } = useGlobalContext();

  const { mutate, isPending } = useAiCreateCaseStudy();

  const loadingStages = [
    {
      id: 1,
      label: "Analyzing prompt",
      description: "Understanding your project requirements and goals",
    },
    {
      id: 2,
      label: "Researching solutions",
      description: "Gathering and analyzing relevant data",
    },
    {
      id: 3,
      label: "Designing studies",
      description: "Transforming data into visual insights",
    },
  ];

  useEffect(() => {
    if (isPending) {
      setCurrentStage(0);
      const stageInterval = setInterval(() => {
        setCurrentStage((prev) =>
          prev < loadingStages.length - 1 ? prev + 1 : prev
        );
      }, 2000);

      return () => clearInterval(stageInterval);
    } else {
      setCurrentStage(0);
    }
  }, [isPending]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }

    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!prompt.trim()) return;

    const formData = new FormData();
    formData.append("prompt", prompt);
    selectedFiles.forEach((file) => formData.append("files", file));

    mutate(formData as any, {
      onSuccess: (data) => {
        addToast("Case study created successfully!", "success");

        // Set preview data and show preview
        setPreviewData({
          id: data?.id || data?.caseStudyId || "temp-id",
          content: data,
          createdAt: new Date().toISOString(),
        });
        setShowPreview(true);

        // Clear form
        setPrompt("");
        setSelectedFiles([]);
        setImagePreviews([]);
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          const err = error?.response?.data?.message || "Something went wrong";
          addToast(err, "error");
        }
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const progress = ((currentStage + 1) / loadingStages.length) * 100;

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
      />

      {isPending ? (
        <div className="flex flex-col items-center justify-center flex-1 space-y-8 px-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-gray-200"></div>
            <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-gray-600 border-t-transparent animate-spin"></div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900">
            Creating Your Case Study
          </h2>

          <p className="text-sm text-gray-500 text-center max-w-md">
            We're transforming your project insights into a compelling,
            expert-ready case study.
          </p>

          <div className="w-full max-w-md space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Processing...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="w-full max-w-md space-y-4 mt-8">
            {loadingStages.map((stage, index) => {
              const isComplete = index < currentStage;
              const isActive = index === currentStage;

              return (
                <div key={stage.id} className="flex items-start space-x-3">
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${
                      isComplete
                        ? "bg-gray-500 border-gray-500"
                        : isActive
                        ? "border-gray-500"
                        : "border-gray-300"
                    }`}
                  >
                    {isComplete && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    {isActive && (
                      <Loader2 className="w-3 h-3 text-gray-500 animate-spin" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        isActive || isComplete
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {stage.label}
                    </p>
                    <p
                      className={`text-xs ${
                        isActive || isComplete
                          ? "text-gray-500"
                          : "text-gray-400"
                      }`}
                    >
                      {stage.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center flex-1 space-y-6 px-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              Start Creating Your Case Study
            </h3>
            <p className="text-sm text-gray-500 max-w-md">
              Describe your project in detail and let AI transform it into a
              professional case study. Include project goals, challenges,
              solutions, and outcomes.
            </p>
          </div>

          <div className="w-full max-w-2xl mt-4">
            <p className="text-xs font-medium text-gray-700 mb-3 text-center">
              Try these examples:
            </p>
            <div className="grid gap-2">
              {[
                "Create a case study for an e-commerce redesign that increased conversions by 45%",
                "Document my mobile app development project for a fitness tracking application",
                "Build a case study showcasing a brand identity redesign for a tech startup",
              ].map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(example)}
                  className="text-left px-4 py-3 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="sticky bottom-0 pb-6 px-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
          {selectedFiles.length > 0 && (
            <div className="px-3 pt-3 pb-2 border-b border-gray-100">
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={imagePreviews[index]}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                      disabled={isPending}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your project in detail... Include goals, challenges, solutions, and outcomes."
            className="min-h-[100px] border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isPending}
          />

          <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={isPending}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem asChild>
                    <button
                      type="button"
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.click();
                        }
                      }}
                      className="flex items-center w-full text-left"
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      <span>Upload Image</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {selectedFiles.length > 0 && (
                <span className="text-xs text-gray-500">
                  {selectedFiles.length}{" "}
                  {selectedFiles.length === 1 ? "image" : "images"}
                </span>
              )}
            </div>

            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!prompt.trim() || isPending}
              className="h-8 gap-2"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Generate</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiBuilderChat;
