'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { interviewTypes, experienceLevels } from '@/constants';

interface InterviewFormProps {
  userId: string;
  onSubmitSuccess: () => void;
}

const InterviewForm = ({ userId, onSubmitSuccess }: InterviewFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    type: 'technical',
    level: 'junior',
    techstack: '',
    amount: 5
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/interviews/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSubmitSuccess();
      } else {
        console.error('Failed to create interview');
      }
    } catch (error) {
      console.error('Error creating interview:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl mx-auto">
      {/* Role Input */}
      <div className="form-group">
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Job Role
        </label>
        <input
          type="text"
          id="role"
          value={formData.role}
          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
          placeholder="e.g. Frontend Developer"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          required
        />
      </div>

      {/* Interview Type */}
      <div className="form-group">
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Interview Type
        </label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          {interviewTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label} - {type.description}
            </option>
          ))}
        </select>
      </div>

      {/* Experience Level */}
      <div className="form-group">
        <label htmlFor="level" className="block text-sm font-medium text-gray-700">
          Experience Level
        </label>
        <select
          id="level"
          value={formData.level}
          onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          {experienceLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label} - {level.description}
            </option>
          ))}
        </select>
      </div>

      {/* Tech Stack */}
      <div className="form-group">
        <label htmlFor="techstack" className="block text-sm font-medium text-gray-700">
          Tech Stack (comma-separated)
        </label>
        <input
          type="text"
          id="techstack"
          value={formData.techstack}
          onChange={(e) => setFormData(prev => ({ ...prev, techstack: e.target.value }))}
          placeholder="e.g. React, TypeScript, Node.js"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          required
        />
      </div>

      {/* Number of Questions */}
      <div className="form-group">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Number of Questions
        </label>
        <input
          type="number"
          id="amount"
          min="3"
          max="10"
          value={formData.amount}
          onChange={(e) => setFormData(prev => ({ ...prev, amount: parseInt(e.target.value) }))}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Creating Interview...' : 'Start Interview'}
      </button>
    </form>
  );
};

export default InterviewForm; 