import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "담소",
  description: "부모와 자녀가 서로에게 묻고 영상으로 답하는 살아있는 회고록",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
