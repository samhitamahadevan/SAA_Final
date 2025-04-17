'use client';

import { useState, useEffect } from 'react';
import Agent from '../Agent';

interface ClientAgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  type: "generate" | "interview";
  questions?: Array<{ question: string; difficulty: number; }>;
  feedbackId?: string;
}

const ClientAgent = ({ userName, userId, interviewId, type, questions, feedbackId }: ClientAgentProps) => {
  const [error, setError] = useState<Error | null>(null);
  const [meetingEnded, setMeetingEnded] = useState(false);

  useEffect(() => {
    // Add error event listener to window
    const handleError = (event: ErrorEvent) => {
      console.error('Interview error:', event.error);
      
      // Check if the error is meeting-related
      if (event.error?.message?.includes('Meeting') || 
          event.error?.toString().includes('Meeting')) {
        setMeetingEnded(true);
      } else {
        setError(event.error);
      }
    };

    // Add unhandled rejection listener for promise-based errors
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled rejection:', event.reason);
      
      if (event.reason?.message?.includes('Meeting') || 
          event.reason?.toString().includes('Meeting')) {
        setMeetingEnded(true);
      } else {
        setError(event.reason);
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (meetingEnded) {
    return (
      <div className="p-6 rounded-lg bg-yellow-50 border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Interview Session Ended</h3>
        <p className="text-yellow-700 mb-4">Your interview session has ended. This can happen if:</p>
        <ul className="list-disc list-inside text-yellow-700 mb-4">
          <li>The interview was completed successfully</li>
          <li>There was a connection issue</li>
          <li>The session timed out</li>
        </ul>
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
          >
            Start New Interview
          </button>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-4 py-2 bg-transparent text-yellow-800 hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg bg-red-50 border border-red-200">
        <h3 className="text-lg font-semibold text-red-800 mb-2">An Error Occurred</h3>
        <p className="text-red-700 mb-4">We encountered an unexpected error during your interview.</p>
        <div className="bg-red-100 p-3 rounded-md mb-4">
          <code className="text-red-800 text-sm">{error.message || error.toString()}</code>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
        >
          Restart Interview
        </button>
      </div>
    );
  }

  return (
    <Agent
      userName={userName}
      userId={userId}
      interviewId={interviewId}
      type={type}
      questions={questions}
      feedbackId={feedbackId}
    />
  );
};

export default ClientAgent; 