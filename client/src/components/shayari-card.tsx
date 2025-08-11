import { useState } from "react";
import { Heart, Share, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type ShayariWithPoet } from "@shared/schema";
import { useFavorites } from "@/hooks/use-favorites";

interface ShayariCardProps {
  shayari: ShayariWithPoet;
  showActions?: boolean;
  onCreateImage?: () => void;
}

export default function ShayariCard({ shayari, showActions = false, onCreateImage }: ShayariCardProps) {
  const { toast } = useToast();
  const { addFavorite, removeFavorite, isFavorite, isLoading: favLoading } = useFavorites();
  const isFav = isFavorite(shayari.id);

  const handleFavoriteClick = async () => {
    try {
      if (isFav) {
        await removeFavorite(shayari.id);
        toast({
          title: "پسندیدہ سے ہٹا دیا گیا",
          description: "شعر پسندیدہ فہرست سے ہٹا دیا گیا ہے",
        });
      } else {
        await addFavorite(shayari.id);
        toast({
          title: "پسندیدہ میں شامل",
          description: "شعر پسندیدہ فہرست میں شامل کر دیا گیا",
        });
      }
    } catch (error) {
      toast({
        title: "خرابی",
        description: "کچھ غلط ہو گیا ہے، دوبارہ کوشش کریں",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const text = `${shayari.text}\n\n- ${shayari.poet.urduName}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "اردو شعر",
          text: text,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(text);
        toast({
          title: "کاپی ہو گیا",
          description: "شعر کلپ بورڈ میں کاپی کر دیا گیا",
        });
      } catch (error) {
        toast({
          title: "خرابی",
          description: "کاپی نہیں ہو سکا",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="bg-primary-gradient rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group card-hover">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full blur-xl translate-y-8 -translate-x-8"></div>
      
      {/* Quote decoration */}
      <div className="absolute top-4 left-4 text-6xl font-serif opacity-20 rotate-180">"</div>
      <div className="absolute bottom-4 right-4 text-6xl font-serif opacity-20">"</div>
      
      <div className="text-right relative z-10">
        <p className="font-urdu text-lg leading-relaxed mb-6 urdu-text drop-shadow-sm">
          {shayari.text.split('\n').map((line, index) => (
            <span key={index} className="block mb-2 hover:scale-105 transition-transform duration-300">
              {line}
            </span>
          ))}
        </p>
        
        <div className="flex items-center justify-end mb-4">
          <div className="h-px bg-white/30 flex-1 mr-4"></div>
          <p className="font-urdu text-base opacity-90 text-right bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            {shayari.poet.urduName}
          </p>
        </div>
      </div>
      
      {showActions && (
        <div className="flex justify-between items-center mt-6 relative z-10">
          <div className="flex space-x-3 space-x-reverse">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-3 hover:bg-white/20 text-white rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              onClick={handleShare}
            >
              <Share className="h-4 w-4" />
            </Button>
            {onCreateImage && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-3 hover:bg-white/20 text-white rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                onClick={onCreateImage}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className={`p-3 hover:bg-white/20 transition-all duration-300 hover:scale-110 rounded-full backdrop-blur-sm ${
                isFav ? "text-red-300 bg-white/20" : "text-white"
              }`}
              onClick={handleFavoriteClick}
              disabled={favLoading}
            >
              <Heart className={`h-4 w-4 ${isFav ? "fill-current animate-pulse" : ""}`} />
            </Button>
          </div>
          <span className="text-xs opacity-75 font-urdu bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            {shayari.category.urduName}
          </span>
        </div>
      )}
    </div>
  );
}
