import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";
import InterviewForm from "@/components/InterviewForm";

export default async function Interview() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="max-w-[1200px] mx-auto py-12">
      <h1 className="text-4xl font-semibold mb-8 text-center">Create New Interview</h1>
      <InterviewForm userId={user.id} userName={user.name} />
    </div>
  );
}
