import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

export default async function Home() {
  const user = await getCurrentUser();
  const interviews = user ? await getInterviewsByUserId(user.id) : [];

  return (
    <div className="max-w-[1200px] mx-auto ">
      {/* Hero Section */}
      <section className="py-20 flex justify-between items-center border-b border-[#EAEAEA]">
        <div className="max-w-[540px]">
          <h1 className="text-[56px] leading-[1.2] font-normal text-black mb-8 ">
            Get Interview-Ready
            with AI-Powered
            Practice & Feedback
          </h1>
          <Link
            href="/interview"
            className="inline-flex px-8 py-4 text-xl  border-2 border-black rounded-full hover:bg-black hover:text-white transition-colors"
          >
            Start Now
          </Link>
        </div>
        <div className="w-[500px] h-[500px] border-2 border-dashed border-[#EAEAEA] rounded-lg flex items-center justify-center">
          <Image
            src="/robot.png"
            alt="Mock Interview Illustration"
            width={450}
            height={450}
            priority
            className="object-contain"
          />
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-20 border-b border-[#EAEAEA]">
        <h2 className="text-[48px] leading-[1.2] font-normal text-black mb-12 ">Get Started</h2>
        <div className="grid grid-cols-3 gap-16">
          {[
            {
              step: 1,
              title: "Generate Interview Parameters",
              description: "Click on 'Start Interview' to set up your mock interview"
            },
            {
              step: 2,
              title: "Take the Interview",
              description: "Go to your interviews and start the mock interview session"
            },
            {
              step: 3,
              title: "Get Feedback",
              description: "Receive detailed feedback and improvement suggestions"
            }
          ].map(({ step, title, description }) => (
            <div key={step} className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-black text-xl">
                {step}
              </div>
              <div className="flex-1">
                <h3 className="text-[28px] leading-[1.2] font-normal text-black mb-3">{title}</h3>
                <p className="text-lg text-[#666666] leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Your Interviews Section */}
      <section className="py-20 border-b border-[#EAEAEA]">
        <h2 className="text-[48px] leading-[1.2] font-normal text-black mb-12">Your Interviews</h2>
        {interviews && interviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {interviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interviewId={interview.id}
                userId={user?.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-start gap-8">
            <div className="w-[200px] h-[200px] flex items-center justify-center">
              <Image
                src="/file.png"
                alt="No interviews"
                width={250}
                height={250}
                className="opacity-80"
              />
            </div>
            <div>
              <h3 className="text-[36px] leading-[1.2] font-normal text-black mb-3">No interviews yet</h3>
              <p className="text-xl text-[#666666] leading-relaxed">
                Once you start an interview, it will appear here
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Take Interviews Section */}
      <section className="py-20">
        <h2 className="text-[48px] leading-[1.2] font-normal text-black mb-3">Take Interviews</h2>
        <p className="text-xl text-[#666666] leading-relaxed">
          Browse common interview questions and start practicing
        </p>
      </section>
    </div>
  );
}

