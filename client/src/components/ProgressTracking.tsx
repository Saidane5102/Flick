import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Badge, UserBadge } from "@shared/schema";
import {
  CheckCircle,
  Award,
  Zap,
  Lightbulb,
  Palette,
  PenTool,
  MessageCircle,
  Lock,
  Image,
  Star,
  TrendingUp,
  Clock
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface BadgeWithStatus extends Badge {
  earned: boolean;
  earnedAt?: Date;
}

interface ActiveTimer {
  timeLeft: number;
  briefText: string;
  startedAt: string;
  cardIds: number[];
  client: string;
  need: string;
  challenge: string;
  audience: string;
}

export default function ProgressTracking() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [visibleIndices, setVisibleIndices] = useState({ start: 0, end: 2 });
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);

  const stopTimer = () => {
    localStorage.removeItem("activeTimer");
    setActiveTimer(null);
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent("timerStopped"));
  };

  // Listen for timer updates from localStorage
  useEffect(() => {
    const checkTimer = () => {
      const savedTimer = localStorage.getItem("activeTimer");
      if (savedTimer) {
        try {
          const timer = JSON.parse(savedTimer);
          const now = new Date().getTime();
          const startTime = new Date(timer.startedAt).getTime();
          const elapsedSeconds = Math.floor((now - startTime) / 1000);
          const remainingTime = Math.max(0, timer.timeLeft - elapsedSeconds);

          if (remainingTime > 0) {
            setActiveTimer({
              ...timer,
              timeLeft: remainingTime
            });
          } else {
            localStorage.removeItem("activeTimer");
            setActiveTimer(null);
          }
        } catch (error) {
          console.error("Error parsing timer:", error);
          localStorage.removeItem("activeTimer");
          setActiveTimer(null);
        }
      } else {
        setActiveTimer(null);
      }
    };

    checkTimer();
    const interval = setInterval(checkTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen for timer stopped events
  useEffect(() => {
    const handleTimerStopped = () => {
      setActiveTimer(null);
    };

    window.addEventListener("timerStopped", handleTimerStopped);
    return () => window.removeEventListener("timerStopped", handleTimerStopped);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Define type for user stats
  interface UserStats {
    completedChallenges: number;
    earnedBadges: number;
    totalLikes: number;
    points: number;
    level: number;
    progressToNextLevel: number;
    nextLevelPoints: number;
  }

  // Fetch user stats
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

  // Fetch all badges
  const { data: allBadges, isLoading: badgesLoading } = useQuery<Badge[]>({
    queryKey: ["/api/badges"],
    queryFn: async () => {
      const res = await fetch("/api/badges");
      if (!res.ok) throw new Error("Failed to fetch badges");
      return res.json();
    },
  });

  // Fetch user badges
  const { data: userBadges, isLoading: userBadgesLoading } = useQuery<{
    badge: Badge;
    userBadge: UserBadge;
  }[]>({
    queryKey: user ? ['/api/users', user.id, 'badges'] : [],
    queryFn: async () => {
      if (!user) throw new Error("User not found");
      const res = await fetch(`/api/users/${user.id}/badges`);
      if (!res.ok) throw new Error("Failed to fetch user badges");
      return res.json();
    },
    enabled: !!user,
  });

  const isLoading = statsLoading || badgesLoading || userBadgesLoading;

  // Combine badge information with user's earned status
  const badgesWithStatus: BadgeWithStatus[] = allBadges
    ? allBadges.map((badge) => {
        const userBadge = userBadges?.find(
          (ub: { badge: Badge; userBadge: UserBadge }) => ub.badge.id === badge.id
        );
        return {
          ...badge,
          earned: !!userBadge,
          earnedAt: userBadge ? new Date(userBadge.userBadge.earnedAt) : undefined,
        };
      })
    : [];

  const getBadgeIcon = (iconName: string, className = "h-8 w-8") => {
    switch (iconName) {
      case "lightbulb":
        return <Lightbulb className={className} />;
      case "palette":
        return <Palette className={className} />;
      case "pen-tool":
        return <PenTool className={className} />;
      case "message-circle":
        return <MessageCircle className={className} />;
      case "award":
        return <Award className={className} />;
      case "star":
        return <Zap className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  const getOpacityClass = (index: number) => {
    const relativeIndex = index - visibleIndices.start;
    const isLastBadge = index === badgesWithStatus.length - 1;
    const isFullyScrolledToEnd = visibleIndices.start >= badgesWithStatus.length - 1;

    // If it's the last badge and we've scrolled to the end, show it at full opacity
    if (isLastBadge && isFullyScrolledToEnd) {
      return 'opacity-100';
    }

    // Normal opacity rules
    if (relativeIndex < 0) return 'opacity-25';
    if (relativeIndex === 0) return 'opacity-100';
    if (relativeIndex === 1) return 'opacity-50';
    return 'opacity-25';
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const scrollHeight = container.scrollHeight;
      const itemHeight = 64; // Approximate height of each badge item (including gap)
      
      // Calculate the current start index based on scroll position
      let startIndex = Math.floor(scrollTop / itemHeight);
      
      // Check if we're at the end of the scroll
      const isAtEnd = scrollTop + containerHeight >= scrollHeight - (itemHeight / 2);
      
      // If we're at the end, adjust the start index to show the last badge
      if (isAtEnd && badgesWithStatus.length > 0) {
        startIndex = badgesWithStatus.length - 1;
      }
      
      setVisibleIndices({
        start: startIndex,
        end: startIndex + 2
      });
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [badgesWithStatus.length]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <aside className="fixed top-16 right-0 w-80 h-[calc(100vh-4rem)] bg-white border-l border-gray-100 overflow-hidden shadow-lg">
      <div className="h-full overflow-y-auto custom-scrollbar">
        <div className="p-6 space-y-6 relative">
          {/* Active Timer Widget */}
          {activeTimer && (
            <div className="bg-[#1A1A1A] rounded-2xl p-6 space-y-4">
              {/* Timer Display */}
              <div className="text-3xl font-bold text-white text-center">
                {formatTime(activeTimer.timeLeft)}
              </div>

              {/* Brief Preview */}
              <div className="space-y-2">
                <p className="text-sm text-[#E9E6DD] line-clamp-2 text-center">
                  {activeTimer.briefText}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-white/10 hover:bg-white/20 text-[#E9E6DD] border-white/20"
                  onClick={() => {
                    // Use React Router navigation
                    navigate(`/brief/${activeTimer.cardIds.join('-')}`);
                  }}
                >
                  Brief Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-white/10 hover:bg-white/20 text-[#E9E6DD] border-white/20"
                  onClick={stopTimer}
                >
                  Stop Timer
                </Button>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Your Progress</h2>
            <p className="text-sm text-gray-600">
              Track your design journey and earn badges as you complete challenges.
              Keep practicing to improve your skills!
            </p>
          </div>

          {/* Level Card */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Designer Level */}
              <div className="flex items-center gap-3">
                <div className="bg-[#E9E6DD] p-2 rounded-lg">
                  <Star className="h-5 w-5 text-[#1A1A1A]" />
                </div>
                <div>
                  <div className="text-xs text-[#E9E6DD]">Designer</div>
                  <div className="text-sm font-medium text-white">Level {stats?.level || 1}</div>
                </div>
              </div>

              {/* Experience Points */}
              <div className="flex items-center gap-3">
                <div className="bg-[#E9E6DD] p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-[#1A1A1A]" />
                </div>
                <div>
                  <div className="text-xs text-[#E9E6DD]">Experience</div>
                  <div className="text-sm font-medium text-white">Points</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[#E9E6DD]">
                <span>Progress to Level {(stats?.level || 1) + 1}</span>
                <span>{stats?.progressToNextLevel || 0}%</span>
              </div>
              <Progress 
                value={stats?.progressToNextLevel || 0} 
                className="h-1.5 bg-[#333333]" 
                indicatorClassName="bg-[#E9E6DD]" 
              />
              <p className="text-xs text-[#E9E6DD] opacity-80">
                Need {stats?.nextLevelPoints || 25} more XP to reach Level {(stats?.level || 1) + 1}.
                Complete challenges and earn badges to gain experience points.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-medium">{stats?.completedChallenges || 0}</div>
              <div className="text-xs text-gray-500">Challenges</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium">{stats?.earnedBadges || 0}</div>
              <div className="text-xs text-gray-500">Badges</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium">{stats?.totalLikes || 0}</div>
              <div className="text-xs text-gray-500">Upvotes</div>
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Your Badges</h3>
              <span className="text-xs text-gray-500">{stats?.earnedBadges || 0}/{badgesWithStatus.length} earned</span>
            </div>
            
            {/* Scrollable Badge List */}
            <div 
              ref={scrollContainerRef}
              className="overflow-y-auto pr-2 scroll-smooth"
              style={{ 
                height: 'calc(1.5 * (64px + 8px))',
                maskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)'
              }}
            >
              <div className="space-y-2">
                {badgesWithStatus.map((badge, index) => (
                  <div
                    key={badge.id}
                    className={`flex items-center gap-3 p-3 bg-white rounded-lg transition-all duration-300 ${
                      getOpacityClass(index)
                    }`}
                    style={{ height: '64px' }}
                  >
                    <div className={`${
                      badge.earned 
                        ? "bg-gray-900 text-white" 
                        : "bg-gray-100 text-gray-400"
                    } p-2 rounded-lg flex-shrink-0`}>
                      {badge.earned ? (
                        getBadgeIcon(badge.icon, "h-5 w-5")
                      ) : (
                        <Lock className="h-5 w-5" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{badge.name}</h4>
                      <p className="text-xs text-gray-500 truncate">{badge.description}</p>
                    </div>

                    {!badge.earned && (
                      <div className="flex-shrink-0 w-16">
                        <div className="text-[10px] text-gray-500 text-right mb-1">
                          0/{badge.requiredCount}
                        </div>
                        <Progress value={0} className="h-0.5" />
                      </div>
                    )}
                  </div>
                ))}
                {/* Add padding at the bottom to ensure last item can be fully visible */}
                <div style={{ height: 'calc(0.5 * (64px + 8px))' }} />
              </div>
            </div>

            {/* View All Button */}
            <button
              onClick={() => navigate('/profile')}
              className="w-full py-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors bg-white rounded-lg border border-gray-100"
            >
              View All Badges
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
