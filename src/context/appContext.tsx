"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface CaseStudyPreview {
  id: string;
  content: any;
  createdAt?: string;
}

interface GlobalContextType {
  user: null;
  previewData: CaseStudyPreview | null;
  setPreviewData: (data: CaseStudyPreview | null) => void;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);

const AI_PREVIEW_STORAGE_KEY = "ai_case_study_preview";

const GlobalProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const router = useRouter();

  // Initialize from localStorage
  const [previewData, setPreviewDataState] = useState<CaseStudyPreview | null>(
    () => {
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem(AI_PREVIEW_STORAGE_KEY);
          return stored ? JSON.parse(stored) : null;
        } catch (error) {
          console.error("Error loading preview data from localStorage:", error);
          return null;
        }
      }
      return null;
    }
  );

  const [showPreview, setShowPreview] = useState(false);

  // Wrapper function that also saves to localStorage
  const setPreviewData = (data: CaseStudyPreview | null) => {
    setPreviewDataState(data);

    if (typeof window !== "undefined") {
      try {
        if (data) {
          localStorage.setItem(AI_PREVIEW_STORAGE_KEY, JSON.stringify(data));
        } else {
          localStorage.removeItem(AI_PREVIEW_STORAGE_KEY);
        }
      } catch (error) {
        console.error("Error saving preview data to localStorage:", error);
      }
    }
  };

  const loadData = () => {
    const token = sessionStorage.getItem("user");
    if (!token) {
      router.replace("/");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const value: GlobalContextType = {
    user: null,
    previewData,
    setPreviewData,
    showPreview,
    setShowPreview,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext) as GlobalContextType;
};

// Helper function to clear AI preview data
export const clearAIPreviewData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AI_PREVIEW_STORAGE_KEY);
  }
};

export default GlobalProvider;
