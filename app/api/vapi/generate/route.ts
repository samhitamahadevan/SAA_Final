import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    // Log the request body
    const body = await request.json();
    console.log("Received request body:", body);

    const { role, type, level, techstack, amount, userid } = body;

    // Validate required fields
    if (!role || !type || !level || !techstack || !amount || !userid) {
      console.error("Missing required fields:", { role, type, level, techstack, amount, userid });
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Generating questions with parameters:", {
      role,
      type,
      level,
      techstack,
      amount,
    });

    // Generate questions
    const { text: rawQuestions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `You are a helpful AI assistant generating interview questions. Your task is to generate ${amount} interview questions.

Role: ${role}
Experience Level: ${level}
Tech Stack: ${techstack}
Focus: ${type}

Important: You must respond with ONLY a valid JSON array of strings, nothing else. Example format:
["What is your experience with X?","How would you handle Y?","Tell me about Z"]

Do not include any explanation, conversation, or other text. ONLY the JSON array.`,
    });

    console.log("Raw response from Gemini:", rawQuestions);

    let parsedQuestions;
    try {
      // Try to parse the response as JSON
      parsedQuestions = JSON.parse(rawQuestions.trim());
      
      // Validate that it's an array of strings
      if (!Array.isArray(parsedQuestions) || !parsedQuestions.every(q => typeof q === 'string')) {
        throw new Error('Response is not an array of strings');
      }
      
      console.log("Successfully parsed questions:", parsedQuestions);
    } catch (parseError) {
      console.error("Failed to parse questions:", parseError);
      console.log("Raw questions received:", rawQuestions);
      
      // If parsing fails, try to extract questions from the text
      const questions = rawQuestions
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^["\[\],]*/, '').replace(/["\[\],]*$/, '').trim())
        .filter(line => line.length > 0 && !line.includes('```'));
      
      parsedQuestions = questions;
      console.log("Extracted questions:", parsedQuestions);
    }

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(","),
      questions: parsedQuestions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString()
    };

    console.log("Saving interview:", interview);

    // Save to Firestore
    const docRef = await db.collection("interviews").add(interview);
    console.log("Saved interview with ID:", docRef.id);

    return Response.json({ 
      success: true, 
      interviewId: docRef.id 
    }, { status: 200 });
  } catch (error: any) {
    // Log the full error
    console.error("API Error:", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    });

    return Response.json({ 
      success: false, 
      error: error?.message || "Internal server error" 
    }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
