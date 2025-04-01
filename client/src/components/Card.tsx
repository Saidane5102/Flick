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
        className="card w-[220px] h-[340px] mx-auto rounded-[20px] cursor-pointer relative transform transition-all duration-150 ease-out hover:translate-y-[-5px]"
        style={{
          ...flipCardStyle, 
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)", 
          transition: "all 0.3s ease"
        }}
        onClick={onFlip}
      >
        {/* Card Front - Memorisely Style */}
        <div
          className={`card-front absolute w-full h-full rounded-[20px] flex flex-col items-center justify-center p-6 text-white backface-hidden border border-[#E9E6DD]`}
          style={{ 
            background: 'linear-gradient(145deg, #313131, #212121)',
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
          }}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <div className="mb-5 bg-white/20 p-4 rounded-[10px] shadow-sm">
              {cardIcon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">{category}</h3>
            <p className="text-sm text-white/90 text-center mb-6">
              {category === CardCategory.CLIENT && "Who you're designing for"}
              {category === CardCategory.NEED && "What the client needs"}
              {category === CardCategory.CHALLENGE && "Design constraints"}
              {category === CardCategory.AUDIENCE && "Target demographic"}
            </p>
            <div className="flex items-center justify-center text-sm font-medium bg-white/20 px-4 py-2 rounded-[8px] shadow-sm hover:bg-white/25 transition-colors">
              <Sparkles className="h-4 w-4 mr-1.5 text-white" />
              <span className="text-white">Click to reveal</span>
            </div>
          </div>
          
          {/* Decorative elements - Bento UI inspired */}
          <div className="absolute top-4 right-4 opacity-30">
            <div className="h-12 w-12 rounded-full border-2 border-white/40"></div>
          </div>
          <div className="absolute bottom-6 left-4 opacity-30">
            <div className="h-8 w-8 rounded-[8px] border-2 border-white/40"></div>
          </div>
        </div>

        {/* Card Back - Memorisely Style */}
        <div
          className={`card-back absolute w-full h-full rounded-[20px] flex flex-col p-6 backface-hidden`}
          style={{ 
            transform: "rotateY(180deg)",
            backgroundColor: "#FAF9F7",
            border: "1px solid #E9E6DD",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)"
          }}
        >
          <div className="flex items-center mb-4">
            <div className="rounded-[8px] w-fit p-2 mr-3 bg-[#E9E6DD] text-[#212121] shadow-sm">
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
            className="bg-[#212121] text-white text-sm flex items-center justify-center py-2.5 px-4 rounded-[8px] hover:bg-black transition-colors shadow-sm"
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
