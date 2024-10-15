"use client";

import { createContext, useContext, useState } from "react";

import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface GeneratorContextType {
  inputPrompt: string;
  generatedPrompt: string;
  loading: boolean;
  setInputPrompt: (input: string) => void;
  handleGenerate: () => Promise<void>;
}

const GeneratorContext = createContext<GeneratorContextType | undefined>(
  undefined,
);

export const GeneratorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [inputPrompt, setInputPrompt] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const useCreatePromptMutation = () => {
    return useMutation({
      mutationFn: async (values: any) => {
        const res = await fetch("/api/prompt", {
          body: JSON.stringify(values),
          method: "POST",
          headers: { Authorization: `Bearer ${await getToken()}` },
        });

        if (!res.ok && res.status >= 500) {
          throw new Error("Network response error");
        }

        return res.json();
      },
      onSuccess: (result) => {
        if (!result.error) {
          setGeneratedPrompt(result.prompt);
        } else {
          toast.error(result.error);
        }
      },
    });
  };

  const usePrompt = useCreatePromptMutation();

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setGeneratedPrompt("");
      await usePrompt.mutateAsync({ prompt: inputPrompt });
    } catch (error) {
      console.error("error", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GeneratorContext.Provider
      value={{
        inputPrompt,
        generatedPrompt,
        loading,
        setInputPrompt,
        handleGenerate,
      }}
    >
      {children}
    </GeneratorContext.Provider>
  );
};

export const useGenerator = () => {
  const context = useContext(GeneratorContext);

  if (!context) {
    throw new Error("useGenerator must be used within a GeneratorProvider");
  }

  return context;
};
