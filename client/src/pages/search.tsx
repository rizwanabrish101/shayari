import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ShayariCard from "@/components/shayari-card";
import ImageCreator from "@/components/image-creator";
import { Link } from "wouter";
import { type ShayariWithPoet } from "@shared/schema";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showImageCreator, setShowImageCreator] = useState(false);
  const [selectedShayari, setSelectedShayari] = useState<ShayariWithPoet | null>(null);

  const { data: searchResults, isLoading } = useQuery<ShayariWithPoet[]>({
    queryKey: ["/api/shayaris", { search: searchQuery }],
    enabled: searchQuery.length > 0,
  });

  const handleCreateImage = (shayari: ShayariWithPoet) => {
    setSelectedShayari(shayari);
    setShowImageCreator(true);
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-16 bg-white border-b border-gray-200 p-4 z-10">
        <div className="flex items-center justify-between mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowRight className="h-4 w-4 mr-2" />
              واپس
            </Button>
          </Link>
          <h1 className="text-lg font-bold font-urdu">تلاش</h1>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Input
            type="search"
            placeholder="شاعر یا شعر تلاش کریں..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 font-urdu text-right"
            dir="rtl"
          />
          <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>
      </div>

      {/* Search Results */}
      <div className="p-4">
        {searchQuery.length === 0 ? (
          <div className="text-center py-12">
            <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-urdu text-lg">شاعر یا شعر تلاش کریں</p>
            <p className="text-gray-500 font-urdu text-sm mt-2">
              آپ شاعر کے نام یا شعر کے الفاظ سے تلاش کر سکتے ہیں
            </p>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : searchResults?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 font-urdu text-lg">کوئی نتیجہ نہیں ملا</p>
            <p className="text-gray-500 font-urdu text-sm mt-2">
              مختلف الفاظ استعمال کر کے دوبارہ کوشش کریں
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 font-urdu text-right">
              {searchResults?.length} نتائج ملے "{searchQuery}" کے لیے
            </p>
            {searchResults?.map((shayari) => (
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
