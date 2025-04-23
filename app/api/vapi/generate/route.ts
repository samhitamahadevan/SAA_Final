export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { role, type, level, techstack, amount = 5, userid } = await request.json();

    if (!role || !type || !level || !techstack || !userid) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Generate questions with difficulty levels
    const { text: rawQuestions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Generate ${amount} interview questions with varying difficulty levels.
Role: ${role}
Level: ${level}
Type: ${type}
Tech Stack: ${techstack}

Important: Return ONLY an array of objects with questions and their difficulty levels. Format must be exactly like this:
[
  {"question": "What is your experience with X?", "difficulty": 3},
  {"question": "How would you implement Y?", "difficulty": 7},
  {"question": "Explain the concept of Z", "difficulty": 5}
]

Difficulty levels should be from 1-10 where:
1-3: Basic/Entry level questions
4-7: Intermediate level questions
8-10: Advanced/Expert level questions

Distribute the questions across different difficulty levels based on the specified experience level:
- For "entry" level: 60% easy (1-3), 30% medium (4-7), 10% hard (8-10)
- For "intermediate" level: 30% easy (1-3), 50% medium (4-7), 20% hard (8-10)
- For "senior" level: 10% easy (1-3), 40% medium (4-7), 50% hard (8-10)

No additional text, no numbering, no explanations - just the JSON array.`,
    });

    console.log("Raw response from Gemini:", rawQuestions);

    let parsedQuestions;
    try {
      // Find the array in the response
      const startIdx = rawQuestions.indexOf('[');
      const endIdx = rawQuestions.lastIndexOf(']');
      
      if (startIdx === -1 || endIdx === -1) {
        throw new Error("Could not find array in response");
      }

      const arrayStr = rawQuestions.substring(startIdx, endIdx + 1);
      parsedQuestions = JSON.parse(arrayStr);

      // Validate that it's an array of objects with question and difficulty
      if (!Array.isArray(parsedQuestions) || !parsedQuestions.every(q => 
        typeof q === 'object' && 
        typeof q.question === 'string' && 
        typeof q.difficulty === 'number' &&
        q.difficulty >= 1 &&
        q.difficulty <= 10
      )) {
        throw new Error('Response is not an array of valid question objects');
      }

      // Clean up questions
      parsedQuestions = parsedQuestions
        .map(q => ({
          ...q,
          question: q.question.trim()
        }))
        .filter(q => q.question.length > 0);

      if (parsedQuestions.length !== amount) {
        throw new Error(`Expected ${amount} questions but got ${parsedQuestions.length}`);
      }

      const interview = {
        role,
        type,
        level,
        techstack: Array.isArray(techstack) ? techstack : techstack.split(",").map((t: string) => t.trim()),
        questions: parsedQuestions,
        userId: userid,
        finalized: true,
        coverImage: getRandomInterviewCover(),
        createdAt: new Date().toISOString(),
        currentDifficulty: 5, // Start with medium difficulty
        maxDifficulty: 10,
        minDifficulty: 1
      };

      // Save to Firestore
      const docRef = await db.collection("interviews").add(interview);
      console.log("Saved interview with ID:", docRef.id);

      return new Response(
        JSON.stringify({
          success: true,
          interviewId: docRef.id,
        }),
        { status: 200 }
      );

    } catch (error) {
      console.error("Failed to process questions:", error);
      throw new Error("Failed to generate valid questions format");
    }

  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
