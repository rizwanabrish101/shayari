import { useState } from "react";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Header() {
  const [location, navigate] = useLocation();

  const openSearch = () => {
    navigate("/search");
  };

  return (
    <header className="bg-primary-gradient text-white p-4 sticky top-0 z-50 glass backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold font-urdu drop-shadow-sm">اردو شاعری</h1>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 hover:bg-white/20 text-white rounded-full transition-all duration-300 hover:scale-110"
            onClick={openSearch}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 hover:bg-white/20 text-white rounded-full transition-all duration-300 hover:scale-110"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
