"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Activity, FileText, Bell, Settings, Zap } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const TABS = [
  { id: "home", label: "Home", href: "/", icon: Home },
  { id: "eeg", label: "EEG", href: "/eeg", icon: Activity },
  { id: "risk-calc", label: "Risk ML", href: "/risk-calculator", icon: Zap },
  { id: "reports", label: "Reports", href: "/reports", icon: FileText },
  { id: "alerts", label: "Alerts", href: "/alerts", icon: Bell },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings },
];


export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-zinc-200 shadow-[0_-4px_24px_rgba(0,0,0,0.05)] safe-area-pb">
      <div className="flex items-center justify-around w-full max-w-5xl mx-auto px-2 py-3">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-1 min-w-[64px] px-2 py-1 rounded-xl transition-all active:scale-95",
                isActive ? "text-blue-600" : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-full transition-colors",
                  isActive ? "bg-blue-100" : "bg-transparent"
                )}
              >
                <Icon strokeWidth={isActive ? 2.5 : 2} size={20} />
              </div>
              <span className="text-[10px] font-medium tracking-tight">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
