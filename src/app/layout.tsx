import type { Metadata } from "next";
import { Poppins, Space_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import 'react-toastify/dist/ReactToastify.css';



const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-poppins" });
const spacemono = Space_Mono({ subsets: ["latin"], weight: ["700"], variable: "--font-spacemono" });

export const metadata: Metadata = {
  title: "Bluffy",
  description: "Bluff your way to victory in this epic card game",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${spacemono.variable} font-sans bg-gradient-to-tr from-gray-950 to-blue-950 min-h-screen`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
