import Link from "next/link";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";

const SignIn = async () => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-md bg-[#2A2A2A] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
              </svg>
            </div>
            <h2 className="text-3xl font-normal text-[#2A2A2A]">PrepPal</h2>
          </Link>
          <h1 className="text-4xl font-normal text-[#2A2A2A] mb-3">Welcome back</h1>
          <p className="text-[#4A4A4A]">Sign in to continue practicing interviews</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E5DFD6]">
          <form action="/api/auth/signin" method="post" className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-md border border-[#E5DFD6] focus:outline-none focus:ring-2 focus:ring-[#2A2A2A] focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-md border border-[#E5DFD6] focus:outline-none focus:ring-2 focus:ring-[#2A2A2A] focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#2A2A2A] text-white py-3 px-4 rounded-md hover:bg-[#1A1A1A] transition-colors"
            >
              Sign in
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-[#4A4A4A]">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-[#2A2A2A] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
