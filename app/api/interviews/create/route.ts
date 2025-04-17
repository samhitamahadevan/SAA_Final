import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { role, type, level, techstack, amount, userId } = await request.json();

    // Create the interview document
    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(',').map((tech: string) => tech.trim()),
      amount,
      userId,
      finalized: false,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    // Add to Firestore
    const docRef = await db.collection("interviews").add(interview);

    return Response.json({ 
      success: true, 
      interviewId: docRef.id 
    });
  } catch (error) {
    console.error("Error creating interview:", error);
    return Response.json({ 
      success: false, 
      error: "Failed to create interview" 
    }, { 
      status: 500 
    });
  }
} 