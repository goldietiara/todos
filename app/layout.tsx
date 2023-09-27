import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Planner App by Goldie Tiara",
  description: "Gives you focus, From work to play.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-light bg-Ivory ${inter.className}`}>
        <NavBar />
        <main className="max-w-7×1 m-auto min-w-[300px] p-4">{children}</main>
      </body>
    </html>
  );
}
