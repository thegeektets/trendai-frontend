"use client";

import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import { useSession } from "next-auth/react";

export default function SessionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen">
      {session && <Sidebar />}
      <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
        <Header isLoggedIn={!!session} />
        <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
