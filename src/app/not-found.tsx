"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Card } from "@/components/Card";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Glassy 404 container */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-dark border border-gray-700 px-10 py-16 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.6)] max-w-lg bg-black/40 backdrop-blur-xl flex flex-col items-center"
      >
        <h1
          className="text-7xl font-extrabold text-white text-center tracking-tight drop-shadow-xl mb-4"
          style={{ fontFamily: "var(--font-spacemono)" }}
        >
          404
        </h1>
        <p
          className="text-xl text-gray-300 text-center opacity-90 mb-10 max-w-sm"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Oops! Looks like you got dealt a bad hand.
        </p>

        {/* Floating cards */}
        <motion.div
          className="relative flex gap-4 mb-12"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0, y: 60 },
            show: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          {["/cards/1d.svg", "/cards/1h.svg", "/cards/1s.svg"].map((card, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { scale: 0.8, y: 40 },
                show: { scale: 1, y: 0 },
              }}
              className="transform hover:-translate-y-2 transition-all duration-300"
            >
              <Card
                src={card}
                alt={`Card ${i}`}
                height={120}
                width={90}
                className="rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.4)]"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Back Home Button */}
        <Link href="/">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 font-bold px-8 py-3 rounded-xl text-lg text-gray-100 shadow-xl hover:shadow-blue-800/40 transition-all"
          >
            Back to Home
          </Button>
        </Link>
      </motion.div>

      {/* Ambient blurred blob */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -z-10 rounded-full"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.3, delay: 0.3 }}
        style={{
          width: 800,
          height: 400,
          background:
            "radial-gradient(ellipse at center, rgba(59,130,246,0.4) 0%, rgba(37,99,235,0.05) 100%)",
          filter: "blur(120px)",
        }}
      />
    </main>
  );
}
