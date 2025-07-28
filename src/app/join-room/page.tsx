'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Home, PlusCircle, RefreshCcw } from "lucide-react";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { motion } from "framer-motion";
import Loading from "@/components/Loading"; // Import the new Loading component

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "https://bluffy-game-backend.tentaciouspersona-01c.workers.dev";

// tweak this to your actual format; here we accept 3–8 alphanumerics
const CODE_REGEX = /^[A-Z0-9]{3,8}$/;

type JoinRoomResponse = {
  playerName: string;
  roomCode: string;
};

export default function JoinRoom() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const normalizedCode = useMemo(
    () => roomCode.trim().toUpperCase(),
    [roomCode]
  );

  const isValid = useMemo(
    () => CODE_REGEX.test(normalizedCode),
    [normalizedCode]
  );

  const handleJoin = useCallback(async () => {
    if (!isValid) {
      toast.error("Please enter a valid room code");
      return;
    }

    setIsLoading(true);
    setLastError(null);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const timeout = setTimeout(() => controller.abort(), 15_000); // 15s

    try {
      const response = await axios.post<JoinRoomResponse>(
        `${BACKEND_URL}/api/room/join/${roomCode}`,
        {},
        { signal: controller.signal }
      );

      // Only redirect on success (200 OK)
      if (response.status === 200) {
        const { playerName } = response.data;
        console.log("join room", playerName);

        try {
          sessionStorage.setItem("playerName", playerName); // Save player name
          sessionStorage.setItem("roomCode", roomCode); // Save player name
        } catch {
          /* ignore */
        }

        toast.success(`Joined room ${roomCode} as ${playerName}!`);
        // Delay 3 seconds before navigating
        setTimeout(() => {
          router.push(`/game/${roomCode}`);
        }, 1000);
      } else {
        // Handle unexpected non-200 status
        throw new Error("Server did not return OK");
      }
    } catch (err) {
      const axErr = err as AxiosError<any>;
      
      // Handle specific 400 error (Room Invalid or Full)
      if (axErr.response?.status === 400) {
        toast.error("Invalid Room Code or Room Filled");
        setLastError("Invalid Room Code or Room Filled");
      } else if (controller.signal.aborted) {
        toast.error("Request timed out. Please try again.");
        setLastError("Request timed out.");
      } else if (axErr.response?.data?.message) {
        toast.error(axErr.response.data.message);
        setLastError(axErr.response.data.message);
      } else {
        toast.error("Failed to join room. It may be full or invalid.");
        setLastError("Unknown error");
      }
      console.error(err);
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
    }
  }, [isValid, roomCode, router]);

  // Shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Join
      if (
        (e.key === "Enter" && (e.metaKey || e.ctrlKey)) ||
        (e.key === "Enter" && !e.shiftKey)
      ) {
        if (!isLoading) handleJoin();
      }

      // Home
      if (e.altKey && (e.key === "h" || e.key === "H")) {
        router.push("/");
      }

      // Create
      if (e.altKey && (e.key === "c" || e.key === "C")) {
        router.push("/create-room");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleJoin, isLoading, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-black p-4 relative overflow-hidden">
      {/* Ambient glow */}
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

      {isLoading ? (
        <Loading /> // Use Loading component during isLoading
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass-dark relative border border-gray-700 p-8 rounded-2xl shadow-2xl max-w-md w-full bg-black/50 backdrop-blur-xl"
          aria-busy={isLoading}
          aria-live="polite"
        >
          <h2
            className="text-3xl font-bold text-white mb-2 text-center"
            style={{ fontFamily: "var(--font-spacemono)" }}
          >
            Join a Room
          </h2>
          <p className="text-gray-400 mb-8 text-center font-mono">
            Enter your room code and jump right in.
          </p>

          <label htmlFor="roomCode" className="sr-only">
            Room code
          </label>
          <Input
            id="roomCode"
            type="text"
            autoComplete="off"
            inputMode="text"
            placeholder="Enter room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            onPaste={(e) => {
              const pasted = e.clipboardData.getData("text").toUpperCase().trim();
              if (pasted) {
                e.preventDefault();
                setRoomCode(pasted);
              }
            }}
            disabled={isLoading}
            className="w-full mb-6 bg-gray-800/70 text-white border-gray-600 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />

          <Button
            onClick={handleJoin}
            disabled={isLoading || !isValid}
            className="group w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 font-bold py-3 rounded-xl text-lg transition-all shadow-xl hover:shadow-blue-900/40 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Joining...
              </>
            ) : (
              <>Join Room</>
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
                onClick={handleJoin}
                disabled={isLoading}
                className="inline-flex items-center gap-1 text-red-200 hover:text-red-100 transition-colors disabled:opacity-50"
              >
                <RefreshCcw className="h-4 w-4" /> Retry
              </button>
            </motion.div>
          )}

          {/* Footer actions */}
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
              href="/create-room"
              className="inline-flex items-center gap-2 hover:text-gray-200 transition-colors"
              aria-label="Create a new room (Alt+C)"
            >
              <PlusCircle className="h-4 w-4" />
              Create Room <span className="opacity-60">(Alt+C)</span>
            </Link>
          </div>

          {/* Tiny helper */}
          <p className="mt-4 text-center text-xs text-gray-500">
            Press{" "}
            <kbd className="px-1 py-0.5 rounded bg-gray-800 border border-gray-700">
              Enter
            </kbd>{" "}
            or{" "}
            <kbd className="px-1 py-0.5 rounded bg-gray-800 border border-gray-700">
              ⌘ / Ctrl + Enter
            </kbd>{" "}
            to join.
          </p>
        </motion.div>
      )}
    </main>
  );
}
