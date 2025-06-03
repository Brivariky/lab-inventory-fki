import Link from "next/link";
import { ReactNode } from "react";
import { 
  LayoutDashboard, 
  Monitor, 
  CircuitBoard, 
  Code2, 
  Network, 
  Database,
  Bot
} from "lucide-react";
import "./globals.css";

export const metadata = {
  title: "Lab Inventory",
  description: "Inventory Management System for Labs",
};

const LABS = [
  { name: "LAB FKI", icon: Monitor },
  { name: "LAB LABORAN", icon: Database },
  { name: "LAB SI", icon: CircuitBoard },
  { name: "LAB RPL", icon: Code2 },
  { name: "LAB JARKOM", icon: Network },
  { name: "LAB SIC", icon: Bot },
];

function Sidebar() {
  return (
    <aside className="w-64 bg-[#2F3185] text-white p-4 min-h-screen flex flex-col shadow-sm border-r-8 border-[#F5C23E] transition-all duration-300 hover:w-72">
      <div className="text-xl font-semibold mb-8 p-2 text-center bg-[#2F3185] rounded-lg border border-white/20">
        <span className="text-white">📦</span>
        <span className="ml-2 tracking-wide">Inventaris Lab Teknik Informatika</span>
      </div>

      <nav className="flex flex-col gap-2 text-sm">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
            hover:bg-blue-50 hover:text-blue-600 hover:translate-x-1
            active:bg-blue-100"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="font-medium">Dashboard</span>
        </Link>

        <div className="h-px bg-gray-100 my-2"></div>

        {LABS.map((lab, index) => {
          const Icon = lab.icon;
          return (
            <Link
              key={index}
              href={`/lab${index + 1}`}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                group hover:bg-white/10 hover:text-white hover:translate-x-1
                active:bg-white/20"
            >
              <Icon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="font-medium">{lab.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto text-xs text-gray-400 pt-8 text-center">
        {/* <span className="hover:text-blue-500 transition-colors cursor-default">
          ⚡ INACOS Labs v1.0
        </span> */}
      </div>
    </aside>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-[#F8F7F3] font-sans antialiased">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto bg-[#F8F7F3]">{children}</main>
      </body>
    </html>
  );
}
