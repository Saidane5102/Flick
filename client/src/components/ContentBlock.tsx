import { useState, useRef } from "react";
import { 
  Grip, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Settings, 
  Image as ImageIcon, 
  Type,
  Move,
  Upload,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface BlockData {
  id: string;
  type: 'image' | 'text' | 'heading' | 'spacer';
  content: string;
  caption?: string;
  altText?: string;
  size?: 'small' | 'medium' | 'large' | 'full';
  alignment?: 'left' | 'center' | 'right';
}

interface ContentBlockProps {
  block: BlockData;
  isFirst: boolean;
  isLast: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<BlockData>) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

export default function ContentBlock({ 
  block, 
  isFirst, 
  isLast,
  onDelete, 
  onUpdate, 
  onMoveUp, 
  onMoveDown 
}: ContentBlockProps) {
  const [focused, setFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate(block.id, { 
          content: reader.result as string,
          altText: file.name // Default alt text to filename
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Render different block types
  const renderBlockContent = () => {
    switch (block.type) {
      case 'image':
        return (
          <div className={`relative ${getBlockSize(block.size)}`}>
            {block.content ? (
              <>
                <div className="relative">
                  <img 
                    src={block.content} 
                    alt={block.altText || 'Image'} 
                    className={`rounded-lg border border-[#E9E6DD] ${
                      block.alignment === 'center' ? 'mx-auto' : 
                      block.alignment === 'right' ? 'ml-auto' : ''
                    }`}
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-8 px-2 bg-white shadow-sm hover:bg-[#F5F5F5]"
                      onClick={triggerFileInput}
                    >
                      Changer
                    </Button>
                  </div>
                  {block.caption && (
                    <p className="text-sm text-[#414141] mt-2 text-center">
                      {block.caption}
                    </p>
                  )}
                </div>
                <div className="mt-3 space-y-2">
                  <Input 
                    placeholder="Add alt text for accessibility..."
                    value={block.altText || ''}
                    onChange={(e) => onUpdate(block.id, { altText: e.target.value })}
                    className="text-sm border-[#E9E6DD] text-[#212121]"
                  />
                  <Input 
                    placeholder="Add a caption (optional)..."
                    value={block.caption || ''}
                    onChange={(e) => onUpdate(block.id, { caption: e.target.value })}
                    className="text-sm border-[#E9E6DD] text-[#212121]"
                  />
                </div>
              </>
            ) : (
              <div
                className="border-2 border-dashed border-[#E9E6DD] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-[#FAF9F7] transition-colors"
                onClick={triggerFileInput}
              >
                <Upload className="h-10 w-10 text-[#AAAAAA] mb-4" />
                <p className="text-[#212121] font-medium mb-2 text-center">
                  Ajouter une image
                </p>
                <p className="text-sm text-[#AAAAAA] mb-4 text-center">
                  Formats acceptés: JPG, PNG (max 5MB)
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-[#E9E6DD] bg-white hover:bg-[#F5F5F5]"
                  onClick={triggerFileInput}
                >
                  Parcourir
                </Button>
              </div>
            )}
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              aria-label="Upload image"
            />
          </div>
        );

      case 'text':
        return (
          <div className={getBlockSize(block.size)}>
            <Textarea
              value={block.content}
              onChange={(e) => onUpdate(block.id, { content: e.target.value })}
              placeholder="Start typing your text..."
              className="min-h-[120px] border-[#E9E6DD] text-[#212121] resize-none"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </div>
        );

      case 'heading':
        return (
          <div className={getBlockSize(block.size)}>
            <Input
              value={block.content}
              onChange={(e) => onUpdate(block.id, { content: e.target.value })}
              placeholder="Heading text here..."
              className="text-xl font-semibold border-[#E9E6DD] text-[#212121]"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </div>
        );

      case 'spacer':
        return (
          <div 
            className={`${getBlockSize(block.size)} h-16 border-2 border-dashed border-[#E9E6DD] rounded-lg flex items-center justify-center text-[#AAAAAA]`}
          >
            <span className="text-sm">Spacer</span>
          </div>
        );

      default:
        return null;
    }
  };

  const getBlockSize = (size?: string) => {
    switch (size) {
      case 'small': return 'w-1/3 mx-auto';
      case 'medium': return 'w-2/3 mx-auto';
      case 'large': return 'w-5/6 mx-auto';
      case 'full':
      default:
        return 'w-full';
    }
  };

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-4 w-4" />;
      case 'text': return <Type className="h-4 w-4" />;
      case 'heading': return <Type className="h-4 w-4 font-bold" />;
      default: return <Move className="h-4 w-4" />;
    }
  };

  return (
    <div 
      className={`relative group border ${focused ? 'border-[#0057FF]' : 'border-transparent'} rounded-lg p-3 my-2 hover:bg-[#FAFAFA] transition-colors`}
    >
      {/* Block toolbar */}
      <div className={`absolute -left-10 top-0 h-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 rounded-full hover:bg-[#E9E6DD]"
          onClick={() => onMoveUp(block.id)}
          disabled={isFirst}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <div className="my-1 cursor-grab active:cursor-grabbing">
          <Grip className="h-4 w-4 text-[#AAAAAA]" />
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 rounded-full hover:bg-[#E9E6DD]"
          onClick={() => onMoveDown(block.id)}
          disabled={isLast}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      {/* Block content */}
      <div className="relative">
        {renderBlockContent()}
      </div>

      {/* Block actions */}
      <div className="absolute -right-10 top-0 h-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full hover:bg-[#E9E6DD]"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="flex items-center">
              {getBlockIcon(block.type)}
              <span className="ml-2 capitalize">{block.type}</span>
            </DropdownMenuLabel>
            {(block.type === 'image' || block.type === 'text' || block.type === 'heading') && (
              <>
                <DropdownMenuLabel>Size</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onUpdate(block.id, { size: 'small' })}>
                  Small
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdate(block.id, { size: 'medium' })}>
                  Medium
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdate(block.id, { size: 'large' })}>
                  Large
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdate(block.id, { size: 'full' })}>
                  Full width
                </DropdownMenuItem>
              </>
            )}
            {block.type === 'image' && (
              <>
                <DropdownMenuLabel>Alignment</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onUpdate(block.id, { alignment: 'left' })}>
                  Left
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdate(block.id, { alignment: 'center' })}>
                  Center
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdate(block.id, { alignment: 'right' })}>
                  Right
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 rounded-full hover:bg-red-100 hover:text-red-600 mt-2"
          onClick={() => onDelete(block.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}