import { Home, Search, Plus, Heart, User } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import ImageCreator from "@/components/image-creator";

export default function BottomNavigation() {
  const [location, navigate] = useLocation();
  const [showImageCreator, setShowImageCreator] = useState(false);

  const isActive = (path: string) => location === path;

  const openImageCreator = () => {
    setShowImageCreator(true);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md glass backdrop-blur-xl bg-white/90 border-t border-white/20 z-40 shadow-2xl">
        <div className="flex justify-around py-3 px-2">
          <button 
            className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 ${
              isActive("/") 
                ? "text-white bg-primary shadow-lg scale-105" 
                : "text-gray-600 hover:text-primary hover:bg-primary/10"
            }`}
            onClick={() => navigate("/")}
          >
            <Home className="h-5 w-5 mb-1" />
            <span className="text-xs font-urdu font-medium">گھر</span>
          </button>
          
          <button 
            className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 ${
              isActive("/search") 
                ? "text-white bg-primary shadow-lg scale-105" 
                : "text-gray-600 hover:text-primary hover:bg-primary/10"
            }`}
            onClick={() => navigate("/search")}
          >
            <Search className="h-5 w-5 mb-1" />
            <span className="text-xs font-urdu font-medium">تلاش</span>
          </button>
          
          <button 
            className="flex flex-col items-center p-3 rounded-2xl transition-all duration-300 text-white bg-gradient-to-br from-secondary to-accent shadow-lg hover:scale-110 hover:shadow-xl"
            onClick={openImageCreator}
          >
            <Plus className="h-6 w-6 mb-1" />
            <span className="text-xs font-urdu font-bold">بنائیں</span>
          </button>
          
          <button 
            className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 ${
              isActive("/favorites") 
                ? "text-white bg-primary shadow-lg scale-105" 
                : "text-gray-600 hover:text-primary hover:bg-primary/10"
            }`}
            onClick={() => navigate("/favorites")}
          >
            <Heart className="h-5 w-5 mb-1" />
            <span className="text-xs font-urdu font-medium">پسندیدہ</span>
          </button>
          
          <button className="flex flex-col items-center p-3 rounded-2xl transition-all duration-300 text-gray-600 hover:text-primary hover:bg-primary/10">
            <User className="h-5 w-5 mb-1" />
            <span className="text-xs font-urdu font-medium">پروفائل</span>
          </button>
        </div>
        
        {/* Decorative bottom border */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-t-full"></div>
      </nav>

      <ImageCreator 
        isOpen={showImageCreator}
        onClose={() => setShowImageCreator(false)}
      />
    </>
  );
}
