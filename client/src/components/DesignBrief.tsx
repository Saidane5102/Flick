import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card as CardType } from "@shared/schema";
import { Upload, Save, Clock } from "lucide-react";
import UploadDesign from "./UploadDesign";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DesignBriefProps {
  clientCard: CardType | null;
  needCard: CardType | null;
  challengeCard: CardType | null;
  audienceCard: CardType | null;
  cardIds: number[];
}

export default function DesignBrief({
  clientCard,
  needCard,
  challengeCard,
  audienceCard,
  cardIds,
}: DesignBriefProps) {
  const [timerDialogOpen, setTimerDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const { user } = useAuth();
  const [_, navigate] = useLocation();

  if (!clientCard || !needCard || !challengeCard || !audienceCard) {
    return null;
  }

  const briefText = `Create a ${needCard.promptText} for a ${clientCard.promptText} with ${challengeCard.promptText}, targeting ${audienceCard.promptText}.`;

  const handleStartDesign = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    setUploadDialogOpen(true);
  };

  const saveBrief = () => {
    // This would save the brief to local storage or user's account
    const brief = {
      text: briefText,
      cardIds,
      timestamp: new Date().toISOString(),
    };
    
    // For now, just save to localStorage
    const savedBriefs = JSON.parse(localStorage.getItem("savedBriefs") || "[]");
    savedBriefs.push(brief);
    localStorage.setItem("savedBriefs", JSON.stringify(savedBriefs));
    
    // Show a toast or notification that the brief was saved
    alert("Brief saved!");
  };

  return (
    <div className="mt-10 w-full max-w-3xl mx-auto opacity-100 transition-opacity duration-500 ease-in-out">
      <h3 className="text-xl font-semibold mb-3">Your Design Brief:</h3>
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
        <p className="text-lg">
          Create a <span className="font-semibold text-orange-500">{needCard.promptText}</span>{" "}
          for a <span className="font-semibold text-teal-500">{clientCard.promptText}</span>{" "}
          with <span className="font-semibold text-purple-500">{challengeCard.promptText}</span>,{" "}
          targeting <span className="font-semibold text-emerald-500">{audienceCard.promptText}</span>.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleStartDesign}
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center"
          >
            <Upload className="h-5 w-5 mr-1" />
            Start Design
          </Button>
          
          <Button
            variant="outline"
            onClick={saveBrief}
            className="border border-gray-800 hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded-lg flex items-center justify-center"
          >
            <Save className="h-5 w-5 mr-1" />
            Save Brief
          </Button>
        </div>
      </div>

      {/* Optional timer */}
      <div className="mt-4 flex justify-center">
        <Dialog open={timerDialogOpen} onOpenChange={setTimerDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="text-sm flex items-center text-gray-800 hover:text-primary transition-colors"
            >
              <Clock className="h-4 w-4 mr-1" />
              Set Timer for Challenge
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set a Timer for Your Challenge</DialogTitle>
              <DialogDescription>
                Choose how long you want to work on this design challenge.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <Button onClick={() => setTimerDialogOpen(false)}>30 Minutes</Button>
              <Button onClick={() => setTimerDialogOpen(false)}>1 Hour</Button>
              <Button onClick={() => setTimerDialogOpen(false)}>2 Hours</Button>
              <Button onClick={() => setTimerDialogOpen(false)}>Custom</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Upload Design Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Your Design</DialogTitle>
            <DialogDescription>
              Share your work with the community for feedback
            </DialogDescription>
          </DialogHeader>
          <UploadDesign
            brief={briefText}
            cardIds={cardIds}
            onSuccess={() => setUploadDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
