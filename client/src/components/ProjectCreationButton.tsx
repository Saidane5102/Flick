import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import FullScreenUpload from "./FullScreenUpload";
import ProjectStartDialog from "./ProjectStartDialog";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface ProjectCreationButtonProps {
  brief: string;
  cardIds: number[];
  className?: string;
}

export default function ProjectCreationButton({ brief, cardIds, className = "" }: ProjectCreationButtonProps) {
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [contentType, setContentType] = useState<string>("image");
  const { user } = useAuth();
  const { toast } = useToast();
  const [_, navigate] = useLocation();

  const handleCreateProject = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour créer un projet",
        variant: "default",
        action: (
          <Button 
            variant="outline" 
            onClick={() => navigate("/auth")}
            className="border-[#E9E6DD] bg-white text-[#212121]"
          >
            Connexion
          </Button>
        )
      });
      return;
    }
    
    // Show start dialog first
    setShowStartDialog(true);
  };
  
  const handleContentTypeSelect = (type: string) => {
    setContentType(type);
    setShowStartDialog(false);
    
    if (type === 'draft') {
      // Handle draft saving
      toast({
        title: "Projet sauvegardé",
        description: "Votre brouillon a été sauvegardé",
        variant: "default",
      });
      return;
    }
    
    // Proceed to the full screen upload
    setShowUpload(true);
  };

  return (
    <>
      <Button 
        onClick={handleCreateProject}
        className={`bg-[#0057FF] hover:bg-[#003ECC] text-white ${className}`}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Créer projet
      </Button>
      
      {showStartDialog && (
        <ProjectStartDialog 
          brief={brief}
          cardIds={cardIds}
          onSelect={handleContentTypeSelect}
          onCancel={() => setShowStartDialog(false)}
        />
      )}
      
      {showUpload && (
        <FullScreenUpload 
          brief={brief}
          cardIds={cardIds}
          contentType={contentType}
          onSuccess={() => {
            setShowUpload(false);
            navigate("/profile"); // Navigate to profile to see the created project
          }}
          onCancel={() => setShowUpload(false)}
        />
      )}
    </>
  );
}