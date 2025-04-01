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
  TrendingUp
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface BadgeWithStatus extends Badge {
  earned: boolean;
  earnedAt?: Date;
}

export default function ProgressTracking() {
  const { user } = useAuth();

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section id="progress" className="pt-8">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-3">Your Progress</h2>
        <p className="text-center max-w-2xl mb-8">
          Track your design journey and earn badges as you complete challenges. Keep practicing to improve your skills!
        </p>

        {/* Level and Points */}
        <div className="w-full max-w-4xl mb-10">
          <div className="bg-[#212121] rounded-[16px] p-6 text-white shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between mb-4">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-[#E9E6DD] p-3 rounded-[8px] mr-4">
                  <Star className="h-6 w-6 text-[#212121]" />
                </div>
                <div>
                  <p className="text-[#E9E6DD] text-sm">Designer Level</p>
                  <h3 className="text-2xl font-bold">Level {stats?.level || 1}</h3>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-[#E9E6DD] p-3 rounded-[8px] mr-4">
                  <TrendingUp className="h-6 w-6 text-[#212121]" />
                </div>
                <div>
                  <p className="text-[#E9E6DD] text-sm">Experience Points</p>
                  <h3 className="text-2xl font-bold">{stats?.points || 0} XP</h3>
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between mb-2">
                <span className="text-[#E9E6DD] text-sm">Progress to Level {(stats?.level || 1) + 1}</span>
                <span className="text-[#E9E6DD] text-sm">{stats?.progressToNextLevel || 0}%</span>
              </div>
              <Progress value={stats?.progressToNextLevel || 0} className="h-2 bg-[#414141]" indicatorClassName="bg-[#E9E6DD]" />
            </div>
            
            <p className="text-[#E9E6DD] text-sm opacity-80">
              Need {stats?.nextLevelPoints || 25} more XP to reach Level {(stats?.level || 1) + 1}. 
              Complete challenges and earn badges to gain experience points.
            </p>
          </div>
        </div>
        
        {/* Progress stats */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#FAF9F7] rounded-[16px] shadow-sm border border-[#E9E6DD] p-6 flex flex-col items-center text-center">
            <div className="bg-[#212121] p-4 rounded-[8px] mb-3 text-white">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h3 className="text-3xl font-bold text-[#212121]">
              {stats?.completedChallenges || 0}
            </h3>
            <p className="text-sm text-[#414141] mt-1">Challenges Completed</p>
          </div>

          <div className="bg-[#FAF9F7] rounded-[16px] shadow-sm border border-[#E9E6DD] p-6 flex flex-col items-center text-center">
            <div className="bg-[#212121] p-4 rounded-[8px] mb-3 text-white">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-3xl font-bold text-[#212121]">
              {stats?.earnedBadges || 0}
            </h3>
            <p className="text-sm text-[#414141] mt-1">Badges Earned</p>
          </div>

          <div className="bg-[#FAF9F7] rounded-[16px] shadow-sm border border-[#E9E6DD] p-6 flex flex-col items-center text-center">
            <div className="bg-[#212121] p-4 rounded-[8px] mb-3 text-white">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-3xl font-bold text-[#212121]">
              {stats?.totalLikes || 0}
            </h3>
            <p className="text-sm text-[#414141] mt-1">Community Upvotes</p>
          </div>
        </div>

        {/* Earned badges */}
        <div className="w-full max-w-4xl">
          <h3 className="text-xl font-semibold text-[#212121] mb-4">Your Badges</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {badgesWithStatus.map((badge) => (
              <div
                key={badge.id}
                className={`${
                  badge.earned
                    ? "bg-[#FAF9F7] border border-[#E9E6DD] shadow-sm"
                    : "bg-[#F5F5F5] border border-[#E9E6DD] opacity-70"
                } rounded-[16px] p-4 flex flex-col items-center text-center`}
              >
                <div
                  className={`${
                    badge.earned
                      ? "bg-[#212121] text-white"
                      : "bg-[#E9E6DD] text-[#414141]"
                  } h-16 w-16 rounded-[8px] flex items-center justify-center mb-3`}
                >
                  {badge.earned ? (
                    getBadgeIcon(badge.icon)
                  ) : (
                    <Lock className="h-8 w-8" />
                  )}
                </div>
                <h4 className="font-semibold text-[#212121] text-sm">{badge.name}</h4>
                <p className="text-xs text-[#414141] mt-1">{badge.description}</p>
                
                {/* Badge points value for earned badges */}
                {badge.earned && (
                  <div className="mt-2 bg-[#E9E6DD] px-2 py-1 rounded-full text-xs font-medium text-[#212121]">
                    +50 XP
                  </div>
                )}
                
                {/* Progress for unearned badges */}
                {!badge.earned && (
                  <div className="mt-2 w-full">
                    <div className="flex justify-between text-xs text-[#414141] mb-1">
                      <span>Progress</span>
                      <span>0/{badge.requiredCount}</span>
                    </div>
                    <Progress value={0} className="h-1.5 bg-[#E9E6DD]" indicatorClassName="bg-[#212121]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
