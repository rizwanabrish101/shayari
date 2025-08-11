import { useQuery } from "@tanstack/react-query";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShayariCard from "@/components/shayari-card";
import ImageCreator from "@/components/image-creator";
import { Link } from "wouter";
import { type ShayariWithPoet } from "@shared/schema";
import { useState } from "react";

export default function Favorites() {
  const [showImageCreator, setShowImageCreator] = useState(false);
  const [selectedShayari, setSelectedShayari] = useState<ShayariWithPoet | null>(null);

  const { data: favorites, isLoading } = useQuery<ShayariWithPoet[]>({
    queryKey: ["/api/favorites"],
  });

  const handleCreateImage = (shayari: ShayariWithPoet) => {
    setSelectedShayari(shayari);
    setShowImageCreator(true);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-16 bg-white border-b border-gray-200 p-4 z-10">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowRight className="h-4 w-4 mr-2" />
              واپس
            </Button>
          </Link>
          <h1 className="text-lg font-bold font-urdu">پسندیدہ اشعار</h1>
        </div>
      </div>

      {/* Favorites List */}
      <div className="p-4">
        {favorites?.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-urdu text-lg">کوئی پسندیدہ شعر نہیں</p>
            <p className="text-gray-500 font-urdu text-sm mt-2">
              اشعار کو پسندیدہ بنانے کے لیے دل کا نشان دبائیں
            </p>
            <Link href="/">
              <Button className="mt-4 font-urdu">اشعار دیکھیں</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 font-urdu text-right">
              {favorites?.length} پسندیدہ اشعار
            </p>
            {favorites?.map((shayari) => (
              <ShayariCard 
                key={shayari.id} 
                shayari={shayari} 
                showActions={true}
                onCreateImage={() => handleCreateImage(shayari)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Image Creator Modal */}
      <ImageCreator 
        isOpen={showImageCreator}
        onClose={() => {
          setShowImageCreator(false);
          setSelectedShayari(null);
        }}
        initialShayari={selectedShayari}
      />
    </div>
  );
}
