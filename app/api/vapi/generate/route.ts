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

    // Generate questions
    const { text: rawQuestions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Generate ${amount} interview questions.
Role: ${role}
Level: ${level}
Type: ${type}
Tech Stack: ${techstack}

Important: Return ONLY an array of questions. Format must be exactly like this:
["What is your experience with X?", "How would you implement Y?", "Explain the concept of Z"]

No additional text, no numbering, no explanations - just the array of questions.`,
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

      // Validate that it's an array of strings
      if (!Array.isArray(parsedQuestions) || !parsedQuestions.every(q => typeof q === 'string')) {
        throw new Error('Response is not an array of strings');
      }

      // Clean up questions
      parsedQuestions = parsedQuestions.map(q => q.trim()).filter(q => q.length > 0);

      if (parsedQuestions.length !== amount) {
        throw new Error(`Expected ${amount} questions but got ${parsedQuestions.length}`);
      }

      const interview = {
        role,
        type,
        level,
        techstack: Array.isArray(techstack) ? techstack : techstack.split(",").map((t: string) => t.trim()),
        questions: parsedQuestions, // Store only the generated questions
        userId: userid,
        finalized: true,
        coverImage: getRandomInterviewCover(),
        createdAt: new Date().toISOString()
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
