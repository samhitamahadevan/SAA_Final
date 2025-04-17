import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/firebase/admin";
import ClientAgent from "@/components/interview/ClientAgent";
import InterviewForm from "@/components/interview/InterviewForm";

interface Interview {
  userName?: string;
  questions?: string[];
}

export default async function InterviewPage({ params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  // Get interview data
  const interviewDoc = await db.collection("interviews").doc(params.id).get();
  const interview = interviewDoc.data() as Interview | undefined;

  if (!interview) {
    return (
      <div className="flex-center min-h-screen w-full flex-col gap-4 p-8">
        <h1 className="h1-bold">Interview Setup</h1>
        <InterviewForm 
          userId={userId} 
          onSubmitSuccess={(interviewId: string) => {
            redirect(`/interview/${interviewId}`);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex-center min-h-screen w-full flex-col gap-4">
      <ClientAgent
        userName={interview.userName || "User"}
        userId={userId}
        interviewId={params.id}
        type="interview"
        questions={interview.questions || []}
      />
    </div>
  );
}
