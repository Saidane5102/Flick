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
        setCardIcon(<Briefcase className="h-7 w-7 stroke-[1.5]" />);
        setCardColor("memo-primary");
        setCardGradient("memo-gradient-dark");
        setBackIconColor("text-gray-800 bg-gray-100");
        setBorderColor("border-gray-200");
        break;
      case CardCategory.NEED:
        setCardIcon(<Target className="h-7 w-7 stroke-[1.5]" />);
        setCardColor("memo-primary");
        setCardGradient("memo-gradient-dark");
        setBackIconColor("text-gray-800 bg-gray-100");
        setBorderColor("border-gray-200");
        break;
      case CardCategory.CHALLENGE:
        setCardIcon(<Zap className="h-7 w-7 stroke-[1.5]" />);
        setCardColor("memo-primary");
        setCardGradient("memo-gradient-dark");
        setBackIconColor("text-gray-800 bg-gray-100");
        setBorderColor("border-gray-200");
        break;
      case CardCategory.AUDIENCE:
        setCardIcon(<Globe className="h-7 w-7 stroke-[1.5]" />);
        setCardColor("memo-primary");
        setCardGradient("memo-gradient-dark");
        setBackIconColor("text-gray-800 bg-gray-100");
        setBorderColor("border-gray-200");
        break;
      default:
        setCardIcon(<Briefcase className="h-7 w-7 stroke-[1.5]" />);
        setCardColor("memo-primary");
        setCardGradient("memo-gradient-dark");
        setBackIconColor("text-gray-800 bg-gray-100");
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
        className="card w-[220px] h-[340px] mx-auto rounded-[20px] cursor-pointer relative transform transition-all duration-150 ease-out"
        style={{...flipCardStyle, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)"}}
        onClick={onFlip}
      >
        {/* Card Front - Memorisely Style */}
        <div
          className={`card-front absolute w-full h-full rounded-[20px] flex flex-col items-center justify-center p-6 text-white backface-hidden border border-gray-800/5`}
          style={{ background: '#212121' }}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <div className="mb-5 bg-white/10 p-4 rounded-[10px]">
              {cardIcon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{category}</h3>
            <p className="text-sm opacity-90 text-center mb-6">
              {category === CardCategory.CLIENT && "Who you're designing for"}
              {category === CardCategory.NEED && "What the client needs"}
              {category === CardCategory.CHALLENGE && "Design constraints"}
              {category === CardCategory.AUDIENCE && "Target demographic"}
            </p>
            <div className="flex items-center justify-center text-sm font-medium bg-white/10 px-3 py-2 rounded-[8px]">
              <Sparkles className="h-4 w-4 mr-1.5" />
              <span>Click to reveal</span>
            </div>
          </div>
          
          {/* Decorative elements - Bento UI inspired */}
          <div className="absolute top-4 right-4 opacity-20">
            <div className="h-12 w-12 rounded-full border border-white/30"></div>
          </div>
          <div className="absolute bottom-6 left-4 opacity-20">
            <div className="h-8 w-8 rounded-[8px] border border-white/30"></div>
          </div>
        </div>

        {/* Card Back - Memorisely Style */}
        <div
          className={`card-back absolute w-full h-full rounded-[20px] flex flex-col p-6 backface-hidden shadow-sm`}
          style={{ 
            transform: "rotateY(180deg)",
            backgroundColor: "#FAF9F7",
            border: "1px solid #E9E6DD"
          }}
        >
          <div className="flex items-center mb-4">
            <div className="rounded-[8px] w-fit p-2 mr-3 bg-[#E9E6DD] text-[#212121]">
              {cardIcon}
            </div>
            <div>
              <span className="text-xs uppercase font-medium tracking-wider text-[#212121]">
                {category}
              </span>
            </div>
          </div>
          
          <h4 className="font-semibold text-lg text-[#212121] mb-3">{promptText}</h4>
          <div className="border-t border-[#E9E6DD] mb-3"></div>
          <div className="flex-1 overflow-auto custom-scrollbar mb-4">
            <p className="text-sm text-[#414141] leading-[20px]">{backContent}</p>
          </div>
          <button
            className="bg-[#212121] text-white text-sm flex items-center justify-center py-2 px-4 rounded-[8px] hover:bg-black transition-colors"
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
