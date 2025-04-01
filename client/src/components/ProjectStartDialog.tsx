import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  Image as ImageIcon, 
  Type, 
  LayoutGrid, 
  Video, 
  Code, 
  ScanLine, 
  Shapes,
  Box,
  ChevronRight,
  Paperclip,
  X
} from "lucide-react";

interface ProjectStartDialogProps {
  onSelect: (type: string) => void;
  onCancel: () => void;
  brief: string;
  cardIds: number[];
}

export default function ProjectStartDialog({ onSelect, onCancel, brief, cardIds }: ProjectStartDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  const handleSelect = (type: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour créer un projet",
        variant: "destructive",
      });
      return;
    }
    
    onSelect(type);
  };
  
  const contentTypes = [
    { id: 'image', icon: <ImageIcon className="h-6 w-6" />, label: 'Image' },
    { id: 'text', icon: <Type className="h-6 w-6" />, label: 'Texte' },
    { id: 'grid', icon: <LayoutGrid className="h-6 w-6" />, label: 'Grille de photos' },
    { id: 'video', icon: <Video className="h-6 w-6" />, label: 'Vidéo et audio' },
    { id: 'code', icon: <Code className="h-6 w-6" />, label: 'Intégrer' },
    { id: 'lightroom', icon: <ScanLine className="h-6 w-6" />, label: 'Lightroom' },
    { id: 'prototype', icon: <Shapes className="h-6 w-6" />, label: 'Prototype' },
    { id: '3d', icon: <Box className="h-6 w-6" />, label: '3D' },
  ];

  return (
    <div className="fixed inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-6">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="rounded-full"
          aria-label="Fermer"
        >
          <X className="h-5 w-5 text-[#212121]" />
        </Button>
      </div>
      
      <div className="max-w-4xl mx-auto w-full bg-white rounded-lg p-8 text-center space-y-12">
        <h2 className="text-2xl font-medium text-[#212121]">Commencer la création de votre projet :</h2>
        
        <div className="grid grid-cols-4 gap-6">
          {contentTypes.map((type) => (
            <div
              key={type.id}
              className="flex flex-col items-center"
              onMouseEnter={() => setHoveredItem(type.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <button
                onClick={() => handleSelect(type.id)}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                  hoveredItem === type.id ? 'bg-[#2557FF] text-white' : 'bg-[#F5F5F8] text-[#212121]'
                }`}
                aria-label={`Créer un projet avec ${type.label}`}
              >
                {type.icon}
              </button>
              <span className="mt-3 text-sm font-medium text-[#212121]">{type.label}</span>
            </div>
          ))}
        </div>
        
        <div className="space-y-4 pt-4 max-w-lg mx-auto">
          <div className="border border-[#E9E6DD] rounded-lg p-4 bg-[#FAF9F7]">
            <h3 className="text-sm font-medium text-[#212121] mb-2">Joindre des ressources</h3>
            <div className="flex items-center justify-center border-2 border-dashed border-[#E9E6DD] rounded-lg p-4 bg-white">
              <div className="text-center">
                <Paperclip className="h-5 w-5 text-[#AAAAAA] mx-auto mb-2" />
                <p className="text-xs text-[#696969] max-w-xs">
                  Ajouter des fichiers téléchargeables gratuitement ou après paiement tels que des photos, des archives ZIP ou des modèles.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-[#E9E6DD] hover:bg-[#F5F5F5] text-[#414141]"
              onClick={onCancel}
            >
              Annuler
            </Button>
            <Button
              type="button"
              className="bg-[#2557FF] hover:bg-[#1D44CC] text-white"
              onClick={() => handleSelect('image')}
            >
              Continuer
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex justify-center">
            <Button
              type="button"
              variant="ghost"
              className="text-[#696969] text-xs hover:bg-transparent hover:text-[#212121]"
              onClick={() => handleSelect('draft')}
            >
              Enregistrer comme brouillon
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}