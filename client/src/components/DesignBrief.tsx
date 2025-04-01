import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card as CardType } from "@shared/schema";
import { Save, Clock } from "lucide-react";
import ProjectCreationButton from "./ProjectCreationButton";
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [_, navigate] = useLocation();

  if (!clientCard || !needCard || !challengeCard || !audienceCard) {
    return null;
  }

  const briefText = `Create a ${needCard.promptText} for a ${clientCard.promptText} with ${challengeCard.promptText}, targeting ${audienceCard.promptText}.`;

  const saveBrief = () => {
    // This would save the brief to local storage or user's account
    const brief = {
      text: briefText,
      cardIds,
      timestamp: new Date().toISOString(),
      client: clientCard.promptText,
      need: needCard.promptText,
      challenge: challengeCard.promptText,
      audience: audienceCard.promptText
    };
    
    // For now, just save to localStorage
    const savedBriefs = JSON.parse(localStorage.getItem("savedBriefs") || "[]");
    savedBriefs.push(brief);
    localStorage.setItem("savedBriefs", JSON.stringify(savedBriefs));
    
    // Show toast that the brief was saved
    toast({
      title: "Brief saved",
      description: "Your design brief has been saved for later",
    });
  };

  return (
    <div className="mt-14 w-full max-w-4xl mx-auto opacity-100 transition-opacity duration-300 ease-in-out">
      <h3 className="text-2xl font-bold mb-6 text-center">Your Design Brief</h3>
      <div className="memo-card p-6 md:p-8 relative overflow-hidden">
        {/* Memorisely-style black accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-black"></div>
        
        {/* Brief text content */}
        <div className="relative z-10">
          <p className="text-xl leading-relaxed text-gray-800 mb-6">
            Create a <span className="font-medium text-black px-1 py-0.5 rounded bg-gray-100">{needCard.promptText}</span>{" "}
            for a <span className="font-medium text-black px-1 py-0.5 rounded bg-gray-100">{clientCard.promptText}</span>{" "}
            with <span className="font-medium text-black px-1 py-0.5 rounded bg-gray-100">{challengeCard.promptText}</span>,{" "}
            targeting <span className="font-medium text-black px-1 py-0.5 rounded bg-gray-100">{audienceCard.promptText}</span>.
          </p>

          {/* Card details - Memorisely style */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="border border-gray-100 rounded-md p-4 hover:border-gray-300 transition-colors">
              <div className="font-medium text-black mb-2">Client</div>
              <div className="text-gray-700">{clientCard.promptText}</div>
            </div>
            <div className="border border-gray-100 rounded-md p-4 hover:border-gray-300 transition-colors">
              <div className="font-medium text-black mb-2">Need</div>
              <div className="text-gray-700">{needCard.promptText}</div>
            </div>
            <div className="border border-gray-100 rounded-md p-4 hover:border-gray-300 transition-colors">
              <div className="font-medium text-black mb-2">Challenge</div>
              <div className="text-gray-700">{challengeCard.promptText}</div>
            </div>
            <div className="border border-gray-100 rounded-md p-4 hover:border-gray-300 transition-colors">
              <div className="font-medium text-black mb-2">Audience</div>
              <div className="text-gray-700">{audienceCard.promptText}</div>
            </div>
          </div>

          {/* Action buttons - Memorisely style */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <ProjectCreationButton
              brief={briefText}
              cardIds={cardIds}
              className="bg-black hover:bg-gray-800 text-white transition-colors flex items-center justify-center"
            />
            
            <Button
              variant="outline"
              onClick={saveBrief}
              className="border-gray-200 hover:bg-gray-50 text-gray-800 transition-colors flex items-center justify-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Brief
            </Button>
          </div>
        </div>
      </div>

      {/* Optional timer - Memorisely style */}
      <div className="mt-6 flex justify-center">
        <Dialog open={timerDialogOpen} onOpenChange={setTimerDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="text-sm flex items-center text-gray-600 hover:text-black transition-colors"
            >
              <Clock className="h-4 w-4 mr-1.5" />
              Set Timer for Challenge
            </Button>
          </DialogTrigger>
          <DialogContent className="memo-card">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Set a Timer</DialogTitle>
              <DialogDescription className="text-gray-600">
                Choose how long you want to work on this design challenge.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <Button onClick={() => setTimerDialogOpen(false)} className="border-gray-200 hover:bg-gray-50 text-gray-800">30 Minutes</Button>
              <Button onClick={() => setTimerDialogOpen(false)} className="border-gray-200 hover:bg-gray-50 text-gray-800">1 Hour</Button>
              <Button onClick={() => setTimerDialogOpen(false)} className="border-gray-200 hover:bg-gray-50 text-gray-800">2 Hours</Button>
              <Button onClick={() => setTimerDialogOpen(false)} className="bg-black hover:bg-gray-800 text-white">Custom</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
