"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Card } from "@/components/Card";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function About() {
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
          About Bluffy
        </h1>
        <p className="text-lg text-gray-300 text-center opacity-90 font-medium mb-8 max-w-2xl font-mono">
          Bluffy is an exciting card game built upon the concept of popular bluffing games, such as Poker, with a few fun and strategic tweaks.
        </p>

        <p className="text-lg text-gray-300 text-center opacity-90 font-medium mb-8 max-w-2xl font-mono">
          I developed this game with the aim of creating an online multiplayer card game that brings together strategy, deception, and fun. It’s designed to be easy to learn but difficult to master!
        </p>

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

        {/* Example Card */}
        <div className="mt-12">
          <Card
            src="/cards/ah.svg"
            alt="Bluffy About Card"
            height={130}
            width={100}
            className="rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.4)] cursor-pointer"
          />
        </div>
      </motion.div>
    </main>
  );
}
