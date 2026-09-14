import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PairingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 w-full max-w-md mx-auto bg-white min-h-screen shadow-lg border-x border-zinc-100 flex flex-col relative">
      <header className="p-4 flex items-center border-b border-zinc-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-zinc-100 transition-colors">
          <ChevronLeft size={24} className="text-zinc-900" />
        </Link>
        <span className="font-bold ml-2">Device Setup</span>
      </header>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
