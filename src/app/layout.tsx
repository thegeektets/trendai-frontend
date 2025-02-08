import "@/css/satoshi.css";
import "@/css/style.css";

import type { Metadata } from "next";
import { ReactNode } from "react";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "./providers";
import SessionWrapper from "./SessionWrapper";

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: {
    template: "%s | trendAI - Influencer Marketing Dashboard",
    default: "trendAI - Influencer Marketing Dashboard",
  },
  description:
    "trendAI is an influencer marketing platform providing campaign tracking, analytics, and performance insights for brands and influencers.",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NextTopLoader showSpinner={false} />
          <SessionWrapper>{children}</SessionWrapper>
        </Providers>
      </body>
    </html>
  );
}
