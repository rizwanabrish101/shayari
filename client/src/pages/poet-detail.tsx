import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowRight } from "lucide-react";
import ShayariCard from "@/components/shayari-card";
import { Button } from "@/components/ui/button";
import { type Poet, type ShayariWithPoet } from "@shared/schema";
import { useState } from "react";
import ImageCreator from "@/components/image-creator";

export default function PoetDetail() {
  const { id } = useParams();
  const [showImageCreator, setShowImageCreator] = useState(false);
  const [selectedShayari, setSelectedShayari] = useState<ShayariWithPoet | null>(null);

  const { data: poet, isLoading: poetLoading } = useQuery<Poet>({
    queryKey: ["/api/poets", id],
  });

  const { data: shayaris, isLoading: shayarisLoading } = useQuery<ShayariWithPoet[]>({
    queryKey: ["/api/shayaris", { poet: id }],
  });

  const handleCreateImage = (shayari: ShayariWithPoet) => {
    setSelectedShayari(shayari);
    setShowImageCreator(true);
  };

  if (poetLoading || shayarisLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!poet) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-xl font-bold font-urdu text-gray-600">شاعر نہیں ملا</h1>
        <Link href="/">
          <Button className="mt-4">واپس جائیں</Button>
        </Link>
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
        </div>
      </div>

      {/* Poet Info */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          {poet.imageUrl && (
            <img 
              src={poet.imageUrl} 
              alt={poet.urduName}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h1 className="text-2xl font-bold font-urdu text-right mb-2">{poet.urduName}</h1>
            <p className="text-lg text-gray-600 font-urdu text-right mb-2">{poet.urduTitle}</p>
            <p className="text-sm text-gray-500 text-right mb-4">
              {poet.birthYear} - {poet.deathYear}
            </p>
            <p className="text-sm text-gray-700 font-urdu text-right leading-relaxed">
              {poet.urduBiography}
            </p>
          </div>
        </div>

        {/* Shayaris */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-urdu text-right">اشعار</h2>
          {shayaris?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 font-urdu">اس شاعر کے اشعار ابھی دستیاب نہیں ہیں</p>
            </div>
          ) : (
            shayaris?.map((shayari) => (
              <ShayariCard 
                key={shayari.id} 
                shayari={shayari} 
                showActions={true}
                onCreateImage={() => handleCreateImage(shayari)}
              />
            ))
          )}
        </div>
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
