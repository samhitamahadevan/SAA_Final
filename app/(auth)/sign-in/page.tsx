import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/actions/auth.action";
import AuthForm from "@/components/AuthForm";

const SignIn = async () => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <AuthForm type="sign-in" />
    </div>
  );
};

export default SignIn;
