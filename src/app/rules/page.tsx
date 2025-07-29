"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Rules() {
  return (
    <main className="w-full flex flex-col items-center justify-center pt-20 pb-32 px-4 relative overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <Navbar />
      
      {/* Glassy container */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-dark border border-gray-700 mx-auto px-10 py-16 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.6)] max-w-4xl bg-black/50 backdrop-blur-xl flex flex-col items-center"
      >
        <h1 className="text-4xl font-extrabold text-white text-center mb-6">
          Game Rules
        </h1>
        <p className="text-lg text-gray-300 text-center opacity-90 font-medium mb-6 max-w-2xl font-mono">
          Here are the basic rules for playing Bluffy:
        </p>

        <ul className="text-lg text-gray-300 font-medium max-w-2xl font-mono mb-8 space-y-4">
          <li>1. The game is played with a standard deck of cards.</li>
          <li>2. Players take turns playing a card while bluffing about what card they played.</li>
          <li>3. The goal is to be the first to empty your hand of cards.</li>
          <li>4. Players may challenge the validity of a bluff and force a reveal.</li>
          <li>5. Deception and strategy are key to winning the game!</li>
        </ul>

        <div className="flex gap-6 mb-4 flex-wrap justify-center">
          <Link href="/create-room">
            <Button
              size="lg"
              className="relative group cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 font-bold px-10 py-3 rounded-xl text-lg text-gray-100 shadow-xl hover:shadow-blue-800/40 transition-all"
            >
              Start Playing
            </Button>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
