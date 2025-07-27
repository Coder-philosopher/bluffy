"use client";

export default function Footer() {
  return (
    <footer className="w-full px-6 py-8 border-t border-gray-700 bg-gradient-to-t from-black via-gray-900 to-gray-800 text-gray-300 flex flex-col md:flex-row items-center justify-between gap-4 mt-auto text-sm tracking-wide rounded-t-3xl">
      <span style={{ fontFamily: "var(--font-poppins)" }}>
        © 2025 Bluffy Game. All rights reserved.
      </span>
      <nav className="flex gap-6">
        <a href="/privacy" className="hover:underline hover:text-blue-400">Privacy</a>
        <a href="https://github.com/your-repo" target="_blank" rel="noopener" className="hover:underline hover:text-blue-400">GitHub</a>
        <a href="mailto:contact@bluffy.io" className="hover:underline hover:text-blue-400">Contact</a>
      </nav>
    </footer>
  );
}
