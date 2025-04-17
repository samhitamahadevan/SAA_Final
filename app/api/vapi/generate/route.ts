import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  const { role, type, level, techstack, amount, userid } = await request.json();

  try {
    // Map experience level to initial difficulty range
    const difficultyRanges = {
      "Junior": { min: 1, max: 3 },
      "Mid-Level": { min: 2, max: 4 },
      "Senior": { min: 3, max: 5 },
      "Lead": { min: 4, max: 5 }
    } as const;

    const difficultyRange = difficultyRanges[level as keyof typeof difficultyRanges] || { min: 1, max: 5 };

    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        
        Generate questions with difficulty levels between ${difficultyRange.min} and ${difficultyRange.max}, where:
        1 = Very Basic (fundamental concepts)
        2 = Basic (straightforward application)
        3 = Intermediate (requires some analysis)
        4 = Advanced (complex scenarios)
        5 = Expert (edge cases, optimization)
        
        Distribute the questions across the difficulty range, starting with easier questions and gradually increasing difficulty.
        
        Please return the questions in this format:
        [
          {"question": "Question 1", "difficulty": 2},
          {"question": "Question 2", "difficulty": 3},
          {"question": "Question 3", "difficulty": 4}
        ]
        
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        
        Thank you! <3
    `,
    });

    const parsedQuestions = JSON.parse(questions);
    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions: parsedQuestions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
      currentDifficulty: difficultyRange.min,
      maxDifficulty: difficultyRange.max,
      minDifficulty: difficultyRange.min
    };

    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
