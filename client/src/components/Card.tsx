import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CardCategory } from "@shared/schema";
import { Briefcase, FileText, Lock, Users, RefreshCw, Sparkles, Zap, Clock, Target, Globe } from "lucide-react";

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
        setCardIcon(<Briefcase className="h-8 w-8 stroke-[1.5]" />);
        setCardColor("memo-pink");
        setCardGradient("memo-gradient-pink");
        setBackIconColor("text-pink-600 bg-pink-50");
        setBorderColor("border-pink-200");
        break;
      case CardCategory.NEED:
        setCardIcon(<Target className="h-8 w-8 stroke-[1.5]" />);
        setCardColor("memo-orange");
        setCardGradient("memo-gradient-orange");
        setBackIconColor("text-orange-600 bg-orange-50");
        setBorderColor("border-orange-200");
        break;
      case CardCategory.CHALLENGE:
        setCardIcon(<Zap className="h-8 w-8 stroke-[1.5]" />);
        setCardColor("memo-purple");
        setCardGradient("memo-gradient-purple");
        setBackIconColor("text-indigo-600 bg-indigo-50");
        setBorderColor("border-indigo-200");
        break;
      case CardCategory.AUDIENCE:
        setCardIcon(<Globe className="h-8 w-8 stroke-[1.5]" />);
        setCardColor("memo-blue");
        setCardGradient("memo-gradient-blue");
        setBackIconColor("text-sky-600 bg-sky-50");
        setBorderColor("border-sky-200");
        break;
      default:
        setCardIcon(<Briefcase className="h-8 w-8 stroke-[1.5]" />);
        setCardColor("text-gray-600");
        setCardGradient("bg-gradient-to-br from-gray-400 to-gray-600");
        setBackIconColor("text-gray-600 bg-gray-50");
        setBorderColor("border-gray-200");
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
        className="card w-[220px] h-[340px] mx-auto rounded-md shadow-sm cursor-pointer relative transform transition-all duration-150 ease-out hover:shadow-md"
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
          <div className="flex flex-col items-center justify-center h-full">
            <div className="mb-5 bg-white/10 p-4 rounded-md">
              {cardIcon}
            </div>
            <h3 className="text-xl font-bold mb-2">{category}</h3>
            <p className="text-sm opacity-90 text-center mb-6">
              {category === CardCategory.CLIENT && "Who you're designing for"}
              {category === CardCategory.NEED && "What the client needs"}
              {category === CardCategory.CHALLENGE && "Design constraints"}
              {category === CardCategory.AUDIENCE && "Target demographic"}
            </p>
            <div className="flex items-center justify-center text-sm font-medium bg-white/10 px-3 py-2 rounded-md">
              <Sparkles className="h-4 w-4 mr-1.5" />
              <span>Click to reveal</span>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 opacity-20">
            <div className="h-12 w-12 rounded-full border border-white/30"></div>
          </div>
          <div className="absolute bottom-6 left-4 opacity-20">
            <div className="h-8 w-8 rounded-md border border-white/30"></div>
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
          <div className="flex items-center mb-4">
            <div className={`rounded-md w-fit p-2 mr-3 ${
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
            <div>
              <span className={`text-xs uppercase font-medium tracking-wider ${
                category === CardCategory.CLIENT 
                ? 'text-pink-600' 
                : category === CardCategory.NEED 
                ? 'text-orange-600' 
                : category === CardCategory.CHALLENGE 
                ? 'text-indigo-600' 
                : 'text-sky-600'
              }`}>
                {category}
              </span>
            </div>
          </div>
          
          <h4 className="text-lg font-bold text-gray-900 mb-3">{promptText}</h4>
          <div className="border-t border-gray-100 mb-3"></div>
          <div className="flex-1 overflow-auto custom-scrollbar mb-4">
            <p className="text-sm text-gray-600 leading-relaxed">{backContent}</p>
          </div>
          <button
            className="memo-button-outline text-sm flex items-center justify-center"
            onClick={handleReroll}
          >
            <RefreshCw className="h-4 w-4 mr-1.5" strokeWidth={1.5} />
            Reroll this card
          </button>
        </div>
      </div>
    </div>
  );
}
