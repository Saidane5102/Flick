import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CardCategory } from "@shared/schema";
import { Briefcase, FileText, Lock, Users, RefreshCw, Sparkles } from "lucide-react";

interface CardProps {
  id: number;
  category: string;
  promptText: string;
  backContent: string;
  isFlipped: boolean;
  onFlip: () => void;
  onReroll: () => void;
  reduceMotion: boolean;
}

export default function Card({
  id,
  category,
  promptText,
  backContent,
  isFlipped,
  onFlip,
  onReroll,
  reduceMotion,
}: CardProps) {
  const [cardIcon, setCardIcon] = useState<React.ReactNode | null>(null);
  const [cardColor, setCardColor] = useState("");
  const [cardGradient, setCardGradient] = useState("");
  const [backIconColor, setBackIconColor] = useState("");
  const [borderColor, setBorderColor] = useState("");

  useEffect(() => {
    switch (category) {
      case CardCategory.CLIENT:
        setCardIcon(<Briefcase className="h-10 w-10" />);
        setCardColor("from-teal-400 to-teal-600");
        setCardGradient("bg-gradient-to-br from-teal-500 via-teal-400 to-teal-600");
        setBackIconColor("text-teal-500 bg-teal-50");
        setBorderColor("border-teal-300");
        break;
      case CardCategory.NEED:
        setCardIcon(<FileText className="h-10 w-10" />);
        setCardColor("from-orange-400 to-orange-600");
        setCardGradient("bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600");
        setBackIconColor("text-orange-500 bg-orange-50");
        setBorderColor("border-orange-300");
        break;
      case CardCategory.CHALLENGE:
        setCardIcon(<Lock className="h-10 w-10" />);
        setCardColor("from-purple-400 to-purple-600");
        setCardGradient("bg-gradient-to-br from-purple-500 via-purple-400 to-purple-600");
        setBackIconColor("text-purple-500 bg-purple-50");
        setBorderColor("border-purple-300");
        break;
      case CardCategory.AUDIENCE:
        setCardIcon(<Users className="h-10 w-10" />);
        setCardColor("from-emerald-400 to-emerald-600");
        setCardGradient("bg-gradient-to-br from-emerald-500 via-emerald-400 to-emerald-600");
        setBackIconColor("text-emerald-500 bg-emerald-50");
        setBorderColor("border-emerald-300");
        break;
      default:
        setCardIcon(<Briefcase className="h-10 w-10" />);
        setCardColor("from-gray-400 to-gray-600");
        setCardGradient("bg-gradient-to-br from-gray-500 via-gray-400 to-gray-600");
        setBackIconColor("text-gray-500 bg-gray-50");
        setBorderColor("border-gray-300");
    }
  }, [category]);

  // Use CSS transforms for non-motion preference
  const flipCardStyle = {
    transform: isFlipped && !reduceMotion ? "rotateY(180deg)" : "rotateY(0deg)",
    transition: reduceMotion ? "none" : "transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)",
    transformStyle: "preserve-3d" as const,
  };

  const handleReroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReroll();
  };

  return (
    <div className="card-container perspective-1000 group">
      <div
        className="card w-[220px] h-[340px] mx-auto rounded-2xl shadow-lg hover:shadow-xl cursor-pointer relative transform transition-all duration-300 ease-out hover:-translate-y-1"
        style={flipCardStyle}
        onClick={onFlip}
      >
        {/* Card Front */}
        <div
          className={`card-front absolute w-full h-full rounded-2xl ${cardGradient} flex flex-col items-center justify-center p-6 text-white backface-hidden border-2 border-white/20 backdrop-blur-sm`}
        >
          <div className="mb-4 bg-white/20 p-4 rounded-full backdrop-blur-sm">
            {cardIcon}
          </div>
          <h3 className="text-2xl font-bold tracking-tight">{category}</h3>
          <p className="text-sm mt-2 opacity-90 text-center">
            {category === CardCategory.CLIENT && "Who you're designing for"}
            {category === CardCategory.NEED && "What the client wants"}
            {category === CardCategory.CHALLENGE && "Design constraints"}
            {category === CardCategory.AUDIENCE && "Target demographic"}
          </p>
          <div className="mt-6 flex items-center text-sm font-medium">
            <Sparkles className="h-4 w-4 mr-1.5 animate-pulse" />
            <span>Click to reveal</span>
          </div>
        </div>

        {/* Card Back */}
        <div
          className={`card-back absolute w-full h-full rounded-2xl bg-white flex flex-col p-7 backface-hidden border ${borderColor} shadow-md`}
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className={`p-3.5 rounded-full w-fit mb-4 ${backIconColor}`}>
            {cardIcon}
          </div>
          <h4 className="text-xl font-bold text-gray-800 tracking-tight">{promptText}</h4>
          <div className={`border-t ${borderColor} my-3`}></div>
          <div className="flex-1 overflow-auto custom-scrollbar">
            <p className="text-sm text-gray-600 leading-relaxed">{backContent}</p>
          </div>
          <button
            className={`reroll-btn mt-4 text-sm font-medium flex items-center justify-center py-2 rounded-lg transition-colors hover:bg-gray-50 ${backIconColor.replace('bg-', 'hover:bg-')}`}
            onClick={handleReroll}
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Reroll this card
          </button>
        </div>
      </div>
    </div>
  );
}
