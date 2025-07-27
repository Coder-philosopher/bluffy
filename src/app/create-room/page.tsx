'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Home, LogIn, RefreshCcw } from "lucide-react";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { motion } from "framer-motion";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "https://bluffy-game-backend.tentaciouspersona-01c.workers.dev";

type CreateRoomResponse = {
  roomCode: string;
  data: { playerName: string }[];
};

const VALID_COUNTS = [4, 5, 6] as const;

export default function CreateRoom() {
  const router = useRouter();
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const isValid = useMemo(
    () => playerCount !== null && VALID_COUNTS.includes(playerCount as any),
    [playerCount]
  );

  const handleCreate = useCallback(async () => {
    if (!isValid) {
      toast.error("Please select a valid player count (4, 5, or 6)");
      return;
    }

    setIsLoading(true);
    setLastError(null);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const timeout = setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await axios.post<CreateRoomResponse>(
        `${BACKEND_URL}/api/room/create`,
        { playerCount },
        { signal: controller.signal }
      );

      const { roomCode, data } = response.data;

      try {
        localStorage.setItem("playerName", data[0].playerName);
        localStorage.setItem("roomCode", roomCode);
      } catch {
        /* ignore */
      }

      toast.success(`Room created! Code: ${roomCode}. You're ${data[0].playerName}.`);
      router.push(`/game/${roomCode}`);
    } catch (err) {
      const axErr = err as AxiosError<any>;
      if (controller.signal.aborted) {
        toast.error("Request timed out. Please try again.");
        setLastError("Request timed out.");
      } else if (axErr.response?.data?.message) {
        toast.error(axErr.response.data.message);
        setLastError(axErr.response.data.message);
      } else {
        toast.error("Failed to create room. Please try again.");
        setLastError("Unknown error");
      }
      console.error(err);
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
    }
  }, [isValid, playerCount, router]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        (e.key === "Enter" && (e.metaKey || e.ctrlKey)) ||
        (e.key === "Enter" && !e.shiftKey)
      ) {
        if (!isLoading) handleCreate();
      }

      if (e.altKey && (e.key === "h" || e.key === "H")) router.push("/");
      if (e.altKey && (e.key === "j" || e.key === "J")) router.push("/join-room");
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleCreate, isLoading, router]); // Stable dependency array

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-black p-4 relative overflow-hidden">
      {/* Ambient Glow */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -z-10 rounded-full"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        style={{
          width: 1000,
          height: 500,
          background:
            "radial-gradient(circle at center, rgba(59,130,246,0.25), rgba(37,99,235,0.05))",
          filter: "blur(130px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-dark border border-gray-700 p-8 rounded-2xl shadow-2xl max-w-md w-full bg-black/50 backdrop-blur-xl"
        aria-busy={isLoading}
      >
        <h2
          className="text-3xl font-bold text-white mb-2 text-center"
          style={{ fontFamily: "var(--font-spacemono)" }}
        >
          Create a New Room
        </h2>
        <p className="text-gray-400 mb-8 text-center font-mono">
          Choose player count and start bluffing!
        </p>

        <Select
          onValueChange={(value) => setPlayerCount(parseInt(value))}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full mb-6 bg-gray-800/70 text-white border-gray-600 focus:ring-2 focus:ring-blue-600 focus:border-blue-600">
            <SelectValue placeholder="Select player count" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 text-white border border-gray-700 rounded-md">
            <SelectItem
              value="4"
              className="cursor-pointer px-3 py-2 hover:bg-blue-600/30 data-[state=checked]:bg-blue-600/50 data-[state=checked]:text-white rounded-sm transition-colors"
            >
              4 Players
            </SelectItem>
            <SelectItem
              value="5"
              className="cursor-pointer px-3 py-2 hover:bg-blue-600/30 data-[state=checked]:bg-blue-600/50 data-[state=checked]:text-white rounded-sm transition-colors"
            >
              5 Players
            </SelectItem>
            <SelectItem
              value="6"
              className="cursor-pointer px-3 py-2 hover:bg-blue-600/30 data-[state=checked]:bg-blue-600/50 data-[state=checked]:text-white rounded-sm transition-colors"
            >
              6 Players
            </SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={handleCreate}
          disabled={isLoading || !isValid}
          className="group w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 font-bold py-3 rounded-xl text-lg transition-all shadow-xl hover:shadow-blue-900/40 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating...
            </>
          ) : (
            <>Create Room</>
          )}
        </Button>

        {lastError && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center justify-between rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
          >
            <span>{lastError}</span>
            <button
              onClick={handleCreate}
              disabled={isLoading}
              className="inline-flex items-center gap-1 text-red-200 hover:text-red-100 transition-colors disabled:opacity-50"
            >
              <RefreshCcw className="h-4 w-4" /> Retry
            </button>
          </motion.div>
        )}

        {/* Footer Links */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-gray-400">
          <Link
            href="/"
            className="inline-flex items-center gap-2 hover:text-gray-200 transition-colors"
            aria-label="Go back home (Alt+H)"
          >
            <Home className="h-4 w-4" />
            Back to Home <span className="opacity-60">(Alt+H)</span>
          </Link>

          <span className="hidden sm:inline text-gray-600">|</span>

          <Link
            href="/join-room"
            className="inline-flex items-center gap-2 hover:text-gray-200 transition-colors"
            aria-label="Join a room (Alt+J)"
          >
            <LogIn className="h-4 w-4" />
            Join Room <span className="opacity-60">(Alt+J)</span>
          </Link>
        </div>

        {/* Shortcut Tips */}
        <p className="mt-4 text-center text-xs text-gray-500">
          Press{" "}
          <kbd className="px-1 py-0.5 rounded bg-gray-800 border border-gray-700">
            Enter
          </kbd>{" "}
          or{" "}
          <kbd className="px-1 py-0.5 rounded bg-gray-800 border border-gray-700">
            ⌘ / Ctrl + Enter
          </kbd>{" "}
          to create.
        </p>
      </motion.div>
    </main>
  );
}
