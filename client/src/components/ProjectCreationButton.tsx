import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import FullScreenUpload from "./FullScreenUpload";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface ProjectCreationButtonProps {
  brief: string;
  cardIds: number[];
  className?: string;
}

export default function ProjectCreationButton({ brief, cardIds, className = "" }: ProjectCreationButtonProps) {
  const [showUpload, setShowUpload] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [_, navigate] = useLocation();

  const handleCreateProject = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a project",
        variant: "default",
        action: (
          <Button 
            variant="outline" 
            onClick={() => navigate("/auth")}
            className="border-[#E9E6DD] bg-white text-[#212121]"
          >
            Sign in
          </Button>
        )
      });
      return;
    }
    
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
      
      {showUpload && (
        <FullScreenUpload 
          brief={brief}
          cardIds={cardIds}
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