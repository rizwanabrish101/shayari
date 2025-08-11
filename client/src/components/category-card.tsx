import { useLocation } from "wouter";
import { type Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const [, navigate] = useLocation();

  const handleClick = () => {
    navigate(`/search?category=${category.id}`);
  };

  return (
    <button 
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-right group card-hover relative overflow-hidden"
      onClick={handleClick}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Icon container */}
      <div className="relative z-10 mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
          <i className={`${category.icon} text-white text-xl`}></i>
        </div>
      </div>
      
      <div className="relative z-10">
        <p className="font-urdu font-bold text-lg mb-1 group-hover:text-primary transition-colors">
          {category.urduName}
        </p>
        <p className="text-sm text-gray-500 font-urdu">متعدد اشعار</p>
        
        {/* Decorative line */}
        <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-2 opacity-50 group-hover:opacity-100 transition-opacity"></div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full blur-sm"></div>
      <div className="absolute bottom-2 left-2 w-4 h-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-sm"></div>
    </button>
  );
}
