"use client";
import { Sun, Moon } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";
import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Magnetic>
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="p-3 rounded-full border border-current/20 hover:bg-current/5 transition-colors"
        aria-label={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    </Magnetic>
  );
}
