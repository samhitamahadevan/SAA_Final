"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/admin";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { interviewTypes, experienceLevels } from "@/constants";

interface InterviewFormProps {
  userId: string;
  userName: string;
}

const InterviewForm = ({ userId, userName }: InterviewFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        userId,
        userName,
        role: formData.get("role"),
        type: formData.get("type"),
        level: formData.get("level"),
        techstack: formData.get("techstack")?.toString().split(",").map(tech => tech.trim()),
        questions: formData.get("questions")?.toString().split("\n").filter(q => q.trim()),
        finalized: true,
        createdAt: new Date().toISOString(),
      };

      // Save to Firestore
      const interviewRef = db.collection("interviews").doc();
      await interviewRef.set(data);

      router.push(`/interview/${interviewRef.id}`);
    } catch (error) {
      console.error("Error creating interview:", error);
      alert("Failed to create interview. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
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

      {/* Questions */}
      <div>
        <label htmlFor="questions" className="block text-sm font-medium text-gray-700">
          Interview Questions (one per line)
        </label>
        <Textarea
          id="questions"
          name="questions"
          required
          placeholder="Enter your interview questions here...
Example:
What is your experience with React?
How do you handle state management?
Describe a challenging project you worked on."
          className="mt-1 h-48"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary-200 hover:bg-primary-300"
      >
        {isSubmitting ? "Creating Interview..." : "Create Interview"}
      </Button>
    </form>
  );
};

export default InterviewForm; 