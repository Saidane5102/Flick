import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { CardCategory, Design } from "@shared/schema";
import { Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("recent");
  const { user } = useAuth();

  const { data: designs, isLoading } = useQuery<Design[]>({
    queryKey: ["/api/designs"],
    queryFn: async () => {
      const res = await fetch("/api/designs");
      if (!res.ok) throw new Error("Failed to fetch designs");
      return res.json();
    },
  });

  const likeDesign = async (designId: number) => {
    if (!user) return;
    
    try {
      await fetch(`/api/designs/${designId}/like`, {
        method: "POST",
        credentials: "include",
      });
      
      // Refetch designs to update likes
      await queryClient.invalidateQueries({ queryKey: ["/api/designs"] });
    } catch (error) {
      console.error("Error liking design:", error);
    }
  };

  // Filter designs by type
  const filteredDesigns = designs
    ? designs.filter((design) => {
        if (activeFilter === "All") return true;
        
        // Check if brief contains the filter
        return design.brief.toLowerCase().includes(activeFilter.toLowerCase());
      })
    : [];

  // Sort designs
  const sortedDesigns = [...(filteredDesigns || [])].sort((a, b) => {
    if (sortOrder === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === "mostLiked") {
      return b.likes - a.likes;
    }
    return 0;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section id="gallery" className="mb-16 pt-8">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-3">Community Gallery</h2>
        <p className="text-center max-w-2xl mb-8">
          See designs created by other community members based on their briefs. Upload your own work to get feedback!
        </p>

        {/* Gallery filters */}
        <div className="w-full max-w-4xl mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={activeFilter === "All" ? "default" : "outline"}
              onClick={() => setActiveFilter("All")}
              className="py-1 px-3 rounded-full text-sm"
            >
              All
            </Button>
            <Button
              variant={activeFilter === "Logo" ? "default" : "outline"}
              onClick={() => setActiveFilter("Logo")}
              className="py-1 px-3 rounded-full text-sm"
            >
              Logo Design
            </Button>
            <Button
              variant={activeFilter === "Poster" ? "default" : "outline"}
              onClick={() => setActiveFilter("Poster")}
              className="py-1 px-3 rounded-full text-sm"
            >
              Poster
            </Button>
            <Button
              variant={activeFilter === "Website" ? "default" : "outline"}
              onClick={() => setActiveFilter("Website")}
              className="py-1 px-3 rounded-full text-sm"
            >
              Web
            </Button>
          </div>

          <div>
            <select
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="recent">Recent submissions</option>
              <option value="mostLiked">Most liked</option>
            </select>
          </div>
        </div>

        {/* Gallery grid */}
        {sortedDesigns.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No designs found. Be the first to upload one!
          </div>
        ) : (
          <div className="gallery-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {sortedDesigns.map((design) => (
              <div key={design.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="relative">
                  <img
                    src={design.imageUrl}
                    alt={design.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-md">
                    <button
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => likeDesign(design.id)}
                    >
                      <Heart className="h-5 w-5" fill={user ? "#ef4444" : "none"} />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{design.title}</h4>
                      <p className="text-sm text-gray-600">by @username</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{design.likes}</span>
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  <div className="mt-3 bg-gray-50 rounded-lg p-3 text-sm">
                    <p>{design.brief}</p>
                  </div>

                  <div className="mt-3 flex justify-between">
                    <span className="text-xs text-gray-500">
                      <MessageCircle className="h-3 w-3 inline mr-1" />
                      0 comments
                    </span>
                    <Button variant="link" size="sm" className="text-xs text-primary p-0">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload button */}
        <Button
          className="mt-10 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-md"
        >
          <Upload className="h-5 w-5 mr-2" />
          Upload Your Design
        </Button>
      </div>
    </section>
  );
}

import { queryClient } from "@/lib/queryClient";
import { Upload } from "lucide-react";
