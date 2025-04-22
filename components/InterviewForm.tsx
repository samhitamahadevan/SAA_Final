"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { interviewTypes, experienceLevels } from "@/constants";

interface InterviewFormProps {
  userId: string;
  userName: string;
  onSubmitSuccess?: (interviewId: string) => void;
}

const InterviewForm = ({ userId, userName, onSubmitSuccess }: InterviewFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const formValues = {
        role: formData.get("role")?.toString() || "",
        type: formData.get("type")?.toString() || "",
        level: formData.get("level")?.toString() || "",
        techstack: formData.get("techstack")?.toString().split(",").map(tech => tech.trim()) || [],
        amount: parseInt(formData.get("numQuestions")?.toString() || "5", 10),
      };

      // Validate number of questions
      if (formValues.amount < 1 || formValues.amount > 10) {
        throw new Error("Please enter a number between 1 and 10");
      }

      // Create interview in Firestore through our API
      const interviewResponse = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: formValues.role,
          type: formValues.type,
          level: formValues.level,
          techstack: formValues.techstack,
          amount: formValues.amount,
          userid: userId,
        }),
      });

      const interviewResult = await interviewResponse.json();

      if (interviewResult.success) {
        if (onSubmitSuccess) {
          onSubmitSuccess(interviewResult.interviewId);
        } else {
          router.push(`/interview/${interviewResult.interviewId}`);
        }
      } else {
        throw new Error(interviewResult.error || "Failed to create interview");
      }
    } catch (error) {
      console.error("Error creating interview:", error);
      setError(error instanceof Error ? error.message : "Failed to create interview. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {error && (
        <div className="p-4 text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      {/* Role */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <Input
          id="role"
          name="role"
          required
          placeholder="e.g. Frontend Developer"
          className="mt-1"
        />
      </div>

      {/* Interview Type */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Interview Type
        </label>
        <select
          id="type"
          name="type"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-200 focus:ring-primary-200"
        >
          {interviewTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label} {type.icon} - {type.description}
            </option>
          ))}
        </select>
      </div>

      {/* Experience Level */}
      <div>
        <label htmlFor="level" className="block text-sm font-medium text-gray-700">
          Experience Level
        </label>
        <select
          id="level"
          name="level"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-200 focus:ring-primary-200"
        >
          {experienceLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label} {level.icon} - {level.description}
            </option>
          ))}
        </select>
      </div>

      {/* Tech Stack */}
      <div>
        <label htmlFor="techstack" className="block text-sm font-medium text-gray-700">
          Tech Stack (comma-separated)
        </label>
        <Input
          id="techstack"
          name="techstack"
          required
          placeholder="e.g. React, TypeScript, Node.js"
          className="mt-1"
        />
      </div>

      {/* Number of Questions */}
      <div>
        <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700">
          Number of Questions (1-10)
        </label>
        <Input
          id="numQuestions"
          name="numQuestions"
          type="number"
          min="1"
          max="10"
          defaultValue="5"
          required
          className="mt-1"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary-200 hover:bg-primary-300"
      >
        {isSubmitting ? "Generating Questions..." : "Generate Interview Questions"}
      </Button>
    </form>
  );
};

export default InterviewForm; 