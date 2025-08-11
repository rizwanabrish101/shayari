import { ReactNode } from "react";
import Header from "./header";
import BottomNavigation from "./bottom-navigation";

interface MobileLayoutProps {
  children: ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen relative overflow-hidden">
      <Header />
      <div className="pt-12 relative">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>
        <div className="absolute top-20 -right-20 w-40 h-40 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-40 -left-20 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-2xl pointer-events-none"></div>
        {children}
      </div>
      <BottomNavigation />
    </div>
  );
}
