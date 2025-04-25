"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [hasInteractionStarted, setHasInteractionStarted] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState(5); // Start with medium difficulty

  // Function to analyze response and adjust difficulty
  const analyzeResponseAndAdjustDifficulty = (response: string) => {
    // Indicators of struggle
    const hesitationIndicators = [
      "um", "uh", "hmm", "well...", "let me think",
      "i'm not sure", "i don't know", "maybe", "possibly",
      "i guess", "kind of", "sort of"
    ];
    
    // Indicators of confidence
    const confidenceIndicators = [
      "definitely", "absolutely", "certainly", "i'm confident",
      "i know", "clearly", "precisely", "exactly",
      "specifically", "in my experience"
    ];

    const response_lower = response.toLowerCase();
    
    // Count indicators
    const hesitationCount = hesitationIndicators.reduce((count, indicator) => 
      count + (response_lower.match(new RegExp(indicator, 'g')) || []).length, 0
    );
    
    const confidenceCount = confidenceIndicators.reduce((count, indicator) => 
      count + (response_lower.match(new RegExp(indicator, 'g')) || []).length, 0
    );

    // Analyze response length and complexity
    const isDetailedResponse = response.length > 100;
    const hasCodeExample = response.includes('code') || response.includes('example') || response.includes('function');
    const hasTechnicalTerms = response.includes('algorithm') || response.includes('complexity') || response.includes('implementation');

    // Calculate difficulty adjustment
    let difficultyAdjustment = 0;
    
    // Reduce difficulty if struggling
    if (hesitationCount > 2) difficultyAdjustment -= 1;
    if (response.length < 50) difficultyAdjustment -= 1;
    
    // Increase difficulty if doing well
    if (confidenceCount > 2) difficultyAdjustment += 1;
    if (isDetailedResponse) difficultyAdjustment += 1;
    if (hasCodeExample) difficultyAdjustment += 1;
    if (hasTechnicalTerms) difficultyAdjustment += 1;

    // Update difficulty within bounds
    setCurrentDifficulty(prev => 
      Math.min(Math.max(prev + difficultyAdjustment, 1), 10)
    );
  };

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
        setHasInteractionStarted(true);
        
        // Analyze user's response and adjust difficulty
        if (message.role === "user") {
          analyzeResponseAndAdjustDifficulty(message.transcript);
        }
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      // Only generate feedback if there was actual interaction
      if (!hasInteractionStarted || messages.length < 2) {
        console.log("No meaningful interaction detected, skipping feedback generation");
        router.push("/");
        return;
      }

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId, hasInteractionStarted]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    setHasInteractionStarted(false);
    setMessages([]);

    // Filter and sort questions based on current difficulty
    let availableQuestions = questions
      ? questions.filter(q => 
          Math.abs(q.difficulty - currentDifficulty) <= 2  // Questions within 2 difficulty levels
        ).sort((a, b) => 
          Math.abs(a.difficulty - currentDifficulty) - Math.abs(b.difficulty - currentDifficulty)
        )
      : [];

    // If no questions in the desired range, take the closest ones
    if (availableQuestions.length === 0 && questions) {
      availableQuestions = questions.sort((a, b) => 
        Math.abs(a.difficulty - currentDifficulty) - Math.abs(b.difficulty - currentDifficulty)
      );
    }

    const formattedQuestions = availableQuestions
      .map(q => `- ${q.question} (Difficulty: ${q.difficulty})`)
      .join("\n");

    await vapi.start(interviewer, {
      variableValues: {
        questions: formattedQuestions,
        username: userName,
        userid: userId,
        currentDifficulty: currentDifficulty.toString()
      },
    });
  };

  const handleDisconnect = () => {
    if (!hasInteractionStarted) {
      router.push("/");
    } else {
      setCallStatus(CallStatus.FINISHED);
      vapi.stop();
    }
  };

  return (
    <>
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="profile-image"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <div className="avatar">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-gray-400">
                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-center mt-8">
        {callStatus === CallStatus.INACTIVE && (
          <button onClick={handleCall} className="btn-call">
            Start Interview
          </button>
        )}

        {(callStatus === CallStatus.ACTIVE ||
          callStatus === CallStatus.CONNECTING) && (
          <button onClick={handleDisconnect} className="btn-disconnect">
            {hasInteractionStarted ? "End Interview" : "Cancel"}
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
