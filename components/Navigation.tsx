'use client';

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const Navigation = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-6">
      <Link 
        href="/#practice"
        className="text-[#4A4A4A] hover:text-[#2A2A2A] transition-colors"
      >
        Practice
      </Link>
      <Link 
        href="/#history"
        className="text-[#4A4A4A] hover:text-[#2A2A2A] transition-colors"
      >
        History
      </Link>
    </div>
  );
};

export default Navigation; 