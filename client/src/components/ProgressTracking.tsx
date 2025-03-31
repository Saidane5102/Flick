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
} from "lucide-react";

interface BadgeWithStatus extends Badge {
  earned: boolean;
  earnedAt?: Date;
}

export default function ProgressTracking() {
  const { user } = useAuth();

  // Fetch user stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: user ? [`/api/users/${user.id}/stats`] : null,
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
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
    queryKey: user ? [`/api/users/${user.id}/badges`] : null,
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
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
          (ub) => ub.badge.id === badge.id
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

        {/* Progress stats */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-3">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800">
              {stats?.completedChallenges || 0}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Challenges Completed</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
            <div className="bg-orange-100 p-4 rounded-full mb-3">
              <Award className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800">
              {stats?.earnedBadges || 0}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Badges Earned</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
            <div className="bg-purple-100 p-4 rounded-full mb-3">
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800">
              {stats?.totalLikes || 0}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Community Upvotes</p>
          </div>
        </div>

        {/* Earned badges */}
        <div className="w-full max-w-4xl">
          <h3 className="text-xl font-semibold mb-4">Your Badges</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {badgesWithStatus.map((badge) => (
              <div
                key={badge.id}
                className={`${
                  badge.earned
                    ? "bg-white shadow-md"
                    : "bg-gray-100 shadow-sm opacity-70"
                } rounded-xl p-4 flex flex-col items-center text-center`}
              >
                <div
                  className={`${
                    badge.earned
                      ? "badge-pulse bg-gradient-to-r from-primary to-purple-500 text-white"
                      : "bg-gray-300 text-gray-500"
                  } h-16 w-16 rounded-full flex items-center justify-center mb-3`}
                >
                  {badge.earned ? (
                    getBadgeIcon(badge.icon)
                  ) : (
                    <Lock className="h-8 w-8" />
                  )}
                </div>
                <h4 className="font-bold text-sm">{badge.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
