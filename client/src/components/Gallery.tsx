import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { CardCategory, Design } from "@shared/schema";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  author: string;
  likes: number;
  comments: number;
  category: string;
}

const sampleItems: GalleryItem[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60",
    title: "Minimalist Brand Identity",
    author: "Sarah Johnson",
    likes: 245,
    comments: 32,
    category: "Branding"
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60",
    title: "Mobile App UI Design",
    author: "Mike Chen",
    likes: 189,
    comments: 24,
    category: "UI/UX"
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60",
    title: "Packaging Design Series",
    author: "Emma Wilson",
    likes: 312,
    comments: 45,
    category: "Packaging"
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60",
    title: "Typography Exploration",
    author: "David Kim",
    likes: 156,
    comments: 18,
    category: "Typography"
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60",
    title: "Web Design System",
    author: "Lisa Park",
    likes: 278,
    comments: 36,
    category: "Web Design"
  },
  {
    id: "6",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60",
    title: "Illustration Series",
    author: "Tom Lee",
    likes: 421,
    comments: 52,
    category: "Illustration"
  }
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = ["all", ...new Set(sampleItems.map(item => item.category))];

  const filteredItems = activeCategory === "all" 
    ? sampleItems 
    : sampleItems.filter(item => item.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            className="capitalize"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {filteredItems.map(item => (
          <div key={item.id} className="break-inside-avoid">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="relative aspect-[4/3]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex justify-between items-center">
                      <Button variant="ghost" size="sm" className="text-white hover:text-white">
                        <Heart className="h-4 w-4 mr-1" />
                        {item.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white hover:text-white">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {item.comments}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white hover:text-white">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-[#212121] mb-1">{item.title}</h3>
                <p className="text-sm text-[#414141]">by {item.author}</p>
                <span className="inline-block mt-2 px-2 py-1 text-xs bg-[#FAF9F7] text-[#414141] rounded-full">
                  {item.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
