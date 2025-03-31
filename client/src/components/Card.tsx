import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CardCategory } from "@shared/schema";
import { Briefcase, FileText, Lock, Users, RefreshCw } from "lucide-react";

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
  const [backIconColor, setBackIconColor] = useState("");

  useEffect(() => {
    switch (category) {
      case CardCategory.CLIENT:
        setCardIcon(<Briefcase className="h-10 w-10" />);
        setCardColor("from-teal-400 to-teal-600");
        setBackIconColor("text-teal-500 bg-teal-50");
        break;
      case CardCategory.NEED:
        setCardIcon(<FileText className="h-10 w-10" />);
        setCardColor("from-orange-400 to-orange-600");
        setBackIconColor("text-orange-500 bg-orange-50");
        break;
      case CardCategory.CHALLENGE:
        setCardIcon(<Lock className="h-10 w-10" />);
        setCardColor("from-purple-400 to-purple-600");
        setBackIconColor("text-purple-500 bg-purple-50");
        break;
      case CardCategory.AUDIENCE:
        setCardIcon(<Users className="h-10 w-10" />);
        setCardColor("from-emerald-400 to-emerald-600");
        setBackIconColor("text-emerald-500 bg-emerald-50");
        break;
      default:
        setCardIcon(<Briefcase className="h-10 w-10" />);
        setCardColor("from-gray-400 to-gray-600");
        setBackIconColor("text-gray-500 bg-gray-50");
    }
  }, [category]);

  // Use CSS transforms for non-motion preference
  const flipCardStyle = {
    transform: isFlipped && !reduceMotion ? "rotateY(180deg)" : "rotateY(0deg)",
    transition: reduceMotion ? "none" : "transform 0.8s",
    transformStyle: "preserve-3d" as const,
  };

  const handleReroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReroll();
  };

  return (
    <div className="card-container perspective-1000">
      <div
        className="card w-[200px] h-[300px] mx-auto rounded-xl shadow-md hover:shadow-lg cursor-pointer relative"
        style={flipCardStyle}
        onClick={onFlip}
      >
        {/* Card Front */}
        <div
          className={`card-front absolute w-full h-full rounded-xl bg-gradient-to-br ${cardColor} flex flex-col items-center justify-center p-6 text-white backface-hidden`}
        >
          <div className="mb-4 bg-white/20 p-3 rounded-full">
            {cardIcon}
          </div>
          <h3 className="text-2xl font-bold">{category}</h3>
          <p className="text-sm mt-2 opacity-80">
            {category === CardCategory.CLIENT && "Who you're designing for"}
            {category === CardCategory.NEED && "What the client wants"}
            {category === CardCategory.CHALLENGE && "Design constraints"}
            {category === CardCategory.AUDIENCE && "Target demographic"}
          </p>
          <div className="mt-6 text-sm">Click to reveal</div>
        </div>

        {/* Card Back */}
        <div
          className="card-back absolute w-full h-full rounded-xl bg-white flex flex-col p-6 backface-hidden"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className={`p-3 rounded-full w-fit mb-3 ${backIconColor}`}>
            {cardIcon}
          </div>
          <h4 className="text-xl font-bold text-gray-800">{promptText}</h4>
          <div className="border-t border-gray-200 my-3"></div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">{backContent}</p>
          </div>
          <button
            className="reroll-btn mt-4 text-sm text-primary hover:text-primary-dark flex items-center justify-center"
            onClick={handleReroll}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Reroll this card
          </button>
        </div>
      </div>
    </div>
  );
}
