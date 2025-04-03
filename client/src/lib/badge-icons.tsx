import {
  Lightbulb,
  Palette,
  PenTool,
  MessageCircle,
  Award,
  Zap,
  Star,
} from "lucide-react";

export function getBadgeIcon(iconName: string, className = "h-8 w-8") {
  switch (iconName) {
    case "lightbulb":
      return <Lightbulb className={className} />;
    case "palette":
      return <Palette className={className} />;
    case "pen-tool":
      return <PenTool className={className} />;
    case "message-circle":
      return <MessageCircle className={className} />;
    case "award":
      return <Award className={className} />;
    case "star":
      return <Zap className={className} />;
    default:
      return <Award className={className} />;
  }
} 