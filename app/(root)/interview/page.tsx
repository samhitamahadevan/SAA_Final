import InterviewForm from "@/components/InterviewForm";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-semibold text-center">Generate Interview Questions</h3>
      <InterviewForm 
        userId={user?.id!} 
        userName={user?.name!} 
      />
    </div>
  );
};

export default Page;
