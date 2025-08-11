import { useLocation } from "wouter";
import { type Poet } from "@shared/schema";

interface PoetCardProps {
  poet: Poet;
}

export default function PoetCard({ poet }: PoetCardProps) {
  const [, navigate] = useLocation();

  const handleClick = () => {
    navigate(`/poet/${poet.id}`);
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover cursor-pointer relative group"
      onClick={handleClick}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {poet.imageUrl && (
        <div className="relative overflow-hidden">
          <img 
            src={poet.imageUrl} 
            alt={poet.urduName}
            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
        </div>
      )}
      
      <div className="p-4 relative z-20">
        <div className="flex items-center justify-between mb-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-xs text-primary font-medium px-2 py-1 bg-primary/10 rounded-full">
            شاعر
          </span>
        </div>
        
        <h3 className="font-urdu font-bold text-lg text-right mb-1 text-foreground group-hover:text-primary transition-colors">
          {poet.urduName}
        </h3>
        <p className="text-sm text-muted-foreground text-right font-urdu mb-2">{poet.urduTitle}</p>
        <p className="text-xs text-muted-foreground text-right flex items-center justify-end">
          <span className="mr-1">📅</span>
          {poet.birthYear} - {poet.deathYear}
        </p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-2 left-2 w-6 h-6 bg-gradient-to-br from-secondary/30 to-accent/30 rounded-full blur-sm"></div>
      <div className="absolute bottom-2 right-2 w-4 h-4 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-sm"></div>
    </div>
  );
}
