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
    <div className="mt-14 w-full max-w-4xl mx-auto opacity-100 transition-opacity duration-500 ease-in-out">
      <h3 className="text-2xl font-semibold mb-5 text-center">Your Design Brief</h3>
      <div className="apple-card bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100 relative overflow-hidden">
        {/* Decorative gradient accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        {/* Brief text content */}
        <div className="relative z-10">
          <p className="text-xl leading-relaxed tracking-tight text-gray-800">
            Create a <span className="font-semibold text-orange-500 px-1 py-0.5 rounded bg-orange-50">{needCard.promptText}</span>{" "}
            for a <span className="font-semibold text-teal-500 px-1 py-0.5 rounded bg-teal-50">{clientCard.promptText}</span>{" "}
            with <span className="font-semibold text-purple-500 px-1 py-0.5 rounded bg-purple-50">{challengeCard.promptText}</span>,{" "}
            targeting <span className="font-semibold text-emerald-500 px-1 py-0.5 rounded bg-emerald-50">{audienceCard.promptText}</span>.
          </p>

          {/* Card details */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-teal-50 rounded-lg">
              <div className="font-medium text-teal-700 mb-1">Client</div>
              <div className="text-gray-700">{clientCard.promptText}</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="font-medium text-orange-700 mb-1">Need</div>
              <div className="text-gray-700">{needCard.promptText}</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="font-medium text-purple-700 mb-1">Challenge</div>
              <div className="text-gray-700">{challengeCard.promptText}</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <div className="font-medium text-emerald-700 mb-1">Audience</div>
              <div className="text-gray-700">{audienceCard.promptText}</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleStartDesign}
              className="apple-button bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-8 shadow-sm hover:shadow-md flex items-center justify-center"
            >
              <Upload className="h-4.5 w-4.5 mr-2" />
              Start Design
            </Button>
            
            <Button
              variant="outline"
              onClick={saveBrief}
              className="apple-button border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-8 rounded-full flex items-center justify-center"
            >
              <Save className="h-4.5 w-4.5 mr-2" />
              Save Brief
            </Button>
          </div>
        </div>
      </div>

      {/* Optional timer */}
      <div className="mt-6 flex justify-center">
        <Dialog open={timerDialogOpen} onOpenChange={setTimerDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="text-sm flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Clock className="h-4 w-4 mr-1.5" />
              Set Timer for Challenge
            </Button>
          </DialogTrigger>
          <DialogContent className="apple-card border-0">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Set a Timer for Your Challenge</DialogTitle>
              <DialogDescription className="text-gray-600">
                Choose how long you want to work on this design challenge.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <Button onClick={() => setTimerDialogOpen(false)} className="apple-button bg-gray-100 hover:bg-gray-200 text-gray-800 border-0">30 Minutes</Button>
              <Button onClick={() => setTimerDialogOpen(false)} className="apple-button bg-gray-100 hover:bg-gray-200 text-gray-800 border-0">1 Hour</Button>
              <Button onClick={() => setTimerDialogOpen(false)} className="apple-button bg-gray-100 hover:bg-gray-200 text-gray-800 border-0">2 Hours</Button>
              <Button onClick={() => setTimerDialogOpen(false)} className="apple-button bg-gray-100 hover:bg-gray-200 text-gray-800 border-0">Custom</Button>
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
