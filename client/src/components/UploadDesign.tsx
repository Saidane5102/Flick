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
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Loader2, Upload, Image, Sparkles, Info } from "lucide-react";

interface UploadDesignProps {
  brief: string;
  cardIds: number[];
  onSuccess?: () => void;
}

// Form validation schema
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
        throw new Error(await response.text());
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
        description: error.message,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Behance-style header */}
        <div className="mb-6 pb-4 border-b border-[#E9E6DD]">
          <h2 className="text-xl font-semibold text-[#212121] mb-2">Commencer la création de votre projet</h2>
          <p className="text-sm text-[#414141]">Créez, partagez et recevez des commentaires sur votre travail de conception</p>
        </div>
      
        {/* Design brief preview */}
        <div className="mb-6 p-4 bg-[#FAF9F7] border border-[#E9E6DD] rounded-[16px]">
          <div className="flex items-center mb-2">
            <Info className="h-4 w-4 text-[#212121] mr-2" />
            <Label className="text-sm font-medium text-[#212121]">Design Brief</Label>
          </div>
          <p className="text-sm text-[#414141] leading-relaxed">{brief}</p>
        </div>
        
        {/* Image upload */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#212121]">Upload Design Image</FormLabel>
              <FormControl>
                <div className="flex flex-col items-center space-y-4">
                  <div
                    className="w-full h-40 border-2 border-dashed border-[#E9E6DD] rounded-[16px] flex flex-col items-center justify-center cursor-pointer hover:bg-[#FAF9F7] transition-colors"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    {preview ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={preview} 
                          alt="Design preview" 
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                    ) : (
                      <>
                        <Image className="h-10 w-10 text-[#BBBBBB] mb-2" />
                        <p className="text-sm text-[#666666]">Click to upload your design image</p>
                        <p className="text-xs text-[#999999] mt-1">PNG, JPG or GIF, up to 5MB</p>
                      </>
                    )}
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        field.onChange(e.target.files);
                        handleImageChange(e.target.files);
                      }}
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#212121]">Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Give your design a title" 
                  className="border-[#E9E6DD] text-[#212121]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#212121]">Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your design process, challenges, and solutions..." 
                  className="resize-none min-h-[100px] border-[#E9E6DD] text-[#212121]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={uploadMutation.isPending}
            className="bg-[#0057FF] hover:bg-[#003ECC] text-white transition-colors"
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