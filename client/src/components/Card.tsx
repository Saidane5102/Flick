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
        className="card w-[220px] h-[340px] mx-auto rounded-md shadow-sm cursor-pointer relative transform transition-all duration-200 ease-out hover:shadow"
        style={flipCardStyle}
        onClick={onFlip}
      >
        {/* Card Front - Memorisely Style */}
        <div
          className={`card-front absolute w-full h-full rounded-md flex flex-col items-center justify-center p-6 text-white backface-hidden border border-white/10`}
          style={{ background: category === CardCategory.CLIENT 
            ? 'linear-gradient(135deg, #F37485 0%, #E93C67 100%)' 
            : category === CardCategory.NEED 
            ? 'linear-gradient(135deg, #FF8669 0%, #FF5E3A 100%)' 
            : category === CardCategory.CHALLENGE 
            ? 'linear-gradient(135deg, #9181F4 0%, #5038ED 100%)' 
            : 'linear-gradient(135deg, #40C8E0 0%, #2BA4BE 100%)' }}
        >
          <div className="mb-4 bg-white/10 p-4 rounded-full">
            {cardIcon}
          </div>
          <h3 className="text-xl font-bold">{category}</h3>
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

        {/* Card Back - Memorisely Style */}
        <div
          className={`card-back absolute w-full h-full rounded-md bg-white flex flex-col p-6 backface-hidden border-t-4 border border-gray-100 shadow-sm`}
          style={{ 
            transform: "rotateY(180deg)",
            borderTopColor: category === CardCategory.CLIENT 
              ? '#E93C67' 
              : category === CardCategory.NEED 
              ? '#FF5E3A' 
              : category === CardCategory.CHALLENGE 
              ? '#5038ED' 
              : '#2BA4BE'
          }}
        >
          <div className={`rounded-md w-fit mb-4 p-2 ${
            category === CardCategory.CLIENT 
            ? 'bg-pink-50 text-pink-600' 
            : category === CardCategory.NEED 
            ? 'bg-orange-50 text-orange-600' 
            : category === CardCategory.CHALLENGE 
            ? 'bg-indigo-50 text-indigo-600' 
            : 'bg-sky-50 text-sky-600'
          }`}>
            {cardIcon}
          </div>
          <h4 className="text-lg font-bold text-gray-900">{promptText}</h4>
          <div className="border-t border-gray-100 my-3"></div>
          <div className="flex-1 overflow-auto custom-scrollbar">
            <p className="text-sm text-gray-600 leading-relaxed">{backContent}</p>
          </div>
          <button
            className="memo-button-outline mt-4 text-sm flex items-center justify-center"
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
