import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import PoetCard from "@/components/poet-card";
import ShayariCard from "@/components/shayari-card";
import CategoryCard from "@/components/category-card";
import ImageCreator from "@/components/image-creator";
import { type Poet, type Category, type ShayariWithPoet } from "@shared/schema";

export default function Home() {
  const [showImageCreator, setShowImageCreator] = useState(false);

  const { data: poets, isLoading: poetsLoading } = useQuery<Poet[]>({
    queryKey: ["/api/poets"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: featuredShayari, isLoading: featuredLoading } = useQuery<ShayariWithPoet>({
    queryKey: ["/api/shayaris/featured"],
  });

  if (poetsLoading || categoriesLoading || featuredLoading) {
    return (
      <div className="p-4">
        <div className="space-y-6">
          {/* Featured loading */}
          <div className="shimmer h-48 rounded-2xl"></div>
          
          {/* Poets loading */}
          <div className="space-y-4">
            <div className="shimmer h-6 rounded-lg w-32"></div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="shimmer h-56 rounded-2xl"></div>
              ))}
            </div>
          </div>
          
          {/* Categories loading */}
          <div className="space-y-4">
            <div className="shimmer h-6 rounded-lg w-24"></div>
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="shimmer h-32 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-4 px-6 pb-24 relative z-10">
      {/* Welcome Section */}
      <section className="mb-6 text-center">
        <h2 className="text-xl font-bold font-urdu text-primary mb-1">خوش آمدید</h2>
        <p className="text-sm text-muted-foreground font-urdu">اردو شاعری کی خوبصورت دنیا میں</p>
      </section>

      {/* Featured Shayari */}
      {featuredShayari && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="h-px bg-gradient-to-l from-primary to-transparent flex-1 ml-4"></div>
            <h2 className="text-xl font-bold font-urdu text-primary">آج کا شعر</h2>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>
          
          <div className="animate-float">
            <ShayariCard 
              shayari={featuredShayari} 
              showActions={true}
              onCreateImage={() => setShowImageCreator(true)}
            />
          </div>
        </section>
      )}

      {/* Poets Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="h-px bg-gradient-to-l from-secondary to-transparent flex-1 ml-4"></div>
          <h2 className="text-xl font-bold font-urdu text-secondary">مشہور شعراء</h2>
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          {poets?.map((poet, index) => (
            <div
              key={poet.id}
              className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <PoetCard poet={poet} />
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="h-px bg-gradient-to-l from-accent to-transparent flex-1 ml-4"></div>
          <h2 className="text-xl font-bold font-urdu text-accent">اصناف</h2>
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {categories?.map((category, index) => (
            <div
              key={category.id}
              className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
              style={{ animationDelay: `${(index + 6) * 0.1}s` }}
            >
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary font-urdu">{poets?.length || 0}</div>
              <div className="text-sm text-muted-foreground font-urdu">شعراء</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary font-urdu">{categories?.length || 0}</div>
              <div className="text-sm text-muted-foreground font-urdu">اصناف</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent font-urdu">100+</div>
              <div className="text-sm text-muted-foreground font-urdu">اشعار</div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Creator Modal */}
      <ImageCreator 
        isOpen={showImageCreator}
        onClose={() => setShowImageCreator(false)}
        initialShayari={featuredShayari}
      />
    </main>
  );
}
