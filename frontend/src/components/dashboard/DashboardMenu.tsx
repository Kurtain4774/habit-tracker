"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { LogOut, Settings, ChevronDown, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/api";
import { cn } from "@/lib/utils"; // Standard Tailwind merger utility

interface User {
  id: string;
  email: string;
  name: string;
}

interface DashboardMenuProps {
  user?: User | null;
}

export default function DashboardMenu({ user }: DashboardMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 1. Centralized Close Logic
  const closeMenu = useCallback(() => setIsOpen(false), []);

  // 2. Enhanced Event Listeners (Outside Click & Escape Key)
  useEffect(() => {
    const handleEvents = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") {
        closeMenu();
      }
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("pointerdown", handleEvents);
      document.addEventListener("keydown", handleEvents);
    }

    return () => {
      document.removeEventListener("pointerdown", handleEvents);
      document.removeEventListener("keydown", handleEvents);
    };
  }, [isOpen, closeMenu]);

  const handleLogout = () => {
    closeMenu();
    clearToken();
    router.replace("/login");
  };

  const navigateToSettings = () => {
    closeMenu();
    router.push("/settings");
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={cn(
          "flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full transition-all duration-200",
          "hover:bg-slate-100 active:scale-95 border border-transparent",
          isOpen ? "bg-slate-100 border-slate-200" : "bg-transparent"
        )}
      >
        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
          <UserIcon size={16} />
        </div>
        <span className="text-sm font-semibold text-slate-700 hidden sm:block">
          {user?.name?.split(" ")[0] || "Account"}
        </span>
        <ChevronDown 
          size={14} 
          className={cn("text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          role="menu"
          aria-orientation="vertical"
          className={cn(
            "absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl z-50",
            "animate-in fade-in zoom-in-95 duration-100 origin-top-right p-1.5"
          )}
        >
          {/* User Info Header (Optional but Pro) */}
          <div className="px-3 py-2 mb-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account</p>
            <p className="text-sm font-medium text-slate-600 truncate">{user?.email}</p>
          </div>

          <div className="h-px bg-slate-100 my-1 mx-1" />

          <button
            role="menuitem"
            onClick={navigateToSettings}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-100 hover:text-indigo-600 transition-colors"
          >
            <Settings size={18} className="text-slate-400" />
            Settings
          </button>

          <button
            role="menuitem"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} className="opacity-70" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}