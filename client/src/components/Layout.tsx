import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProgressTracking from "@/components/ProgressTracking";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <Header />

      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Fixed Progress Tracking */}
      <ProgressTracking />

      {/* Main Content */}
      <main 
        className={cn(
          "pt-16 transition-all duration-300",
          isSidebarCollapsed ? "ml-16" : "ml-64",
          "mr-80" // Fixed margin for progress tracking
        )}
      >
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
} 