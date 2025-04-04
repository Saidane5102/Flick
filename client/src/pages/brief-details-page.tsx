import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, Target, Users, Upload, Send, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface BriefDetails {
  cardIds: number[];
  briefText: string;
  client: string;
  need: string;
  challenge: string;
  audience: string;
  startedAt: string;
  timeLeft: number;
  invitedUsers?: Array<{
    id: string;
    username: string;
    avatar?: string;
  }>;
}

export default function BriefDetailsPage() {
  const [location, navigate] = useLocation();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [briefDetails, setBriefDetails] = useState<BriefDetails | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTimeLeft, setCurrentTimeLeft] = useState<number>(0);

  // Load brief details from localStorage
  useEffect(() => {
    const savedTimer = localStorage.getItem("activeTimer");
    if (savedTimer) {
      const timer = JSON.parse(savedTimer);
      const briefWithUsers = {
        ...timer,
        invitedUsers: [
          { id: "1", username: "John Doe", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
          { id: "2", username: "Jane Smith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" },
          { id: "3", username: "Mike Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
        ]
      };
      setBriefDetails(briefWithUsers);
      setCurrentTimeLeft(timer.timeLeft);
    }
  }, []);

  // Update timer every second
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (briefDetails && currentTimeLeft > 0) {
      interval = setInterval(() => {
        setCurrentTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            toast({
              title: "Time's Up!",
              description: "Your design challenge deadline has been reached.",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [briefDetails, currentTimeLeft]);

  const handleCancelAcceptance = () => {
    if (!briefDetails) return;

    const acceptedBriefs = JSON.parse(localStorage.getItem("acceptedBriefs") || "[]");
    const updatedBriefs = acceptedBriefs.filter((brief: any) => {
      if (!brief.cardIds || !Array.isArray(brief.cardIds)) return false;
      return brief.cardIds.join("-") !== briefDetails.cardIds.join("-");
    });
    
    localStorage.setItem("acceptedBriefs", JSON.stringify(updatedBriefs));

    const cards = JSON.parse(localStorage.getItem("cards") || "[]");
    const updatedCards = cards.map((card: any) => {
      if (briefDetails.cardIds.includes(card.id)) {
        return { ...card, opacity: 1 };
      }
      return card;
    });
    localStorage.setItem("cards", JSON.stringify(updatedCards));

    const currentXP = parseInt(localStorage.getItem("userXP") || "0");
    const newXP = currentXP - 50;
    localStorage.setItem("userXP", newXP.toString());

    localStorage.removeItem("activeTimer");
    
    toast({
      title: "Acceptance Cancelled",
      description: "50 XP points have been deducted for cancelling the brief acceptance.",
      variant: "destructive",
    });

    navigate("/");
  };

  const handleSubmitWork = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Work Submitted",
        description: "Your design has been successfully submitted for review.",
      });
      
      setSubmissionText("");
      setSubmissionFile(null);
      setIsSubmitting(false);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your work. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // If auth is still loading, show a loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#212121] mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!briefDetails) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#212121] mb-4">No Active Challenge</h2>
          <p className="text-[#414141] mb-6">You don't have any active design challenge.</p>
          <Button
            onClick={() => navigate("/")}
            className="bg-[#212121] hover:bg-black text-white"
          >
            Start a New Challenge
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header with Timer */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#212121] mb-2">Design Challenge Details</h1>
              <div className="flex items-center gap-2 text-[#414141]">
                <Clock className="h-4 w-4" />
                <span>Started on {new Date(briefDetails.startedAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="bg-[#1A1A1A] rounded-2xl px-6 py-4 text-center">
              <div className="text-sm text-[#E9E6DD] mb-1">Time Remaining</div>
              <div className="text-2xl font-bold text-white">
                {formatTime(currentTimeLeft)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Brief Details Card */}
              <Card className="bg-white border-[#E9E6DD] rounded-[20px] shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-[#212121]">Challenge Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-[#414141] text-lg leading-relaxed">
                    {briefDetails.briefText}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Client */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[#414141]">
                        <User className="h-5 w-5" />
                        <span className="font-medium">Client</span>
                      </div>
                      <p className="text-[#212121]">{briefDetails.client}</p>
                    </div>

                    {/* Need */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[#414141]">
                        <Target className="h-5 w-5" />
                        <span className="font-medium">Need</span>
                      </div>
                      <p className="text-[#212121]">{briefDetails.need}</p>
                    </div>

                    {/* Challenge */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[#414141]">
                        <Target className="h-5 w-5" />
                        <span className="font-medium">Challenge</span>
                      </div>
                      <p className="text-[#212121]">{briefDetails.challenge}</p>
                    </div>

                    {/* Audience */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[#414141]">
                        <Users className="h-5 w-5" />
                        <span className="font-medium">Audience</span>
                      </div>
                      <p className="text-[#212121]">{briefDetails.audience}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submission Form */}
              <Card className="bg-white border-[#E9E6DD] rounded-[20px] shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-[#212121]">Submit Your Work</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={submissionText}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSubmissionText(e.target.value)}
                        placeholder="Describe your design solution..."
                        className="min-h-[120px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="file">Upload Design</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="file"
                          type="file"
                          accept="image/*"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubmissionFile(e.target.files?.[0] || null)}
                          className="flex-1"
                        />
                        {submissionFile && (
                          <Button
                            variant="outline"
                            onClick={() => setSubmissionFile(null)}
                            className="text-red-600"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmitWork}
                    disabled={isSubmitting || !submissionText || !submissionFile}
                    className="w-full bg-[#212121] hover:bg-black text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Work
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Team Members */}
              <Card className="bg-white border-[#E9E6DD] rounded-[20px] shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-[#212121]">Team Members</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {briefDetails.invitedUsers?.map((user) => (
                    <div key={user.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E9E6DD] flex items-center justify-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-[#414141]" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-[#212121]">{user.username}</div>
                        <div className="text-sm text-[#414141]">Designer</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="w-full border-[#E9E6DD] text-[#212121] hover:bg-[#FAF9F7]"
                >
                  Back to Home
                </Button>
                <Button
                  onClick={handleCancelAcceptance}
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                >
                  Cancel Acceptance (-50 XP)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 