import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card as CardType } from "@shared/schema";
import { Save, Clock, Share2, Users, Trash2, CheckCircle, RefreshCw, AlertCircle } from "lucide-react";
import ProjectCreationButton from "./ProjectCreationButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Target } from "lucide-react";

interface DesignBriefProps {
  clientCard: CardType | null;
  needCard: CardType | null;
  challengeCard: CardType | null;
  audienceCard: CardType | null;
  cardIds: number[];
  onDrawAgain: () => void;
}

export default function DesignBrief({
  clientCard,
  needCard,
  challengeCard,
  audienceCard,
  cardIds,
  onDrawAgain,
}: DesignBriefProps) {
  const [isAccepted, setIsAccepted] = useState(false);
  const [timerDialogOpen, setTimerDialogOpen] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [customTime, setCustomTime] = useState(60); // Default 60 minutes
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [location, navigate] = useLocation();

  // Debug logging for initial state
  useEffect(() => {
    console.group('DesignBrief Initial State');
    console.log('Card IDs:', cardIds);
    console.log('Client Card:', clientCard);
    console.log('Need Card:', needCard);
    console.log('Challenge Card:', challengeCard);
    console.log('Audience Card:', audienceCard);
    console.log('Is Accepted:', isAccepted);
    console.log('Timer Running:', timerRunning);
    console.log('Time Left:', timeLeft);
    console.log('Auth State:', { user, isLoading });
    console.groupEnd();
  }, []);

  // Initialize timer state from localStorage
  useEffect(() => {
    console.group('Timer Initialization');
    const savedTimer = localStorage.getItem("activeTimer");
    console.log('Saved Timer:', savedTimer);
    
    if (savedTimer) {
      const timer = JSON.parse(savedTimer);
      const now = new Date().getTime();
      const startTime = new Date(timer.startedAt).getTime();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      const remainingTime = Math.max(0, timer.timeLeft - elapsedSeconds);

      console.log('Timer Details:', {
        startTime: new Date(startTime).toISOString(),
        elapsedSeconds,
        remainingTime,
        originalTimeLeft: timer.timeLeft
      });

      if (remainingTime > 0) {
        setTimeLeft(remainingTime);
        setTimerRunning(true);
        console.log('Timer restored and running');
      } else {
        localStorage.removeItem("activeTimer");
        console.log('Timer expired, removed from storage');
      }
    }
    console.groupEnd();
  }, []);

  // Update timer in localStorage when it changes
  useEffect(() => {
    if (timerRunning && timeLeft !== null) {
      console.group('Timer Update');
      const savedTimer = localStorage.getItem("activeTimer");
      if (savedTimer) {
        const timer = JSON.parse(savedTimer);
        const updatedTimer = {
          ...timer,
          timeLeft,
          startedAt: new Date().toISOString()
        };
        localStorage.setItem("activeTimer", JSON.stringify(updatedTimer));
        console.log('Timer updated in localStorage:', updatedTimer);
      }
      console.groupEnd();
    }
  }, [timeLeft, timerRunning]);

  // Countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            setTimerRunning(false);
            localStorage.removeItem("activeTimer");
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
  }, [timerRunning, timeLeft]);

  const startTimer = (minutes: number) => {
    console.group('Starting Timer');
    if (!clientCard || !needCard || !challengeCard || !audienceCard) {
      console.error('Missing cards:', { clientCard, needCard, challengeCard, audienceCard });
      toast({
        title: "Error",
        description: "Please draw all cards before setting a deadline.",
        variant: "destructive",
      });
      console.groupEnd();
      return;
    }

    const timeLeft = minutes * 60;
    console.log('Setting timer for:', minutes, 'minutes');
    setTimeLeft(timeLeft);
    setTimerRunning(true);
    setTimerDialogOpen(false);

    const timerData = {
      timeLeft,
      briefText: `Create a ${needCard.promptText} for a ${clientCard.promptText} with ${challengeCard.promptText}, targeting ${audienceCard.promptText}.`,
      startedAt: new Date().toISOString(),
      cardIds,
      client: clientCard.promptText,
      need: needCard.promptText,
      challenge: challengeCard.promptText,
      audience: audienceCard.promptText
    };

    localStorage.setItem("activeTimer", JSON.stringify(timerData));
    console.log('Timer saved to localStorage:', timerData);
    console.groupEnd();

    toast({
      title: "Timer Started",
      description: `${minutes} minute timer has started. Good luck!`,
    });
  };

  const stopTimer = () => {
    setTimerRunning(false);
    setTimeLeft(null);
    localStorage.removeItem("activeTimer");
    toast({
      title: "Timer Stopped",
      description: "Your design challenge timer has been stopped.",
    });
  };

  const editTimer = (newMinutes: number) => {
    const timeLeft = newMinutes * 60;
    setTimeLeft(timeLeft);
    setTimerDialogOpen(false);

    // Update active timer in localStorage
    const savedTimer = localStorage.getItem("activeTimer");
    if (savedTimer) {
      const timer = JSON.parse(savedTimer);
      localStorage.setItem("activeTimer", JSON.stringify({
        ...timer,
        timeLeft,
        startedAt: new Date().toISOString()
      }));
    }

    toast({
      title: "Timer Updated",
      description: `Your deadline has been updated to ${newMinutes} minutes.`,
    });
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

  useEffect(() => {
    if (timeLeft === 0) {
      setTimerRunning(false);
      localStorage.removeItem("activeTimer");
      toast({
        title: "Time's Up!",
        description: "Your design challenge time has ended.",
        variant: "default",
      });
    }
  }, [timeLeft]);

  if (!clientCard || !needCard || !challengeCard || !audienceCard) {
    return null;
  }

  const briefText = `Create a ${needCard.promptText} for a ${clientCard.promptText} with ${challengeCard.promptText}, targeting ${audienceCard.promptText}.`;

  const handleAccept = () => {
    console.group('Accepting Brief');
    setIsAccepted(true);
    
    const acceptedBriefs = JSON.parse(localStorage.getItem("acceptedBriefs") || "[]");
    const newBrief = {
      cardIds,
      briefText: `Create a ${needCard.promptText} for a ${clientCard.promptText} with ${challengeCard.promptText}, targeting ${audienceCard.promptText}.`,
      client: clientCard.promptText,
      need: needCard.promptText,
      challenge: challengeCard.promptText,
      audience: audienceCard.promptText,
      acceptedAt: new Date().toISOString(),
    };
    
    acceptedBriefs.push(newBrief);
    localStorage.setItem("acceptedBriefs", JSON.stringify(acceptedBriefs));
    console.log('Accepted briefs:', acceptedBriefs);
    
    const cards = JSON.parse(localStorage.getItem("cards") || "[]");
    const updatedCards = cards.map((card: any) => {
      if (cardIds.includes(card.id)) {
        return { ...card, opacity: 0.2 };
      }
      return card;
    });
    localStorage.setItem("cards", JSON.stringify(updatedCards));
    console.log('Updated cards opacity:', updatedCards);

    console.groupEnd();
    toast({
      title: "Brief Accepted",
      description: "You can now start working on this design challenge.",
    });
  };

  const handleCancelAcceptance = () => {
    console.group('Canceling Brief Acceptance');
    
    const acceptedBriefs = JSON.parse(localStorage.getItem("acceptedBriefs") || "[]");
    console.log('Current accepted briefs:', acceptedBriefs);

    const updatedBriefs = acceptedBriefs.filter((brief: any) => {
      // Safely handle cases where cardIds might be undefined
      if (!brief.cardIds || !Array.isArray(brief.cardIds)) {
        console.log('Invalid brief found:', brief);
        return false;
      }
      return brief.cardIds.join("-") !== cardIds.join("-");
    });
    
    localStorage.setItem("acceptedBriefs", JSON.stringify(updatedBriefs));
    console.log('Updated accepted briefs:', updatedBriefs);

    const cards = JSON.parse(localStorage.getItem("cards") || "[]");
    console.log('Current cards:', cards);

    const updatedCards = cards.map((card: any) => {
      if (cardIds.includes(card.id)) {
        return { ...card, opacity: 1 };
      }
      return card;
    });
    localStorage.setItem("cards", JSON.stringify(updatedCards));
    console.log('Updated cards opacity:', updatedCards);

    const currentXP = parseInt(localStorage.getItem("userXP") || "0");
    const newXP = currentXP - 50;
    localStorage.setItem("userXP", newXP.toString());
    console.log('Updated XP:', { currentXP, newXP });

    setIsAccepted(false);
    console.groupEnd();
    toast({
      title: "Acceptance Cancelled",
      description: "50 XP points have been deducted for cancelling the brief acceptance.",
      variant: "destructive",
    });

    // Call onDrawAgain to reset and draw new cards
    onDrawAgain();
  };

  const handleDrawAgain = () => {
    console.group('Drawing Again');
    // Reset all states
    setIsAccepted(false);
    setTimerRunning(false);
    setTimeLeft(null);
    setTimerDialogOpen(false);
    localStorage.removeItem("activeTimer");
    
    // Call the parent's onDrawAgain function
    onDrawAgain();
    console.groupEnd();
  };

  // If auth is still loading, show a loading state
  if (isLoading) {
    return (
      <div className="bg-white border-[#E9E6DD] rounded-[20px] shadow-sm w-full p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#212121] mx-auto"></div>
        </div>
      </div>
    );
  }

  // If no user is authenticated, show a message
  if (!user) {
    return (
      <div className="bg-white border-[#E9E6DD] rounded-[20px] shadow-sm w-full p-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-[#212121] mb-2">Authentication Required</h3>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-[#212121] hover:bg-black text-white"
          >
            Log In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-[#E9E6DD] rounded-[20px] shadow-sm w-full">
      <div className="p-6 space-y-6">
        <h3 className="text-2xl font-bold text-[#212121]">Design Challenge</h3>
        <p className="text-[#414141] text-lg leading-relaxed">
          {briefText}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#414141]">
              <User className="h-5 w-5" />
              <span className="font-medium">Client</span>
            </div>
            <p className="text-[#212121]">{clientCard.promptText}</p>
          </div>

          {/* Need */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#414141]">
              <Target className="h-5 w-5" />
              <span className="font-medium">Need</span>
            </div>
            <p className="text-[#212121]">{needCard.promptText}</p>
          </div>

          {/* Challenge */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#414141]">
              <Target className="h-5 w-5" />
              <span className="font-medium">Challenge</span>
            </div>
            <p className="text-[#212121]">{challengeCard.promptText}</p>
          </div>

          {/* Audience */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#414141]">
              <Users className="h-5 w-5" />
              <span className="font-medium">Audience</span>
            </div>
            <p className="text-[#212121]">{audienceCard.promptText}</p>
          </div>
        </div>

        {!isAccepted ? (
          <div className="flex justify-center gap-4">
            <Button
              onClick={handleAccept}
              className="bg-[#212121] hover:bg-black text-white"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Accept Brief
            </Button>
            <Button
              onClick={handleDrawAgain}
              variant="outline"
              className="border-[#E9E6DD] text-[#212121] hover:bg-[#FAF9F7]"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Draw Again
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Brief Accepted</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    You cannot draw new cards until you cancel this brief. Canceling will result in a 50 XP penalty.
                  </p>
          </div>
        </div>
      </div>

            <div className="flex flex-wrap justify-center gap-4">
        <Dialog open={timerDialogOpen} onOpenChange={setTimerDialogOpen}>
          <DialogTrigger asChild>
                  <Button className="bg-[#212121] hover:bg-black text-white">
                    <Clock className="mr-2 h-4 w-4" />
                    Set Deadline
            </Button>
          </DialogTrigger>
                <DialogContent>
            <DialogHeader>
                    <DialogTitle>Set Deadline</DialogTitle>
            </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => startTimer(30)}
                        disabled={timerRunning}
                      >
                        30 min
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => startTimer(60)}
                        disabled={timerRunning}
                      >
                        1 hour
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => startTimer(120)}
                        disabled={timerRunning}
                      >
                        2 hours
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customTime">Custom Time (minutes)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="customTime"
                          type="number"
                          min="1"
                          max="480"
                          value={customTime}
                          onChange={(e) => setCustomTime(parseInt(e.target.value) || 60)}
                          className="flex-1"
                        />
                        <Button
                          onClick={() => startTimer(customTime)}
                          disabled={timerRunning}
                        >
                          Start
                        </Button>
                      </div>
                    </div>
            </div>
          </DialogContent>
        </Dialog>

              <Button
                variant="outline"
                onClick={() => navigate(`/brief/${cardIds.join("-")}`)}
                className="border-[#E9E6DD] text-[#212121] hover:bg-[#FAF9F7]"
              >
                <Share2 className="mr-2 h-4 w-4" />
                View Details
              </Button>

              <Button
                variant="outline"
                onClick={handleCancelAcceptance}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Cancel Acceptance
              </Button>
            </div>

            {timerRunning && (
              <div className="text-center">
                <div className="text-sm text-[#414141] mb-1">Time Remaining</div>
                <div className="text-2xl font-bold text-[#212121]">
                  {formatTime(timeLeft || 0)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
