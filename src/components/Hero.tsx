"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Card } from "@/components/Card";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  // Keyboard Shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "c" || e.key === "C")) {
        router.push("/create-room");
      }
      if (e.altKey && (e.key === "j" || e.key === "J")) {
        router.push("/join-room");
      }
      if (e.altKey && (e.key === "h" || e.key === "H")) {
        router.push("/");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <main className="w-full flex flex-col items-center justify-center pt-20 pb-32 px-4 relative overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Glassy container */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-dark border border-gray-700 mx-auto px-10 py-16 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.6)] max-w-4xl bg-black/50 backdrop-blur-xl flex flex-col items-center"
      >
        <h1
          className="text-5xl md:text-6xl font-extrabold text-white text-center tracking-tight drop-shadow-xl mb-6"
          style={{ fontFamily: "var(--font-spacemono)", letterSpacing: "0.04em" }}
        >
          Outsmart. Outplay. <span className="text-blue-400">Bluff Better.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 text-center opacity-90 font-medium mb-12 max-w-2xl font-mono">
          A bold bluffing game where strategy meets deception. Play smart, win big.
        </p>

        {/* Buttons */}
        <div className="flex gap-6 mb-4 flex-wrap justify-center">
          <Link href="/create-room">
            <Button
              size="lg"
              className="relative group cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 font-bold px-10 py-3 rounded-xl text-lg text-gray-100 shadow-xl hover:shadow-blue-800/40 transition-all focus:ring-4 focus:ring-blue-500/40"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Create Room
             
            </Button>
          </Link>

          <Link href="/join-room">
            <Button
              size="lg"
              variant="outline"
              className="relative group cursor-pointer border-2 border-blue-400 hover:border-blue-500 text-blue-300 font-bold px-10 py-3 rounded-xl text-lg shadow transition-all hover:shadow-blue-500/30 focus:ring-4 focus:ring-blue-500/40"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Join Room
              
            </Button>
          </Link>
        </div>

        {/* Back to Home Link */}
       

        {/* Shortcut Tips */}
        <p className="mt-4 text-center text-xs text-gray-500">
          Use{" "}
          <kbd className="px-1 py-0.5 rounded bg-gray-800 border border-gray-700">
            Alt + C
          </kbd>{" "}
          to create,{"    "}
          <kbd className="px-1 py-0.5 rounded bg-gray-800 border border-gray-700">
            Alt + J
          </kbd>{" "}
          to join,{" "}
         
        </p>

        {/* Card Belt */}
        <div className="relative w-full overflow-hidden h-40 mt-12">
          <motion.div
            className="absolute flex gap-4"
            initial={{ x: 0 }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          >
            {[
              "/cards/ad.svg",
              "/cards/as.svg",
              "/cards/ah.svg",
              "/cards/ac.svg",
              "/cards/2h.svg",
              "/cards/2d.svg",
              "/cards/2s.svg",
              "/cards/2c.svg",
              "/cards/3h.svg",
            ]
              .concat([
                "/cards/ad.svg",
                "/cards/as.svg",
                "/cards/ah.svg",
                "/cards/ac.svg",
                "/cards/2h.svg",
                "/cards/2d.svg",
                "/cards/2s.svg",
                "/cards/2c.svg",
                "/cards/3h.svg",
              ])
              .map((card, index) => (
                <Card
                  key={index}
                  src={card}
                  alt={`Card ${index}`}
                  height={130}
                  width={100}
                  className="rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.4)] cursor-pointer transition-transform hover:scale-105"
                />
              ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Ambient background blur */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 rounded-full"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.3, delay: 0.3 }}
        style={{
          width: 900,
          height: 400,
          background:
            "radial-gradient(ellipse at center, rgba(59,130,246,0.5) 0%, rgba(37,99,235,0.05) 100%)",
          filter: "blur(120px)",
        }}
      />
    </main>
  );
}
