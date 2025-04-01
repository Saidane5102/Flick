import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User, Design } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  PenLine, 
  User as UserIcon, 
  Heart, 
  MessageCircle, 
  Calendar, 
  Folder, 
  Clock,
  ChevronRight,
  Image as ImageIcon,
  Star,
  TrendingUp 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SavedBrief {
  text: string;
  cardIds: number[];
  timestamp: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  const [savedBriefs, setSavedBriefs] = useState<SavedBrief[]>([]);
  
  // Fetch user's designs
  const { data: userDesigns, isLoading: designsLoading } = useQuery<Design[]>({
    queryKey: user ? ['/api/users', user.id, 'designs'] : [],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      const res = await fetch(`/api/users/${user.id}/designs`);
      if (!res.ok) throw new Error("Failed to fetch user designs");
      return res.json();
    },
    enabled: !!user,
  });
  
  // Fetch user stats
  interface UserStats {
    completedChallenges: number;
    earnedBadges: number;
    totalLikes: number;
    points: number;
    level: number;
    progressToNextLevel: number;
    nextLevelPoints: number;
  }
  
  const { data: stats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: user ? ['/api/users', user.id, 'stats'] : [],
    queryFn: async () => {
      if (!user) throw new Error("User not found");
      const res = await fetch(`/api/users/${user.id}/stats`);
      if (!res.ok) throw new Error("Failed to fetch user stats");
      return res.json();
    },
    enabled: !!user,
  });
  
  // Load saved briefs from localStorage
  useEffect(() => {
    const loadSavedBriefs = () => {
      try {
        const briefs = localStorage.getItem('savedBriefs');
        if (briefs) {
          setSavedBriefs(JSON.parse(briefs));
        }
      } catch (error) {
        console.error("Error loading saved briefs:", error);
      }
    };
    
    loadSavedBriefs();
  }, []);
  
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center p-8">
        <UserIcon className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Sign in to view your profile</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          You need to be signed in to see your saved briefs and design submissions.
        </p>
        <Button onClick={() => navigate("/auth")}>Sign In</Button>
      </div>
    );
  }
  
  const isLoading = designsLoading || statsLoading;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#212121]"></div>
      </div>
    );
  }
  
  return (
    <main className="container max-w-6xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile sidebar */}
        <div className="w-full md:w-1/3">
          <div className="bg-[#FAF9F7] border border-[#E9E6DD] rounded-[16px] p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-[#212121] rounded-full flex items-center justify-center text-white mr-4">
                <span className="text-xl font-bold">{user.username.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user.username}</h2>
                <p className="text-[#414141] text-sm">Level {stats?.level || 1} Designer</p>
              </div>
            </div>
            
            {/* Experience bar */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-[#414141] font-medium">Level {stats?.level || 1}</span>
                <span className="text-sm text-[#414141]">{stats?.progressToNextLevel || 0}%</span>
              </div>
              <Progress value={stats?.progressToNextLevel || 0} className="h-2 bg-[#E9E6DD]" indicatorClassName="bg-[#212121]" />
              <p className="text-xs text-[#414141] mt-2">
                {stats?.nextLevelPoints || 25} XP needed for next level
              </p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-[8px] border border-[#E9E6DD]">
                <div className="flex items-center mb-2">
                  <Star className="h-4 w-4 text-[#212121] mr-2" />
                  <span className="text-sm font-medium">XP Points</span>
                </div>
                <p className="text-lg font-bold">{stats?.points || 0}</p>
              </div>
              <div className="bg-white p-4 rounded-[8px] border border-[#E9E6DD]">
                <div className="flex items-center mb-2">
                  <ImageIcon className="h-4 w-4 text-[#212121] mr-2" />
                  <span className="text-sm font-medium">Designs</span>
                </div>
                <p className="text-lg font-bold">{userDesigns?.length || 0}</p>
              </div>
              <div className="bg-white p-4 rounded-[8px] border border-[#E9E6DD]">
                <div className="flex items-center mb-2">
                  <Heart className="h-4 w-4 text-[#212121] mr-2" />
                  <span className="text-sm font-medium">Likes</span>
                </div>
                <p className="text-lg font-bold">{stats?.totalLikes || 0}</p>
              </div>
              <div className="bg-white p-4 rounded-[8px] border border-[#E9E6DD]">
                <div className="flex items-center mb-2">
                  <PenLine className="h-4 w-4 text-[#212121] mr-2" />
                  <span className="text-sm font-medium">Briefs</span>
                </div>
                <p className="text-lg font-bold">{savedBriefs.length}</p>
              </div>
            </div>
            
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-[#212121] hover:bg-black text-white"
            >
              New Design Challenge
            </Button>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="designs" className="w-full">
            <TabsList className="mb-6 bg-[#E9E6DD] p-1 rounded-lg">
              <TabsTrigger 
                value="designs" 
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-[#212121] text-[#414141]"
              >
                My Designs
              </TabsTrigger>
              <TabsTrigger 
                value="briefs" 
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-[#212121] text-[#414141]"
              >
                Saved Briefs
              </TabsTrigger>
            </TabsList>
            
            {/* Designs tab */}
            <TabsContent value="designs">
              <h2 className="text-xl font-semibold mb-4">My Design Submissions</h2>
              
              {userDesigns && userDesigns.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userDesigns.map((design) => (
                    <div key={design.id} className="bg-white border border-[#E9E6DD] rounded-[16px] overflow-hidden shadow-sm">
                      <div className="relative aspect-video">
                        <img
                          src={design.imageUrl}
                          alt={design.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm flex items-center">
                          <Heart className="h-4 w-4 text-[#212121] mr-1" />
                          <span className="text-sm font-medium">{design.likes}</span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{design.title}</h3>
                        <div className="flex items-center text-[#414141] text-sm mb-3">
                          <Calendar className="h-3.5 w-3.5 mr-1.5" />
                          <span>{new Date(design.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        
                        <div className="flex justify-between mt-2">
                          <div className="text-xs text-[#414141]">
                            <MessageCircle className="h-3.5 w-3.5 inline mr-1" />
                            0 comments
                          </div>
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-xs text-[#212121]"
                            onClick={() => {/* View design details */}}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#FAF9F7] border border-dashed border-[#E9E6DD] rounded-[16px] p-8 text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Upload className="h-6 w-6 text-[#414141]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">No designs yet</h3>
                  <p className="text-[#414141] text-sm mb-4 max-w-md mx-auto">
                    You haven't uploaded any designs yet. Start a challenge and share your creative work!
                  </p>
                  <Button 
                    onClick={() => navigate("/")}
                    className="bg-[#212121] hover:bg-black text-white"
                  >
                    Start a Challenge
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Saved Briefs tab */}
            <TabsContent value="briefs">
              <h2 className="text-xl font-semibold mb-4">My Saved Briefs</h2>
              
              {savedBriefs.length > 0 ? (
                <div className="space-y-4">
                  {savedBriefs.map((brief, index) => (
                    <div key={index} className="bg-white border border-[#E9E6DD] rounded-[16px] p-5 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-[#FAF9F7] border border-[#E9E6DD] rounded-[8px] flex items-center justify-center mr-3">
                            <Folder className="h-5 w-5 text-[#212121]" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Design Brief</h3>
                            <div className="flex items-center text-[#414141] text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>
                                {new Date(brief.timestamp).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-xs"
                          onClick={() => {
                            // Navigate to home page with this brief
                            // In a real implementation, you would set this brief in some state manager
                            // and restore it on the home page
                            navigate("/");
                          }}
                        >
                          Use Brief
                          <ChevronRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </div>
                      
                      <p className="text-[#414141] text-sm border-l-2 border-[#E9E6DD] pl-3 py-1">
                        {brief.text}
                      </p>
                      
                      <div className="flex justify-end mt-3">
                        <Button
                          onClick={() => navigate("/")}
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs border-[#E9E6DD] text-[#212121] hover:bg-[#FAF9F7]"
                        >
                          <Upload className="h-3.5 w-3.5 mr-1.5" />
                          Start Design
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#FAF9F7] border border-dashed border-[#E9E6DD] rounded-[16px] p-8 text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <PenLine className="h-6 w-6 text-[#414141]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">No saved briefs</h3>
                  <p className="text-[#414141] text-sm mb-4 max-w-md mx-auto">
                    You haven't saved any design briefs yet. Generate a brief and save it for later!
                  </p>
                  <Button 
                    onClick={() => navigate("/")}
                    className="bg-[#212121] hover:bg-black text-white"
                  >
                    Create a Brief
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}