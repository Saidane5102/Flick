import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Upload } from "lucide-react";

interface UploadDesignProps {
  brief: string;
  cardIds: number[];
  onSuccess?: () => void;
}

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title cannot exceed 100 characters"),
  description: z.string().optional(),
  image: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Image is required")
    .refine(
      (files) => Array.from(files).every((file) => file.size <= 5 * 1024 * 1024),
      "Each file must be less than 5MB"
    )
    .refine(
      (files) => Array.from(files).every((file) => file.type.startsWith("image/")),
      "Only image files are allowed"
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function UploadDesign({ brief, cardIds, onSuccess }: UploadDesignProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/designs", {
        method: "POST",
        credentials: "include",
        body: data,
      });
      
      if (!response.ok) {
        throw new Error(await response.text() || "Failed to upload design");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Design uploaded successfully",
        description: "Your design has been shared with the community",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your design",
        variant: "destructive",
      });
    },
  });

  const handleImageChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const onSubmit = (values: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload designs",
        variant: "destructive",
      });
      return;
    }
    
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description || "");
    formData.append("brief", brief);
    formData.append("cardIds", JSON.stringify(cardIds));
    
    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
    }
    
    uploadMutation.mutate(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a title for your design" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any details about your design approach"
                  className="resize-none h-20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, value, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Upload Image (max 5MB)</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      onChange(e.target.files);
                      handleImageChange(e.target.files);
                    }}
                    {...fieldProps}
                  />
                  
                  {preview && (
                    <div className="relative mt-2 h-40 w-full overflow-hidden rounded-md">
                      <img
                        src={preview}
                        alt="Preview"
                        className="object-contain w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="pt-2">
          <Label className="font-medium text-gray-600">Design Brief:</Label>
          <p className="text-sm bg-gray-50 p-2 rounded-md mt-1">{brief}</p>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={uploadMutation.isPending}
            className="bg-primary hover:bg-primary-dark text-white"
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Design
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
