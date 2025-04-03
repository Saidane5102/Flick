import { useState } from "react";
import { Badge } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Lightbulb,
  Palette,
  PenTool,
  MessageCircle,
  Award,
  Zap,
  Star,
} from "lucide-react";

interface BadgeFormProps {
  badge?: Badge;
  onSubmit: (data: Partial<Badge>) => Promise<void>;
  onCancel: () => void;
}

const iconOptions = [
  { value: "lightbulb", label: "Lightbulb", icon: Lightbulb },
  { value: "palette", label: "Palette", icon: Palette },
  { value: "pen-tool", label: "Pen Tool", icon: PenTool },
  { value: "message-circle", label: "Message Circle", icon: MessageCircle },
  { value: "award", label: "Award", icon: Award },
  { value: "star", label: "Star", icon: Zap },
];

export default function BadgeForm({ badge, onSubmit, onCancel }: BadgeFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Badge>>({
    name: badge?.name || "",
    description: badge?.description || "",
    icon: badge?.icon || "award",
    requiredCount: badge?.requiredCount || 1,
    points: badge?.points || 50,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      toast({
        title: "Success",
        description: badge ? "Badge updated successfully" : "Badge created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save badge",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Badge Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter badge name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter badge description"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Icon</Label>
        <Select
          value={formData.icon}
          onValueChange={(value) => setFormData({ ...formData, icon: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an icon" />
          </SelectTrigger>
          <SelectContent>
            {iconOptions.map((option) => {
              const Icon = option.icon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="requiredCount">Required Count</Label>
          <Input
            id="requiredCount"
            type="number"
            min="1"
            value={formData.requiredCount}
            onChange={(e) => setFormData({ ...formData, requiredCount: parseInt(e.target.value) })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="points">Points</Label>
          <Input
            id="points"
            type="number"
            min="0"
            value={formData.points}
            onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-gray-200"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting ? "Saving..." : badge ? "Update Badge" : "Create Badge"}
        </Button>
      </div>
    </form>
  );
} 