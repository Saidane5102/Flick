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
  ChevronRight,
  LayoutGrid,
  Type,
  Video
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FullScreenUploadProps {
  brief: string;
  cardIds: number[];
  onSuccess?: () => void;
  onCancel?: () => void;
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

export default function FullScreenUpload({ brief, cardIds, onSuccess, onCancel }: FullScreenUploadProps) {
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
    <div className="fixed inset-0 z-50 bg-white">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-screen overflow-hidden">
          {/* Fixed Header - Behance-style */}
          <div className="px-6 py-4 border-b border-[#E9E6DD] bg-white flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#212121]">Créer un Projet</h2>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-[#E9E6DD] hover:bg-[#F5F5F5] text-[#414141]"
                onClick={onCancel}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isUploading || uploadMutation.isPending}
                className="bg-[#0057FF] hover:bg-[#003ECC] text-white"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publier...
                  </>
                ) : (
                  "Publier le projet"
                )}
              </Button>
            </div>
          </div>
          
          {/* Main content area - 3/4 preview, 1/4 tools */}
          <div className="flex flex-1 overflow-hidden">
            {/* Preview area - 3/4 width */}
            <div className="w-3/4 bg-[#F5F5F5] overflow-auto p-8">
              <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 min-h-[calc(100vh-7rem)]">
                {preview ? (
                  <div className="space-y-8">
                    <h1 className="text-3xl font-semibold text-[#212121]">
                      {form.watch("title") || "Titre du projet"}
                    </h1>
                    
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={preview}
                        alt="Design preview"
                        className="w-full object-contain max-h-[600px]"
                      />
                    </div>
                    
                    <div className="prose prose-sm max-w-none text-[#414141]">
                      {form.watch("description") ? (
                        <p>{form.watch("description")}</p>
                      ) : (
                        <p className="text-[#AAAAAA] italic">Ajoutez une description pour expliquer votre processus de conception...</p>
                      )}
                    </div>
                    
                    {/* Design brief section */}
                    <div className="bg-[#FAF9F7] border border-[#E9E6DD] rounded-[16px] p-4">
                      <div className="flex items-center mb-2">
                        <Info className="h-4 w-4 text-[#212121] mr-2" />
                        <Label className="text-sm font-medium text-[#212121]">Design Brief</Label>
                      </div>
                      <p className="text-sm text-[#414141] leading-relaxed">{brief}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-20 gap-6">
                    <ImageIcon className="h-20 w-20 text-[#DDDDDD]" />
                    <h3 className="text-2xl font-medium text-[#AAAAAA]">Prévisualisation du projet</h3>
                    <p className="text-[#AAAAAA] max-w-md text-lg">
                      Utilisez les outils à droite pour ajouter du contenu à votre projet
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Tools area - 1/4 width */}
            <div className="w-1/4 border-l border-[#E9E6DD] overflow-auto bg-white">
              <div className="p-6 space-y-8">
                {/* Content Type Selection */}
                <div>
                  <h3 className="text-sm font-medium text-[#212121] mb-4">Ajouter contenu</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative flex flex-col items-center justify-center border border-[#E9E6DD] rounded-lg py-3 px-2 hover:border-[#CDCDCD] transition-colors bg-[#FAF9F7] cursor-pointer">
                      <div className="w-8 h-8 flex items-center justify-center mb-2">
                        <ImageIcon className="w-5 h-5 text-[#212121]" />
                      </div>
                      <span className="text-xs text-center text-[#212121]">Image</span>
                    </div>
                    <div className="relative flex flex-col items-center justify-center border border-[#E9E6DD] rounded-lg py-3 px-2 hover:border-[#CDCDCD] transition-colors bg-[#FAF9F7] cursor-pointer opacity-50">
                      <div className="w-8 h-8 flex items-center justify-center mb-2">
                        <Type className="w-5 h-5 text-[#212121]" />
                      </div>
                      <span className="text-xs text-center text-[#212121]">Texte</span>
                    </div>
                    <div className="relative flex flex-col items-center justify-center border border-[#E9E6DD] rounded-lg py-3 px-2 hover:border-[#CDCDCD] transition-colors bg-[#FAF9F7] cursor-pointer opacity-50">
                      <div className="w-8 h-8 flex items-center justify-center mb-2">
                        <LayoutGrid className="w-5 h-5 text-[#212121]" />
                      </div>
                      <span className="text-xs text-center text-[#212121]">Grille photo</span>
                    </div>
                    <div className="relative flex flex-col items-center justify-center border border-[#E9E6DD] rounded-lg py-3 px-2 hover:border-[#CDCDCD] transition-colors bg-[#FAF9F7] cursor-pointer opacity-50">
                      <div className="w-8 h-8 flex items-center justify-center mb-2">
                        <Video className="w-5 h-5 text-[#212121]" />
                      </div>
                      <span className="text-xs text-center text-[#212121]">Vidéo/Audio</span>
                    </div>
                  </div>
                </div>
                
                {/* Image Upload */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { onChange, value, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel className="text-[#212121] font-medium">
                        Upload Design
                      </FormLabel>
                      <FormDescription className="text-xs text-[#414141]">
                        Formats acceptés: JPG, PNG, GIF (max 5MB)
                      </FormDescription>
                      <FormControl>
                        <div className="space-y-3">
                          <div className="relative" ref={errorRefs.image}>
                            {!preview ? (
                              <div className="border-2 border-dashed border-[#E9E6DD] rounded-lg bg-[#FAF9F7] p-6 flex flex-col items-center justify-center">
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
                                />
                                <ImageIcon className="h-12 w-12 text-[#414141] mb-4" />
                                <p className="text-[#212121] font-medium mb-2 text-center">
                                  Glissez une image ici
                                </p>
                                <div className="flex items-center justify-center text-sm text-[#414141]">
                                  <span className="text-center">
                                    ou 
                                    <Button 
                                      type="button" 
                                      variant="ghost" 
                                      className="px-2 py-1 h-auto underline text-[#212121]"
                                      onClick={selectFile}
                                    >
                                      parcourir
                                    </Button>
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="rounded-lg overflow-hidden border border-[#E9E6DD]">
                                <div className="relative bg-white">
                                  <img
                                    src={preview}
                                    alt="Design preview"
                                    className="w-full object-contain"
                                    style={{ maxHeight: "200px" }}
                                  />
                                  <div className="absolute top-2 right-2">
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="h-8 px-2 bg-white shadow-sm hover:bg-[#F5F5F5]"
                                      onClick={selectFile}
                                      aria-label="Change image"
                                    >
                                      Changer
                                    </Button>
                                  </div>
                                </div>
                                <div className="hidden">
                                  <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    aria-label="Upload Design Image"
                                    onChange={(e) => {
                                      onChange(e.target.files);
                                      handleImageChange(e.target.files);
                                    }}
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
                                    Alt text pour l'image
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="ml-1 cursor-help">
                                            <Info className="h-3.5 w-3.5 inline text-[#414141]" />
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="max-w-xs text-xs">
                                            L'alt text aide les personnes malvoyantes à comprendre votre image
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Décrivez votre design pour les utilisateurs malvoyants"
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
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#212121] font-medium">Titre du projet</FormLabel>
                        <FormControl>
                          <Input 
                            className="border-[#E9E6DD] text-[#212121]" 
                            placeholder="Entrez un titre pour votre design" 
                            {...field} 
                            aria-label="Titre du projet"
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
                          Parlez de votre processus de design, des outils utilisés et des défis relevés
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            placeholder="Ajoutez des détails sur votre approche de conception..."
                            className="resize-none min-h-[120px] leading-relaxed border-[#E9E6DD] text-[#212121]"
                            {...field}
                            aria-label="Description du projet"
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
                      <span className="text-[#414141] font-normal ml-1">(Optionnel, max 5)</span>
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
                            placeholder="Ajoutez des tags séparés par des virgules ou Entrée"
                            className="border-[#E9E6DD] text-[#212121] pr-16"
                            id="tags"
                            aria-label="Ajouter Tags"
                            maxLength={30}
                            disabled={tags.length >= 5}
                          />
                          <Button
                            type="button"
                            onClick={addTag}
                            disabled={!tagInput.trim() || tags.length >= 5}
                            className="absolute right-1 top-1 h-8 px-2 bg-[#EDEDED] hover:bg-[#DEDEDE] text-[#212121]"
                            aria-label="Ajouter Tag"
                          >
                            Ajouter
                          </Button>
                        </div>
                      </div>
                      
                      {/* Tags display */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2" aria-live="polite" aria-label="Tags sélectionnés">
                          {tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="py-1.5 px-3 bg-[#F5F5F5] text-[#212121] border-[#E9E6DD]">
                              {tag}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTag(tag)}
                                className="h-4 w-4 p-0 ml-1 text-[#414141] hover:text-[#212121] hover:bg-transparent"
                                aria-label={`Supprimer tag ${tag}`}
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
                
                {/* Upload status area */}
                {isUploading && (
                  <div className="mt-4 p-4 bg-[#FAF9F7] border border-[#E9E6DD] rounded-lg" aria-live="polite">
                    <div className="flex items-center mb-2">
                      <Loader2 className="animate-spin h-4 w-4 text-[#212121] mr-2" />
                      <p className="text-sm font-medium text-[#212121]">
                        Téléchargement en cours... {uploadProgress}%
                      </p>
                    </div>
                    <Progress value={uploadProgress} className="h-2 bg-[#E9E6DD]" />
                  </div>
                )}
                
                {/* Success message */}
                {uploadProgress === 100 && !isUploading && (
                  <div className="mt-4 p-4 bg-[#F5FFF5] border border-green-200 rounded-lg text-green-800" aria-live="polite">
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <p className="text-sm font-medium">
                        Design publié avec succès!
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Error message area */}
                {form.formState.errors.root && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800" aria-live="assertive">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                      <p className="text-sm font-medium">
                        {form.formState.errors.root.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}