import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, insertCardSchema, CardCategory, DifficultyLevel } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { z } from "zod";

interface CardFormProps {
  card: Card | null;
  onClose: (refresh?: boolean) => void;
}

// Extend the schema for validation
const cardFormSchema = insertCardSchema.extend({
  backContent: z.string().min(1, "AI content is required"),
});

type CardFormValues = z.infer<typeof cardFormSchema>;

export default function CardForm({ card, onClose }: CardFormProps) {
  const { toast } = useToast();

  // Set up the form with default values
  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      category: card?.category || CardCategory.CLIENT,
      promptText: card?.promptText || "",
      backContent: card?.backContent || "",
      difficulty: card?.difficulty || DifficultyLevel.BEGINNER,
    },
  });

  // Create card mutation
  const createMutation = useMutation({
    mutationFn: async (data: CardFormValues) => {
      const response = await fetch("/api/admin/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create card");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Card created successfully",
      });
      onClose(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update card mutation
  const updateMutation = useMutation({
    mutationFn: async (data: CardFormValues) => {
      if (!card) throw new Error("No card to update");
      
      const response = await fetch(`/api/admin/cards/${card.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update card");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Card updated successfully",
      });
      onClose(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (values: CardFormValues) => {
    if (card) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={CardCategory.CLIENT}>{CardCategory.CLIENT}</SelectItem>
                  <SelectItem value={CardCategory.NEED}>{CardCategory.NEED}</SelectItem>
                  <SelectItem value={CardCategory.CHALLENGE}>{CardCategory.CHALLENGE}</SelectItem>
                  <SelectItem value={CardCategory.AUDIENCE}>{CardCategory.AUDIENCE}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="promptText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt Text</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the card prompt"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="backContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter AI-generated content or tips"
                  rows={5}
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={DifficultyLevel.BEGINNER}>{DifficultyLevel.BEGINNER}</SelectItem>
                  <SelectItem value={DifficultyLevel.INTERMEDIATE}>{DifficultyLevel.INTERMEDIATE}</SelectItem>
                  <SelectItem value={DifficultyLevel.ADVANCED}>{DifficultyLevel.ADVANCED}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onClose()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {card ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {card ? "Update Card" : "Create Card"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
