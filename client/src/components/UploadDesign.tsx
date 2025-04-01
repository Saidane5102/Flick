import { useState, useRef, useEffect } from "react";
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
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { 
  Loader2, 
  Upload, 
  Image as ImageIcon, 
  Tag, 
  X, 
  Check, 
  Info, 
  AlertCircle, 
  ChevronRight 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UploadDesignProps {
  brief: string;
  cardIds: number[];
  onSuccess?: () => void;
}

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title cannot exceed 100 characters"),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  imageAltText: z.string().optional(),
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);
  
  // For accessibility focus management
  const [lastErrorField, setLastErrorField] = useState<string | null>(null);
  const errorRefs = {
    title: useRef<HTMLDivElement>(null),
    image: useRef<HTMLDivElement>(null),
    tags: useRef<HTMLDivElement>(null),
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      imageAltText: "",
    },
  });
  
  // Focus first error on submission
  useEffect(() => {
    if (lastErrorField && errorRefs[lastErrorField as keyof typeof errorRefs]?.current) {
      errorRefs[lastErrorField as keyof typeof errorRefs].current?.focus();
      setLastErrorField(null);
    }
  }, [lastErrorField]);

  // Simulate upload progress
  useEffect(() => {
    if (isUploading && uploadProgress < 100) {
      const timer = setTimeout(() => {
        setUploadProgress(prev => {
          const next = prev + 5;
          return next > 95 ? 95 : next;
        });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isUploading, uploadProgress]);

  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      setIsUploading(true);
      setUploadProgress(0);
      
      const response = await fetch("/api/designs", {
        method: "POST",
        credentials: "include",
        body: data,
      });
      
      // Complete the progress bar
      setUploadProgress(100);
      
      if (!response.ok) {
        throw new Error(await response.text() || "Failed to upload design");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Design published successfully",
        description: "Your design has been shared with the community",
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      setIsUploading(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your design",
        variant: "destructive",
      });
      
      setIsUploading(false);
    },
  });

  const handleImageChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        
        // Announce image selection to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.textContent = `Image selected: ${file.name}`;
        document.body.appendChild(announcement);
        setTimeout(() => document.body.removeChild(announcement), 1000);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
      
      // Announce tag added to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = `Tag added: ${trimmedTag}`;
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 500);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
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
    formData.append("tags", JSON.stringify(tags));
    formData.append("imageAltText", values.imageAltText || "");
    
    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
    }
    
    uploadMutation.mutate(formData);
  };

  const selectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
        
        {/* Behance-style content selection */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-[#212121] mb-4">Ajouter contenu</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="relative flex flex-col items-center justify-center border border-[#E9E6DD] rounded-[8px] py-4 px-2 hover:border-[#CDCDCD] transition-colors bg-[#FAF9F7] cursor-pointer">
              <div className="w-8 h-8 flex items-center justify-center mb-2">
                <ImageIcon className="w-6 h-6 text-[#212121]" />
              </div>
              <span className="text-xs text-center text-[#212121]">Image</span>
            </div>
            <div className="relative flex flex-col items-center justify-center border border-[#E9E6DD] rounded-[8px] py-4 px-2 hover:border-[#CDCDCD] transition-colors bg-[#FAF9F7] cursor-pointer opacity-50">
              <div className="w-8 h-8 flex items-center justify-center mb-2">
                <span className="text-[#212121] font-semibold">T</span>
              </div>
              <span className="text-xs text-center text-[#212121]">Texte</span>
            </div>
            <div className="relative flex flex-col items-center justify-center border border-[#E9E6DD] rounded-[8px] py-4 px-2 hover:border-[#CDCDCD] transition-colors bg-[#FAF9F7] cursor-pointer opacity-50">
              <div className="w-8 h-8 flex items-center justify-center mb-2">
                <div className="grid grid-cols-2 gap-1">
                  <div className="w-2.5 h-2.5 bg-[#CDCDCD]"></div>
                  <div className="w-2.5 h-2.5 bg-[#CDCDCD]"></div>
                  <div className="w-2.5 h-2.5 bg-[#CDCDCD]"></div>
                  <div className="w-2.5 h-2.5 bg-[#CDCDCD]"></div>
                </div>
              </div>
              <span className="text-xs text-center text-[#212121]">Grille photo</span>
            </div>
            <div className="relative flex flex-col items-center justify-center border border-[#E9E6DD] rounded-[8px] py-4 px-2 hover:border-[#CDCDCD] transition-colors bg-[#FAF9F7] cursor-pointer opacity-50">
              <div className="w-8 h-8 flex items-center justify-center mb-2">
                <div className="rounded-full w-5 h-5 border-2 border-[#CDCDCD] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#CDCDCD] rounded-full"></div>
                </div>
              </div>
              <span className="text-xs text-center text-[#212121]">Vidéo/Audio</span>
            </div>
          </div>
        </div>
        
        {/* Upload area - follows Behance style */}
        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, value, ...fieldProps } }) => (
            <FormItem>
              <FormLabel className="text-[#212121] font-medium">
                Upload Design 
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="ml-1 cursor-help">
                        <Info className="h-3.5 w-3.5 inline text-[#414141]" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">Upload your design as an image file (PNG, JPG or SVG)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormDescription className="text-xs text-[#414141]">
                Accepted formats: JPG, PNG, GIF (max 5MB)
              </FormDescription>
              <FormControl>
                <div className="space-y-3">
                  <div className="relative" ref={errorRefs.image}>
                    {!preview ? (
                      <div className="border-2 border-dashed border-[#E9E6DD] rounded-[16px] bg-[#FAF9F7] p-10 flex flex-col items-center justify-center">
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          id="file-upload"
                          aria-label="Upload Design Image"
                          onChange={(e) => {
                            onChange(e.target.files);
                            handleImageChange(e.target.files);
                          }}
                          {...fieldProps}
                        />
                        <ImageIcon className="h-16 w-16 text-[#414141] mb-4" />
                        <p className="text-[#212121] font-medium mb-2">
                          Drag and drop an image here
                        </p>
                        <div className="flex items-center justify-center text-sm text-[#414141]">
                          <span className="text-center">
                            or 
                            <Button 
                              type="button" 
                              variant="ghost" 
                              className="px-2 py-1 h-auto underline text-[#212121]"
                              onClick={selectFile}
                            >
                              browse files
                            </Button>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-[16px] overflow-hidden border border-[#E9E6DD] bg-white">
                        <div className="relative">
                          <img
                            src={preview}
                            alt="Design preview"
                            className="w-full object-contain"
                            style={{ maxHeight: "400px" }}
                          />
                          <div className="absolute top-3 right-3 flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="h-8 px-2 bg-white shadow-sm hover:bg-[#F5F5F5]"
                              onClick={selectFile}
                              aria-label="Change image"
                            >
                              Change
                            </Button>
                          </div>
                        </div>
                        {/* Hidden file input for the change button */}
                        <div 
                          id="file-upload-hidden-container"
                          className="hidden"
                        >
                          <input
                            id="file-upload-hidden"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            aria-label="Upload Design Image"
                            onChange={(e) => {
                              onChange(e.target.files);
                              handleImageChange(e.target.files);
                            }}
                            {...fieldProps}
                            ref={fileInputRef}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Alt text for accessibility */}
                  {preview && (
                    <FormField
                      control={form.control}
                      name="imageAltText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-[#212121]">
                            Image Alt Text
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="ml-1 cursor-help">
                                    <Info className="h-3.5 w-3.5 inline text-[#414141]" />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs text-xs">
                                    Alt text helps people using screen readers understand your image
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Describe your design for visually impaired users"
                              className="border-[#E9E6DD] text-[#212121]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Project Details */}
        <div className="space-y-5 pt-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#212121] font-medium">Project Title</FormLabel>
                <FormControl>
                  <Input 
                    className="border-[#E9E6DD] text-[#212121]" 
                    placeholder="Enter a title for your design" 
                    {...field} 
                    aria-label="Project Title"
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage tabIndex={-1} />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#212121] font-medium">Description</FormLabel>
                <FormDescription className="text-xs text-[#414141]">
                  Tell us about your design process, tools used, and challenges you overcame
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="Add details about your design approach and techniques used..."
                    className="resize-none min-h-[120px] leading-relaxed border-[#E9E6DD] text-[#212121]"
                    {...field}
                    aria-label="Project Description"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Tags input */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-[#212121] font-medium">
              Tags
              <span className="text-[#414141] font-normal ml-1">(Optional, max 5)</span>
            </Label>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="relative flex-1">
                  <Input
                    ref={tagInputRef}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    onBlur={addTag}
                    placeholder="Add tags separated by commas or press Enter"
                    className="border-[#E9E6DD] text-[#212121] pr-16"
                    id="tags"
                    aria-label="Add Tags"
                    maxLength={30}
                    disabled={tags.length >= 5}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    disabled={!tagInput.trim() || tags.length >= 5}
                    className="absolute right-1 top-1 h-8 px-2 bg-[#EDEDED] hover:bg-[#DEDEDE] text-[#212121]"
                    aria-label="Add Tag"
                  >
                    Add
                  </Button>
                </div>
              </div>
              
              {/* Tags display */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2" aria-live="polite" aria-label="Selected tags">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="py-1.5 px-3 bg-[#F5F5F5] text-[#212121] border-[#E9E6DD]">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(tag)}
                        className="h-4 w-4 p-0 ml-1 text-[#414141] hover:text-[#212121] hover:bg-transparent"
                        aria-label={`Remove tag ${tag}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Upload status area - shows during upload */}
        {isUploading && (
          <div className="mt-4 p-4 bg-[#FAF9F7] border border-[#E9E6DD] rounded-[16px]" aria-live="polite">
            <div className="flex items-center mb-2">
              <Loader2 className="animate-spin h-4 w-4 text-[#212121] mr-2" />
              <p className="text-sm font-medium text-[#212121]">
                Uploading design... {uploadProgress}%
              </p>
            </div>
            <Progress value={uploadProgress} className="h-2 bg-[#E9E6DD]" indicatorClassName="bg-[#212121]" />
          </div>
        )}
        
        {/* Success message */}
        {uploadProgress === 100 && !isUploading && (
          <div className="mt-4 p-4 bg-[#F5FFF5] border border-green-200 rounded-[16px] text-green-800" aria-live="polite">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-sm font-medium">
                Design published successfully!
              </p>
            </div>
          </div>
        )}
        
        {/* Error message area */}
        {form.formState.errors.root && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-[16px] text-red-800" aria-live="assertive">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-sm font-medium">
                {form.formState.errors.root.message}
              </p>
            </div>
          </div>
        )}
        
        {/* Action buttons - Behance style */}
        <div className="flex justify-end pt-6 border-t border-[#E9E6DD] mt-6 gap-3">
          <Button
            type="button"
            disabled={isUploading}
            variant="outline"
            className="border-[#E9E6DD] hover:bg-[#F5F5F5] text-[#414141] transition-colors"
            aria-label="Save as Draft"
          >
            Enregistrer comme brouillon
          </Button>
          <Button
            type="submit"
            disabled={isUploading}
            className="bg-[#0057FF] hover:bg-[#003ECC] text-white transition-colors"
            aria-label="Publish Design"
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                Continuer
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
