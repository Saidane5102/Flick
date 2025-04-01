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
import ContentBlock, { BlockData } from "./ContentBlock";
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
  Video,
  Plus,
  ArrowRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  
  // Multi-step form workflow
  const [step, setStep] = useState<'content' | 'metadata'>('content');
  
  // Content blocks with inline editing
  const [contentBlocks, setContentBlocks] = useState<BlockData[]>([]);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [selectedBlockForEdit, setSelectedBlockForEdit] = useState<BlockData | null>(null);
  
  // For accessibility focus management
  const [lastErrorField, setLastErrorField] = useState<string | null>(null);
  const errorRefs = {
    title: useRef<HTMLDivElement>(null),
    image: useRef<HTMLDivElement>(null),
    tags: useRef<HTMLDivElement>(null),
  };
  
  // Form definition
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageAltText: "",
    },
    mode: "onChange",
  });
  
  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      setIsUploading(true);
      
      const response = await fetch('/api/designs', {
        method: 'POST',
        body: data,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload");
      }
      
      // Simulate progress
      const simulateProgress = () => {
        setUploadProgress((prev) => {
          const next = prev + Math.random() * 20;
          return next > 95 ? 95 : next;
        });
      };
      
      const timer = setInterval(simulateProgress, 500);
      setTimeout(() => {
        clearInterval(timer);
        setUploadProgress(100);
      }, 2000);
      
      return await response.json();
    },
    onSuccess: (data) => {
      setIsUploading(false);
      setUploadProgress(0);
      
      toast({
        title: "Projet publié!",
        description: "Votre travail a été publié avec succès.",
        variant: "default",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      setIsUploading(false);
      setUploadProgress(0);
      
      toast({
        title: "Erreur de publication",
        description: error.message || "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
      
      setLastErrorField("image");
      errorRefs.image.current?.focus();
    },
  });
  
  // Handle form submission
  const onSubmit = (values: FormValues) => {
    if (values.image && values.image.length > 0) {
      const formData = new FormData();
      formData.append("image", values.image[0]);
      formData.append("title", values.title);
      formData.append("userId", user?.id.toString() || "");
      formData.append("description", values.description || "");
      formData.append("tags", JSON.stringify(tags));
      formData.append("cardIds", JSON.stringify(cardIds));
      formData.append("imageAltText", values.imageAltText || "");
      
      // Add content blocks to form data
      formData.append("contentBlocks", JSON.stringify(contentBlocks));
      
      uploadMutation.mutate(formData);
    }
  };
  
  // Handle image selection
  const handleImageChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "L'image ne doit pas dépasser 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Format non supporté",
          description: "Seuls les formats d'image sont acceptés.",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Generate unique ID for content blocks
  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };
  
  // Add content block
  const addContentBlock = (type: 'text' | 'heading' | 'image' | 'spacer') => {
    const newBlock: BlockData = {
      id: generateId(),
      type,
      content: type === 'heading' ? 'Nouveau titre' : type === 'text' ? 'Nouveau paragraphe' : '',
      size: 'full',
      alignment: 'left',
    };
    
    setContentBlocks([...contentBlocks, newBlock]);
    
    // Announce to screen readers
    if (typeof document !== 'undefined') {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.classList.add('sr-only');
      announcement.textContent = `Élément ${type} ajouté`;
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 500);
    }
  };
  
  // Update content block
  const updateContentBlock = (id: string, data: Partial<BlockData>) => {
    setContentBlocks(
      contentBlocks.map((block) => 
        block.id === id ? { ...block, ...data } : block
      )
    );
  };
  
  // Delete content block
  const deleteContentBlock = (id: string) => {
    setContentBlocks(contentBlocks.filter((block) => block.id !== id));
    
    // Announce to screen readers
    if (typeof document !== 'undefined') {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.classList.add('sr-only');
      announcement.textContent = `Élément supprimé`;
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 500);
    }
  };
  
  // Move content block up
  const moveContentBlockUp = (id: string) => {
    const index = contentBlocks.findIndex((block) => block.id === id);
    if (index > 0) {
      const newBlocks = [...contentBlocks];
      const temp = newBlocks[index - 1];
      newBlocks[index - 1] = newBlocks[index];
      newBlocks[index] = temp;
      setContentBlocks(newBlocks);
    }
  };
  
  // Move content block down
  const moveContentBlockDown = (id: string) => {
    const index = contentBlocks.findIndex((block) => block.id === id);
    if (index < contentBlocks.length - 1) {
      const newBlocks = [...contentBlocks];
      const temp = newBlocks[index + 1];
      newBlocks[index + 1] = newBlocks[index];
      newBlocks[index] = temp;
      setContentBlocks(newBlocks);
    }
  };
  
  // Reset error focus when field is fixed
  useEffect(() => {
    if (lastErrorField && form.formState.errors[lastErrorField as keyof FormValues] === undefined) {
      setLastErrorField(null);
    }
  }, [form.formState.errors, lastErrorField]);
  
  // Focus error field when error occurs
  useEffect(() => {
    if (lastErrorField && errorRefs[lastErrorField as keyof typeof errorRefs]?.current) {
      errorRefs[lastErrorField as keyof typeof errorRefs].current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lastErrorField]);
  
  const selectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const goToNextStep = () => {
    if (step === 'content') {
      if (!preview) {
        toast({
          title: "Cover image required",
          description: "Please upload a cover image for your project",
          variant: "destructive",
        });
        return;
      }
      
      setStep('metadata');
    } else {
      form.handleSubmit(onSubmit)();
    }
  };
  
  const goToPreviousStep = () => {
    if (step === 'metadata') {
      setStep('content');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <Form {...form}>
        <form onSubmit={(e) => { e.preventDefault(); goToNextStep(); }} className="flex flex-col h-screen overflow-hidden">
          {/* Fixed Header - Behance-style */}
          <div className="px-6 py-4 border-b border-[#E9E6DD] bg-white flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#212121]">
              {step === 'content' ? 'Créer le contenu' : 'Finaliser le projet'}
            </h2>
            <div className="flex items-center gap-3">
              {step === 'metadata' && (
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#E9E6DD] hover:bg-[#F5F5F5] text-[#414141]"
                  onClick={goToPreviousStep}
                >
                  Retour
                </Button>
              )}
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
                aria-label={step === 'metadata' ? 'Publier le projet' : 'Passer à l\'étape suivante'}
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {step === 'metadata' ? "Publier..." : "Suivant..."}
                  </>
                ) : (
                  <>
                    {step === 'metadata' ? (
                      "Publier le projet"
                    ) : (
                      <>
                        Suivant
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {step === 'content' ? (
            /* Content creation step */
            <div className="flex flex-1 overflow-hidden">
              {/* Preview area - full width */}
              <div className="w-full bg-[#F5F5F5] overflow-auto p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 min-h-[calc(100vh-7rem)]" tabIndex={0} aria-label="Espace d'édition du contenu">
                  {!preview ? (
                    /* Cover image upload prompt */
                    <div className="flex flex-col items-center justify-center text-center py-20 gap-6 border-2 border-dashed border-[#E9E6DD] rounded-lg cursor-pointer hover:bg-[#FAF9F7]" 
                         onClick={selectFile}
                         onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') selectFile()}}
                         tabIndex={0}
                         role="button"
                         aria-label="Ajouter l'image de couverture">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0"
                          id="cover-upload"
                          aria-label="Upload Cover Image"
                          onChange={(e) => {
                            if (e.target.files) {
                              form.setValue("image", e.target.files);
                              handleImageChange(e.target.files);
                            }
                          }}
                          ref={fileInputRef}
                          tabIndex={-1}
                        />
                        <ImageIcon className="h-20 w-20 text-[#DDDDDD]" aria-hidden="true" />
                      </div>
                      <h3 className="text-2xl font-medium text-[#212121]">Ajouter une image de couverture</h3>
                      <p className="text-[#414141] max-w-md text-lg">
                        Formats acceptés: JPG, PNG, GIF (max 5MB)
                      </p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="bg-white border-[#E9E6DD] hover:bg-[#F5F5F5]"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectFile();
                        }}
                      >
                        Parcourir
                      </Button>
                    </div>
                  ) : (
                    /* Project content editing area */
                    <div className="space-y-8">
                      {/* Title - Inline editable */}
                      <div className="relative group cursor-text border-2 border-transparent hover:border-dashed hover:border-[#E9E6DD] rounded-lg p-2"
                           onClick={() => document.getElementById('title-input')?.focus()}>
                        <h1 className="text-3xl font-semibold text-[#212121]">
                          <Input
                            id="title-input"
                            placeholder="Titre du projet"
                            className="border-none text-3xl font-semibold focus:ring-0 p-0 hover:bg-transparent focus:bg-transparent"
                            value={form.watch("title") || ""}
                            onChange={(e) => form.setValue("title", e.target.value)}
                            aria-label="Titre du projet"
                          />
                        </h1>
                      </div>
                      
                      {/* Cover image with edit overlay */}
                      <div className="relative group rounded-lg overflow-hidden">
                        <img
                          src={preview}
                          alt={form.watch("imageAltText") || "Design preview"}
                          className="w-full object-contain max-h-[600px]"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity">
                          <Button
                            type="button"
                            onClick={selectFile}
                            variant="outline"
                            className="bg-white hover:bg-[#F5F5F5]"
                            aria-label="Changer l'image de couverture"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Changer l'image
                          </Button>
                          
                          {/* Alt text input */}
                          <div className="mt-4 px-4 w-full max-w-md">
                            <Input
                              placeholder="Ajouter un texte alternatif pour l'accessibilité"
                              className="bg-white/90 border-[#E9E6DD]"
                              value={form.watch("imageAltText") || ""}
                              onChange={(e) => form.setValue("imageAltText", e.target.value)}
                              aria-label="Texte alternatif pour l'image"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Description - Inline editable */}
                      <div className="relative group cursor-text border-2 border-transparent hover:border-dashed hover:border-[#E9E6DD] rounded-lg p-2"
                           onClick={() => document.getElementById('description-textarea')?.focus()}>
                        <div className="prose prose-sm max-w-none text-[#414141]">
                          <Textarea
                            id="description-textarea"
                            placeholder="Ajoutez une description pour expliquer votre processus de conception..."
                            className="border-none focus:ring-0 p-0 min-h-[100px] resize-none hover:bg-transparent focus:bg-transparent"
                            value={form.watch("description") || ""}
                            onChange={(e) => form.setValue("description", e.target.value)}
                            aria-label="Description du projet"
                          />
                        </div>
                      </div>
                      
                      {/* Content Blocks Render Area */}
                      <div className="space-y-12">
                        {contentBlocks.map((block, index) => (
                          <ContentBlock
                            key={block.id}
                            block={block}
                            isFirst={index === 0}
                            isLast={index === contentBlocks.length - 1}
                            onDelete={deleteContentBlock}
                            onUpdate={updateContentBlock}
                            onMoveUp={moveContentBlockUp}
                            onMoveDown={moveContentBlockDown}
                          />
                        ))}
                      </div>
                      
                      {/* Design brief section */}
                      <div className="bg-[#FAF9F7] border border-[#E9E6DD] rounded-[16px] p-4 mt-8">
                        <div className="flex items-center mb-2">
                          <Info className="h-4 w-4 text-[#212121] mr-2" />
                          <Label className="text-sm font-medium text-[#212121]">Design Brief</Label>
                        </div>
                        <p className="text-sm text-[#414141] leading-relaxed">{brief}</p>
                      </div>
                      
                      {/* Add content block button */}
                      <div className="flex justify-center py-8">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="border-[#E9E6DD] bg-white hover:bg-[#F5F5F5]">
                              <Plus className="h-4 w-4 mr-2" />
                              <span>Ajouter un élément</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="center">
                            <DropdownMenuLabel>Ajouter un élément</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => addContentBlock('heading')} aria-label="Ajouter un titre">
                              <Type className="h-4 w-4 mr-2 font-bold" />
                              <span>Titre</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => addContentBlock('text')} aria-label="Ajouter un paragraphe">
                              <Type className="h-4 w-4 mr-2" />
                              <span>Paragraphe de texte</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => addContentBlock('image')} aria-label="Ajouter une image">
                              <ImageIcon className="h-4 w-4 mr-2" />
                              <span>Image</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => addContentBlock('spacer')} aria-label="Ajouter un espace">
                              <ArrowRight className="h-4 w-4 mr-2" />
                              <span>Espace</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Metadata input step */
            <div className="flex flex-1 overflow-hidden">
              {/* Preview area - 2/3 width */}
              <div className="w-2/3 bg-[#F5F5F5] overflow-auto p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 min-h-[calc(100vh-7rem)]">
                  <div className="space-y-8">
                    <h1 className="text-3xl font-semibold text-[#212121]">
                      {form.watch("title") || "Titre du projet"}
                    </h1>
                    
                    {/* Cover image */}
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={preview || ""}
                        alt={form.watch("imageAltText") || "Design preview"}
                        className="w-full object-contain max-h-[600px]"
                      />
                    </div>
                    
                    {/* Description text */}
                    <div className="prose prose-sm max-w-none text-[#414141]">
                      {form.watch("description") ? (
                        <p>{form.watch("description")}</p>
                      ) : (
                        <p className="text-[#AAAAAA] italic">Ajoutez une description pour expliquer votre processus de conception...</p>
                      )}
                    </div>
                    
                    {/* Content Blocks Preview */}
                    {contentBlocks.length > 0 && (
                      <div className="border-t border-[#E9E6DD] pt-8 mt-8 space-y-8">
                        <h2 className="text-xl font-semibold text-[#212121] mb-4">Contenu du projet</h2>
                        
                        <div className="space-y-12">
                          {contentBlocks.map((block) => {
                            switch (block.type) {
                              case 'heading':
                                return (
                                  <div key={block.id} className={block.size === 'full' ? 'w-full' : block.size === 'large' ? 'w-5/6 mx-auto' : block.size === 'medium' ? 'w-2/3 mx-auto' : 'w-1/3 mx-auto'}>
                                    <h3 className="text-2xl font-semibold text-[#212121]">{block.content}</h3>
                                  </div>
                                );
                              case 'text':
                                return (
                                  <div key={block.id} className={block.size === 'full' ? 'w-full' : block.size === 'large' ? 'w-5/6 mx-auto' : block.size === 'medium' ? 'w-2/3 mx-auto' : 'w-1/3 mx-auto'}>
                                    <p className="text-[#414141] whitespace-pre-wrap">{block.content}</p>
                                  </div>
                                );
                              case 'image':
                                return (
                                  <div key={block.id} className={block.size === 'full' ? 'w-full' : block.size === 'large' ? 'w-5/6 mx-auto' : block.size === 'medium' ? 'w-2/3 mx-auto' : 'w-1/3 mx-auto'}>
                                    {block.content ? (
                                      <div>
                                        <img 
                                          src={block.content} 
                                          alt={block.altText || 'Image'} 
                                          className={`rounded-lg ${
                                            block.alignment === 'center' ? 'mx-auto' : 
                                            block.alignment === 'right' ? 'ml-auto' : ''
                                          }`}
                                        />
                                        {block.caption && (
                                          <p className="text-sm text-[#414141] mt-2 text-center">
                                            {block.caption}
                                          </p>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="border-2 border-dashed border-[#E9E6DD] rounded-lg p-12 flex flex-col items-center justify-center">
                                        <ImageIcon className="h-12 w-12 text-[#DDDDDD]" />
                                        <p className="text-[#AAAAAA] mt-4">Aucune image téléchargée</p>
                                      </div>
                                    )}
                                  </div>
                                );
                              case 'spacer':
                                return (
                                  <div key={block.id} className="h-16"></div>
                                );
                              default:
                                return null;
                            }
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* Design brief section */}
                    <div className="bg-[#FAF9F7] border border-[#E9E6DD] rounded-[16px] p-4 mt-8">
                      <div className="flex items-center mb-2">
                        <Info className="h-4 w-4 text-[#212121] mr-2" />
                        <Label className="text-sm font-medium text-[#212121]">Design Brief</Label>
                      </div>
                      <p className="text-sm text-[#414141] leading-relaxed">{brief}</p>
                    </div>
                    
                    {/* Tags display */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-6">
                        {tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="py-1.5 px-3 bg-[#F5F5F5] text-[#212121] border-[#E9E6DD]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Metadata input area - 1/3 width */}
              <div className="w-1/3 border-l border-[#E9E6DD] overflow-auto bg-white p-6 space-y-8">
                <div>
                  <h3 className="text-sm font-medium text-[#212121] mb-4">Détails du projet</h3>
                  
                  {/* Title confirmation */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-[#212121]">Titre</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            placeholder="Titre du projet" 
                            className="border-[#E9E6DD]"
                            aria-label="Titre du projet"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Alt text for main image */}
                  <FormField
                    control={form.control}
                    name="imageAltText"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-[#212121]">
                          Texte alternatif (accessibilité)
                        </FormLabel>
                        <FormDescription className="text-xs text-[#414141]">
                          Description de l'image pour les lecteurs d'écran
                        </FormDescription>
                        <FormControl>
                          <Input 
                            {...field}
                            value={field.value || ""}
                            placeholder="Description de l'image" 
                            className="border-[#E9E6DD]"
                            aria-label="Texte alternatif pour l'image"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {/* Tags input */}
                  <div className="mb-4">
                    <Label className="text-[#212121] block mb-2">Tags</Label>
                    <div className="flex items-center mb-2">
                      <Input
                        type="text"
                        placeholder="Ajouter un tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        className="border-[#E9E6DD] flex-grow"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && tagInput.trim()) {
                            e.preventDefault();
                            if (!tags.includes(tagInput.trim())) {
                              setTags([...tags, tagInput.trim()]);
                            }
                            setTagInput('');
                          }
                        }}
                        ref={tagInputRef}
                        aria-label="Ajouter un tag"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="ml-2 border-[#E9E6DD]"
                        onClick={() => {
                          if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                            setTags([...tags, tagInput.trim()]);
                            setTagInput('');
                            tagInputRef.current?.focus();
                          }
                        }}
                        aria-label="Ajouter ce tag"
                      >
                        Ajouter
                      </Button>
                    </div>
                    
                    {/* Tags list */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="py-1.5 px-3 bg-[#F5F5F5] text-[#212121] border-[#E9E6DD] group">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-4 w-4 p-0 ml-2 text-[#414141] hover:bg-transparent hover:text-red-500"
                            onClick={() => {
                              const newTags = [...tags];
                              newTags.splice(index, 1);
                              setTags(newTags);
                            }}
                            aria-label={`Supprimer le tag ${tag}`}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                      
                      {tags.length === 0 && (
                        <p className="text-sm text-[#AAAAAA] italic">
                          Aucun tag ajouté
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Upload progress */}
                  {isUploading && (
                    <div className="mt-6 space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-sm text-[#212121]">Progression</Label>
                        <span className="text-sm text-[#414141]">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" aria-label={`Progression: ${uploadProgress}%`} />
                    </div>
                  )}
                  
                  {/* Live region for screen readers */}
                  <div className="sr-only" aria-live="polite">
                    {uploadMutation.isPending && "Publication en cours..."}
                    {uploadMutation.isSuccess && "Projet publié avec succès!"}
                    {uploadMutation.isError && "Erreur lors de la publication. Veuillez réessayer."}
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}