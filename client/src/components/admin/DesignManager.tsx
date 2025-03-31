import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Palette, Type as Typography, Layout, 
  LayoutGrid, CircleDot as Radius, Box, MousePointer, 
  ArrowRight, Check, Undo
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Types for design settings
interface DesignSettings {
  colors: {
    primary: string;
    background: string;
    secondaryBackground: string;
    text: string;
    secondaryText: string;
    accent: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    bigTitleSize: number;
    secondTitleSize: number;
    textSize: number;
    labelSize: number;
    secondTextSize: number;
  };
  layout: {
    borderRadius: number;
    cardSpacing: number;
    contentWidth: string;
    buttonStyle: "rounded" | "pill" | "square";
    shadowIntensity: number;
  };
  effects: {
    enableAnimations: boolean;
    animationSpeed: number;
    useGradients: boolean;
    hoverEffectsIntensity: number;
  };
}

// Default settings based on current Memorisely design
const defaultSettings: DesignSettings = {
  colors: {
    primary: "#212121",
    background: "#FAF9F7",
    secondaryBackground: "#E9E6DD",
    text: "#212121",
    secondaryText: "#414141",
    accent: "#000000",
  },
  typography: {
    headingFont: "Inter, 'Inter Placeholder', sans-serif",
    bodyFont: "Inter, sans-serif",
    bigTitleSize: 64,
    secondTitleSize: 44,
    textSize: 16,
    labelSize: 18,
    secondTextSize: 14,
  },
  layout: {
    borderRadius: 20,
    cardSpacing: 24,
    contentWidth: "1200px",
    buttonStyle: "rounded",
    shadowIntensity: 6,
  },
  effects: {
    enableAnimations: true,
    animationSpeed: 150,
    useGradients: false,
    hoverEffectsIntensity: 8,
  },
};

// This would connect to an actual API/backend in a real implementation
const saveSettingsToServer = async (settings: DesignSettings): Promise<boolean> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Save to local storage for demo purposes
      localStorage.setItem("designSettings", JSON.stringify(settings));
      resolve(true);
    }, 800);
  });
};

const loadSettingsFromServer = async (): Promise<DesignSettings> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Try to get from local storage for demo purposes
      const savedSettings = localStorage.getItem("designSettings");
      if (savedSettings) {
        resolve(JSON.parse(savedSettings));
      } else {
        resolve(defaultSettings);
      }
    }, 300);
  });
};

// Generate CSS from settings
const generateCSS = (settings: DesignSettings): string => {
  return `
:root {
  --primary: ${settings.colors.primary};
  --background: ${settings.colors.background};
  --secondary-bg: ${settings.colors.secondaryBackground};
  --text: ${settings.colors.text};
  --secondary-text: ${settings.colors.secondaryText};
  --accent: ${settings.colors.accent};
  
  --heading-font: ${settings.typography.headingFont};
  --body-font: ${settings.typography.bodyFont};
  --big-title-size: ${settings.typography.bigTitleSize}px;
  --second-title-size: ${settings.typography.secondTitleSize}px;
  --text-size: ${settings.typography.textSize}px;
  --label-size: ${settings.typography.labelSize}px;
  --second-text-size: ${settings.typography.secondTextSize}px;
  
  --border-radius: ${settings.layout.borderRadius}px;
  --card-spacing: ${settings.layout.cardSpacing}px;
  --content-width: ${settings.layout.contentWidth};
  --shadow-intensity: ${settings.layout.shadowIntensity / 10};
  
  --animation-speed: ${settings.effects.animationSpeed}ms;
  --hover-intensity: ${settings.effects.hoverEffectsIntensity / 10};
}

body {
  background-color: var(--background);
  color: var(--text);
  font-family: var(--body-font);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--heading-font);
}

h1 {
  font-size: var(--big-title-size);
  line-height: 1.2;
}

h2 {
  font-size: var(--second-title-size);
  line-height: 1.2;
}

p {
  font-size: var(--text-size);
  color: var(--secondary-text);
}

label {
  font-size: var(--label-size);
  font-weight: 600;
}

.text-secondary {
  font-size: var(--second-text-size);
  color: var(--secondary-text);
}

.memo-card {
  border-radius: var(--border-radius);
  background-color: var(--background);
  border: 1px solid var(--secondary-bg);
  transition: all var(--animation-speed)ms ease;
  box-shadow: 0 2px calc(var(--shadow-intensity) * 2px) rgba(0, 0, 0, 0.05);
}

.memo-card:hover {
  box-shadow: 0 calc(var(--shadow-intensity) * 2px) calc(var(--shadow-intensity) * 4px) rgba(0, 0, 0, calc(var(--shadow-intensity) * 0.01));
  transform: translateY(calc(var(--hover-intensity) * -1px));
}

button {
  background-color: var(--primary);
  color: var(--background);
  border-radius: ${settings.layout.buttonStyle === "pill" ? "9999px" : 
                settings.layout.buttonStyle === "square" ? "4px" : "8px"};
  transition: all var(--animation-speed)ms ease;
}

.bento-grid {
  display: grid;
  gap: var(--card-spacing);
}
`;
};

// Preview component to show design changes in real-time
const DesignPreview = ({ settings }: { settings: DesignSettings }) => {
  return (
    <div 
      className="border rounded-[20px] p-6 shadow-sm overflow-hidden"
      style={{ 
        backgroundColor: settings.colors.background,
        borderColor: settings.colors.secondaryBackground,
        borderRadius: `${settings.layout.borderRadius}px`,
        boxShadow: `0 ${settings.layout.shadowIntensity / 2}px ${settings.layout.shadowIntensity}px rgba(0,0,0,0.05)`,
      }}
    >
      <h3 
        style={{ 
          color: settings.colors.text, 
          fontSize: `${settings.typography.secondTitleSize / 2}px`,
          fontFamily: settings.typography.headingFont,
          marginBottom: "16px"
        }}
      >
        Design Preview
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div 
          className="rounded-lg p-4 flex flex-col items-center justify-center"
          style={{ 
            backgroundColor: settings.colors.secondaryBackground,
            borderRadius: `${settings.layout.borderRadius / 2}px`,
            transition: `all ${settings.effects.animationSpeed}ms ease`
          }}
        >
          <div 
            className="w-10 h-10 flex items-center justify-center mb-2 rounded-full"
            style={{ 
              backgroundColor: settings.colors.primary,
              borderRadius: settings.layout.buttonStyle === "square" ? "4px" : 
                           settings.layout.buttonStyle === "pill" ? "9999px" : "8px"
            }}
          >
            <Palette className="h-5 w-5" style={{ color: settings.colors.background }} />
          </div>
          <p 
            style={{ 
              color: settings.colors.text,
              fontSize: `${settings.typography.labelSize}px`,
              fontFamily: settings.typography.headingFont,
              fontWeight: "600",
              marginBottom: "4px"
            }}
          >
            Color Theme
          </p>
          <span
            style={{ 
              color: settings.colors.secondaryText,
              fontSize: `${settings.typography.secondTextSize}px`,
              fontFamily: settings.typography.bodyFont,
            }}
          >
            Customizable colors
          </span>
        </div>
        
        <div 
          className="rounded-lg p-4 flex flex-col items-center justify-center"
          style={{ 
            backgroundColor: settings.colors.secondaryBackground,
            borderRadius: `${settings.layout.borderRadius / 2}px`,
            transition: `all ${settings.effects.animationSpeed}ms ease`
          }}
        >
          <div 
            className="w-10 h-10 flex items-center justify-center mb-2 rounded-full"
            style={{ 
              backgroundColor: settings.colors.primary,
              borderRadius: settings.layout.buttonStyle === "square" ? "4px" : 
                           settings.layout.buttonStyle === "pill" ? "9999px" : "8px"
            }}
          >
            <Typography className="h-5 w-5" style={{ color: settings.colors.background }} />
          </div>
          <p 
            style={{ 
              color: settings.colors.text,
              fontSize: `${settings.typography.labelSize}px`,
              fontFamily: settings.typography.headingFont,
              fontWeight: "600",
              marginBottom: "4px"
            }}
          >
            Typography
          </p>
          <span
            style={{ 
              color: settings.colors.secondaryText,
              fontSize: `${settings.typography.secondTextSize}px`,
              fontFamily: settings.typography.bodyFont,
            }}
          >
            Font & text settings
          </span>
        </div>
      </div>
      
      <div 
        style={{ 
          padding: "16px",
          backgroundColor: settings.colors.background,
          borderRadius: `${settings.layout.borderRadius / 2}px`,
          border: `1px solid ${settings.colors.secondaryBackground}`,
          marginBottom: "16px"
        }}
      >
        <p 
          style={{ 
            color: settings.colors.text,
            fontSize: `${settings.typography.textSize}px`,
            fontFamily: settings.typography.bodyFont,
            marginBottom: "12px"
          }}
        >
          This preview shows how your design settings will appear across the application.
        </p>
        <div className="flex justify-end">
          <button
            style={{ 
              backgroundColor: settings.colors.primary,
              color: "#ffffff",
              borderRadius: settings.layout.buttonStyle === "square" ? "4px" : 
                         settings.layout.buttonStyle === "pill" ? "9999px" : "8px",
              padding: "8px 16px",
              fontSize: `${settings.typography.secondTextSize}px`,
              fontFamily: settings.typography.bodyFont,
              fontWeight: "600",
              border: "none",
              transition: `all ${settings.effects.animationSpeed}ms ease`,
              cursor: "pointer"
            }}
          >
            Apply Theme
          </button>
        </div>
      </div>
      
      <div className="text-center">
        <span
          style={{ 
            color: settings.colors.secondaryText,
            fontSize: `${settings.typography.secondTextSize}px`,
            fontFamily: settings.typography.bodyFont,
          }}
        >
          Changes are previewed in real-time
        </span>
      </div>
    </div>
  );
};

export default function DesignManager() {
  const [settings, setSettings] = useState<DesignSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<string>("colors");
  const [saving, setSaving] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [colorDialogOpen, setColorDialogOpen] = useState<boolean>(false);
  const [colorValue, setColorValue] = useState<string>("");
  const { toast } = useToast();

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await loadSettingsFromServer();
        setSettings(savedSettings);
      } catch (error) {
        console.error("Failed to load design settings:", error);
        toast({
          title: "Error",
          description: "Failed to load design settings",
          variant: "destructive"
        });
      }
    };
    
    loadSettings();
  }, [toast]);

  // Handle saving settings
  const handleSave = async () => {
    try {
      setSaving(true);
      const success = await saveSettingsToServer(settings);
      if (success) {
        toast({
          title: "Success",
          description: "Design settings have been saved",
          variant: "default"
        });
        
        // Apply CSS changes (this would be implemented differently in a real app)
        const cssString = generateCSS(settings);
        console.log("Generated CSS:", cssString);
        
        // In a real implementation, this would update a stylesheet or CSS variables
        // For demo, just alert that it worked
        toast({
          title: "CSS Generated",
          description: "Design changes would be applied to the app",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Failed to save design settings:", error);
      toast({
        title: "Error",
        description: "Failed to save design settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle resetting to defaults
  const handleReset = () => {
    setSettings(defaultSettings);
    toast({
      title: "Reset Complete",
      description: "Design settings have been reset to defaults",
      variant: "default"
    });
  };

  // Color picker opener
  const openColorPicker = (colorKey: string, currentValue: string) => {
    setSelectedColor(colorKey);
    setColorValue(currentValue);
    setColorDialogOpen(true);
  };

  // Update color value
  const updateColor = () => {
    if (selectedColor.includes('.')) {
      const [section, key] = selectedColor.split('.');
      setSettings({
        ...settings,
        [section]: {
          ...settings[section as keyof DesignSettings],
          [key]: colorValue
        }
      });
    }
    setColorDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-1 text-[#212121]">Design System Manager</h2>
          <p className="text-[#414141]">Customize every aspect of your application's appearance</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="border-[#E9E6DD] text-[#212121]"
          >
            <Undo className="h-4 w-4 mr-1.5" />
            Reset to Defaults
          </Button>
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="bg-[#212121] text-white"
          >
            {saving ? (
              <>Saving...</>
            ) : (
              <>
                <Check className="h-4 w-4 mr-1.5" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-[#E9E6DD] bg-[#FAF9F7] rounded-[20px]">
            <CardHeader className="border-b border-[#E9E6DD] pb-4">
              <CardTitle className="text-lg font-semibold text-[#212121]">Design Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="colors" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-6 bg-[#E9E6DD] rounded-lg">
                  <TabsTrigger 
                    value="colors" 
                    className="data-[state=active]:bg-[#FAF9F7] data-[state=active]:text-[#212121] rounded-[8px] flex items-center"
                  >
                    <Palette className="h-4 w-4 mr-1.5" />
                    Colors
                  </TabsTrigger>
                  <TabsTrigger 
                    value="typography" 
                    className="data-[state=active]:bg-[#FAF9F7] data-[state=active]:text-[#212121] rounded-[8px] flex items-center"
                  >
                    <Typography className="h-4 w-4 mr-1.5" />
                    Typography
                  </TabsTrigger>
                  <TabsTrigger 
                    value="layout" 
                    className="data-[state=active]:bg-[#FAF9F7] data-[state=active]:text-[#212121] rounded-[8px] flex items-center"
                  >
                    <LayoutGrid className="h-4 w-4 mr-1.5" />
                    Layout
                  </TabsTrigger>
                  <TabsTrigger 
                    value="effects" 
                    className="data-[state=active]:bg-[#FAF9F7] data-[state=active]:text-[#212121] rounded-[8px] flex items-center"
                  >
                    <MousePointer className="h-4 w-4 mr-1.5" />
                    Effects
                  </TabsTrigger>
                </TabsList>

                {/* Colors Tab */}
                <TabsContent value="colors" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-[#212121]">Primary Colors</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <Label className="block mb-2 text-[#212121]">Primary</Label>
                          <div className="flex items-center">
                            <div 
                              className="w-10 h-10 rounded-md border mr-3 cursor-pointer"
                              style={{ backgroundColor: settings.colors.primary, borderColor: '#E9E6DD' }}
                              onClick={() => openColorPicker('colors.primary', settings.colors.primary)}
                            />
                            <Input 
                              value={settings.colors.primary} 
                              onChange={(e) => setSettings({
                                ...settings,
                                colors: {
                                  ...settings.colors,
                                  primary: e.target.value
                                }
                              })}
                              className="font-mono bg-[#FAF9F7] border-[#E9E6DD]"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label className="block mb-2 text-[#212121]">Background</Label>
                          <div className="flex items-center">
                            <div 
                              className="w-10 h-10 rounded-md border mr-3 cursor-pointer"
                              style={{ backgroundColor: settings.colors.background, borderColor: '#E9E6DD' }}
                              onClick={() => openColorPicker('colors.background', settings.colors.background)}
                            />
                            <Input 
                              value={settings.colors.background} 
                              onChange={(e) => setSettings({
                                ...settings,
                                colors: {
                                  ...settings.colors,
                                  background: e.target.value
                                }
                              })}
                              className="font-mono bg-[#FAF9F7] border-[#E9E6DD]"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label className="block mb-2 text-[#212121]">Secondary Background</Label>
                          <div className="flex items-center">
                            <div 
                              className="w-10 h-10 rounded-md border mr-3 cursor-pointer"
                              style={{ backgroundColor: settings.colors.secondaryBackground, borderColor: '#E9E6DD' }}
                              onClick={() => openColorPicker('colors.secondaryBackground', settings.colors.secondaryBackground)}
                            />
                            <Input 
                              value={settings.colors.secondaryBackground} 
                              onChange={(e) => setSettings({
                                ...settings,
                                colors: {
                                  ...settings.colors,
                                  secondaryBackground: e.target.value
                                }
                              })}
                              className="font-mono bg-[#FAF9F7] border-[#E9E6DD]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-[#212121]">Text Colors</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <Label className="block mb-2 text-[#212121]">Text</Label>
                          <div className="flex items-center">
                            <div 
                              className="w-10 h-10 rounded-md border mr-3 cursor-pointer"
                              style={{ backgroundColor: settings.colors.text, borderColor: '#E9E6DD' }}
                              onClick={() => openColorPicker('colors.text', settings.colors.text)}
                            />
                            <Input 
                              value={settings.colors.text} 
                              onChange={(e) => setSettings({
                                ...settings,
                                colors: {
                                  ...settings.colors,
                                  text: e.target.value
                                }
                              })}
                              className="font-mono bg-[#FAF9F7] border-[#E9E6DD]"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label className="block mb-2 text-[#212121]">Secondary Text</Label>
                          <div className="flex items-center">
                            <div 
                              className="w-10 h-10 rounded-md border mr-3 cursor-pointer"
                              style={{ backgroundColor: settings.colors.secondaryText, borderColor: '#E9E6DD' }}
                              onClick={() => openColorPicker('colors.secondaryText', settings.colors.secondaryText)}
                            />
                            <Input 
                              value={settings.colors.secondaryText} 
                              onChange={(e) => setSettings({
                                ...settings,
                                colors: {
                                  ...settings.colors,
                                  secondaryText: e.target.value
                                }
                              })}
                              className="font-mono bg-[#FAF9F7] border-[#E9E6DD]"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label className="block mb-2 text-[#212121]">Accent</Label>
                          <div className="flex items-center">
                            <div 
                              className="w-10 h-10 rounded-md border mr-3 cursor-pointer"
                              style={{ backgroundColor: settings.colors.accent, borderColor: '#E9E6DD' }}
                              onClick={() => openColorPicker('colors.accent', settings.colors.accent)}
                            />
                            <Input 
                              value={settings.colors.accent} 
                              onChange={(e) => setSettings({
                                ...settings,
                                colors: {
                                  ...settings.colors,
                                  accent: e.target.value
                                }
                              })}
                              className="font-mono bg-[#FAF9F7] border-[#E9E6DD]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Color Scheme Preview */}
                  <div className="mt-6 p-5 rounded-[20px] border border-[#E9E6DD] bg-[#FAF9F7]">
                    <h3 className="font-semibold text-[#212121] mb-4">Color Scheme Preview</h3>
                    <div className="grid grid-cols-6 gap-2">
                      <div 
                        className="aspect-square rounded-md shadow-sm"
                        style={{ backgroundColor: settings.colors.primary }}
                      />
                      <div 
                        className="aspect-square rounded-md shadow-sm"
                        style={{ backgroundColor: settings.colors.background }}
                      />
                      <div 
                        className="aspect-square rounded-md shadow-sm"
                        style={{ backgroundColor: settings.colors.secondaryBackground }}
                      />
                      <div 
                        className="aspect-square rounded-md shadow-sm"
                        style={{ backgroundColor: settings.colors.text }}
                      />
                      <div 
                        className="aspect-square rounded-md shadow-sm"
                        style={{ backgroundColor: settings.colors.secondaryText }}
                      />
                      <div 
                        className="aspect-square rounded-md shadow-sm"
                        style={{ backgroundColor: settings.colors.accent }}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Typography Tab */}
                <TabsContent value="typography" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-[#212121]">Font Families</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <Label className="block mb-2 text-[#212121]">Heading Font</Label>
                          <Input 
                            value={settings.typography.headingFont} 
                            onChange={(e) => setSettings({
                              ...settings,
                              typography: {
                                ...settings.typography,
                                headingFont: e.target.value
                              }
                            })}
                            className="bg-[#FAF9F7] border-[#E9E6DD]"
                          />
                        </div>
                        
                        <div>
                          <Label className="block mb-2 text-[#212121]">Body Font</Label>
                          <Input 
                            value={settings.typography.bodyFont} 
                            onChange={(e) => setSettings({
                              ...settings,
                              typography: {
                                ...settings.typography,
                                bodyFont: e.target.value
                              }
                            })}
                            className="bg-[#FAF9F7] border-[#E9E6DD]"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-[#212121]">Font Sizes</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label className="text-[#212121]">Big Title Size ({settings.typography.bigTitleSize}px)</Label>
                          </div>
                          <Slider 
                            value={[settings.typography.bigTitleSize]} 
                            onValueChange={(value) => setSettings({
                              ...settings,
                              typography: {
                                ...settings.typography,
                                bigTitleSize: value[0]
                              }
                            })}
                            min={24}
                            max={96}
                            step={1}
                            className="py-2"
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label className="text-[#212121]">Second Title Size ({settings.typography.secondTitleSize}px)</Label>
                          </div>
                          <Slider 
                            value={[settings.typography.secondTitleSize]} 
                            onValueChange={(value) => setSettings({
                              ...settings,
                              typography: {
                                ...settings.typography,
                                secondTitleSize: value[0]
                              }
                            })}
                            min={18}
                            max={72}
                            step={1}
                            className="py-2"
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label className="text-[#212121]">Text Size ({settings.typography.textSize}px)</Label>
                          </div>
                          <Slider 
                            value={[settings.typography.textSize]} 
                            onValueChange={(value) => setSettings({
                              ...settings,
                              typography: {
                                ...settings.typography,
                                textSize: value[0]
                              }
                            })}
                            min={12}
                            max={24}
                            step={1}
                            className="py-2"
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label className="text-[#212121]">Label Size ({settings.typography.labelSize}px)</Label>
                          </div>
                          <Slider 
                            value={[settings.typography.labelSize]} 
                            onValueChange={(value) => setSettings({
                              ...settings,
                              typography: {
                                ...settings.typography,
                                labelSize: value[0]
                              }
                            })}
                            min={12}
                            max={24}
                            step={1}
                            className="py-2"
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label className="text-[#212121]">Second Text Size ({settings.typography.secondTextSize}px)</Label>
                          </div>
                          <Slider 
                            value={[settings.typography.secondTextSize]} 
                            onValueChange={(value) => setSettings({
                              ...settings,
                              typography: {
                                ...settings.typography,
                                secondTextSize: value[0]
                              }
                            })}
                            min={10}
                            max={18}
                            step={1}
                            className="py-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Typography Preview */}
                  <div className="mt-6 p-5 rounded-[20px] border border-[#E9E6DD] bg-[#FAF9F7]">
                    <h3 className="font-semibold text-[#212121] mb-4">Typography Preview</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h1 style={{ 
                          fontFamily: settings.typography.headingFont,
                          fontSize: `${settings.typography.bigTitleSize}px`,
                          color: settings.colors.text,
                          lineHeight: 1.2,
                          marginBottom: '8px'
                        }}>
                          Big Title
                        </h1>
                        <p className="text-[#414141]">64px / 76px - Used for hero headlines</p>
                      </div>
                      
                      <Separator className="my-4 bg-[#E9E6DD]" />
                      
                      <div>
                        <h2 style={{ 
                          fontFamily: settings.typography.headingFont,
                          fontSize: `${settings.typography.secondTitleSize}px`,
                          color: settings.colors.text,
                          lineHeight: 1.2,
                          marginBottom: '8px'
                        }}>
                          Second Title
                        </h2>
                        <p className="text-[#414141]">44px / 52px - Used for section headlines</p>
                      </div>
                      
                      <Separator className="my-4 bg-[#E9E6DD]" />
                      
                      <div>
                        <p style={{ 
                          fontFamily: settings.typography.bodyFont,
                          fontSize: `${settings.typography.textSize}px`,
                          color: settings.colors.secondaryText,
                          marginBottom: '8px'
                        }}>
                          This is base text styling. It uses the body font and is used throughout the application for standard content.
                        </p>
                        <p className="text-[#414141]">16px / 24px - Used for main text</p>
                      </div>
                      
                      <Separator className="my-4 bg-[#E9E6DD]" />
                      
                      <div>
                        <label style={{ 
                          fontFamily: settings.typography.headingFont,
                          fontSize: `${settings.typography.labelSize}px`,
                          color: settings.colors.text,
                          fontWeight: 600,
                          marginBottom: '8px',
                          display: 'block'
                        }}>
                          Form Label
                        </label>
                        <p className="text-[#414141]">18px / 24px - Used for form labels and small headings</p>
                      </div>
                      
                      <Separator className="my-4 bg-[#E9E6DD]" />
                      
                      <div>
                        <span style={{ 
                          fontFamily: settings.typography.bodyFont,
                          fontSize: `${settings.typography.secondTextSize}px`,
                          color: settings.colors.secondaryText,
                        }}>
                          This is secondary text, used for supporting information, captions, and smaller elements.
                        </span>
                        <p className="text-[#414141] mt-2">14px / 20px - Used for secondary text</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Layout Tab */}
                <TabsContent value="layout" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-[#212121]">Spacing & Dimensions</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label className="text-[#212121]">Border Radius ({settings.layout.borderRadius}px)</Label>
                          </div>
                          <Slider 
                            value={[settings.layout.borderRadius]} 
                            onValueChange={(value) => setSettings({
                              ...settings,
                              layout: {
                                ...settings.layout,
                                borderRadius: value[0]
                              }
                            })}
                            min={0}
                            max={32}
                            step={1}
                            className="py-2"
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label className="text-[#212121]">Card Spacing ({settings.layout.cardSpacing}px)</Label>
                          </div>
                          <Slider 
                            value={[settings.layout.cardSpacing]} 
                            onValueChange={(value) => setSettings({
                              ...settings,
                              layout: {
                                ...settings.layout,
                                cardSpacing: value[0]
                              }
                            })}
                            min={8}
                            max={48}
                            step={1}
                            className="py-2"
                          />
                        </div>
                        
                        <div>
                          <Label className="block mb-2 text-[#212121]">Content Width</Label>
                          <div className="flex gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setSettings({
                                ...settings,
                                layout: {
                                  ...settings.layout,
                                  contentWidth: "100%"
                                }
                              })}
                              className={`flex-1 ${settings.layout.contentWidth === "100%" ? "bg-[#E9E6DD]" : "bg-[#FAF9F7] border-[#E9E6DD]"}`}
                            >
                              Full
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setSettings({
                                ...settings,
                                layout: {
                                  ...settings.layout,
                                  contentWidth: "1200px"
                                }
                              })}
                              className={`flex-1 ${settings.layout.contentWidth === "1200px" ? "bg-[#E9E6DD]" : "bg-[#FAF9F7] border-[#E9E6DD]"}`}
                            >
                              1200px
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setSettings({
                                ...settings,
                                layout: {
                                  ...settings.layout,
                                  contentWidth: "960px"
                                }
                              })}
                              className={`flex-1 ${settings.layout.contentWidth === "960px" ? "bg-[#E9E6DD]" : "bg-[#FAF9F7] border-[#E9E6DD]"}`}
                            >
                              960px
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-[#212121]">UI Elements</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <Label className="block mb-2 text-[#212121]">Button Style</Label>
                          <div className="grid grid-cols-3 gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setSettings({
                                ...settings,
                                layout: {
                                  ...settings.layout,
                                  buttonStyle: "rounded"
                                }
                              })}
                              className={`${settings.layout.buttonStyle === "rounded" ? "bg-[#E9E6DD]" : "bg-[#FAF9F7] border-[#E9E6DD]"} rounded-lg`}
                            >
                              Rounded
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setSettings({
                                ...settings,
                                layout: {
                                  ...settings.layout,
                                  buttonStyle: "pill"
                                }
                              })}
                              className={`${settings.layout.buttonStyle === "pill" ? "bg-[#E9E6DD]" : "bg-[#FAF9F7] border-[#E9E6DD]"} rounded-full`}
                            >
                              Pill
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setSettings({
                                ...settings,
                                layout: {
                                  ...settings.layout,
                                  buttonStyle: "square"
                                }
                              })}
                              className={`${settings.layout.buttonStyle === "square" ? "bg-[#E9E6DD]" : "bg-[#FAF9F7] border-[#E9E6DD]"} rounded-sm`}
                            >
                              Square
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label className="text-[#212121]">Shadow Intensity ({settings.layout.shadowIntensity})</Label>
                          </div>
                          <Slider 
                            value={[settings.layout.shadowIntensity]} 
                            onValueChange={(value) => setSettings({
                              ...settings,
                              layout: {
                                ...settings.layout,
                                shadowIntensity: value[0]
                              }
                            })}
                            min={0}
                            max={20}
                            step={1}
                            className="py-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Layout Preview */}
                  <div className="mt-6 p-5 rounded-[20px] border border-[#E9E6DD] bg-[#FAF9F7]">
                    <h3 className="font-semibold text-[#212121] mb-4">Layout Preview</h3>
                    
                    <div 
                      className="grid grid-cols-2 gap-4 mb-4"
                      style={{ gap: `${settings.layout.cardSpacing}px` }}
                    >
                      <div 
                        className="p-4 bg-[#FAF9F7] border border-[#E9E6DD] flex items-center justify-center"
                        style={{ 
                          borderRadius: `${settings.layout.borderRadius}px`,
                          boxShadow: `0 ${settings.layout.shadowIntensity / 4}px ${settings.layout.shadowIntensity / 2}px rgba(0,0,0,0.05)`
                        }}
                      >
                        <div className="text-center">
                          <Box className="w-6 h-6 mx-auto mb-2 text-[#212121]" />
                          <span className="block text-[#414141] text-sm">Border Radius: {settings.layout.borderRadius}px</span>
                        </div>
                      </div>
                      
                      <div 
                        className="p-4 bg-[#FAF9F7] border border-[#E9E6DD] flex items-center justify-center"
                        style={{ 
                          borderRadius: `${settings.layout.borderRadius}px`,
                          boxShadow: `0 ${settings.layout.shadowIntensity / 4}px ${settings.layout.shadowIntensity / 2}px rgba(0,0,0,0.05)`
                        }}
                      >
                        <div className="text-center">
                          <Layout className="w-6 h-6 mx-auto mb-2 text-[#212121]" />
                          <span className="block text-[#414141] text-sm">Card Spacing: {settings.layout.cardSpacing}px</span>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className="mb-4 p-4 text-center"
                      style={{ maxWidth: settings.layout.contentWidth, margin: "0 auto" }}
                    >
                      <span className="block text-[#414141] text-sm mb-2">Content Width: {settings.layout.contentWidth}</span>
                      <div className="h-1 bg-[#E9E6DD] rounded-full"></div>
                    </div>
                    
                    <div className="flex justify-center gap-4">
                      <button 
                        className="text-white font-medium px-4 py-2"
                        style={{ 
                          backgroundColor: settings.colors.primary,
                          borderRadius: settings.layout.buttonStyle === "square" ? "4px" : 
                                        settings.layout.buttonStyle === "pill" ? "9999px" : "8px"
                        }}
                      >
                        Button Style
                      </button>
                      
                      <div 
                        className="px-4 py-2 bg-[#FAF9F7] border border-[#E9E6DD] flex items-center"
                        style={{ 
                          borderRadius: `${settings.layout.borderRadius / 2}px`,
                          boxShadow: `0 ${settings.layout.shadowIntensity / 4}px ${settings.layout.shadowIntensity / 2}px rgba(0,0,0,0.05)`
                        }}
                      >
                        <span className="text-[#414141] text-sm">Shadow: {settings.layout.shadowIntensity}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Effects Tab */}
                <TabsContent value="effects" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-[#212121]">Animations</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="enable-animations" className="text-[#212121]">
                            Enable Animations
                          </Label>
                          <Switch
                            id="enable-animations"
                            checked={settings.effects.enableAnimations}
                            onCheckedChange={(checked) => setSettings({
                              ...settings,
                              effects: {
                                ...settings.effects,
                                enableAnimations: checked
                              }
                            })}
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label className="text-[#212121]">Animation Speed ({settings.effects.animationSpeed}ms)</Label>
                          </div>
                          <Slider 
                            value={[settings.effects.animationSpeed]} 
                            onValueChange={(value) => setSettings({
                              ...settings,
                              effects: {
                                ...settings.effects,
                                animationSpeed: value[0]
                              }
                            })}
                            disabled={!settings.effects.enableAnimations}
                            min={50}
                            max={500}
                            step={10}
                            className="py-2"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-[#212121]">Visual Effects</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="use-gradients" className="text-[#212121]">
                            Use Gradients
                          </Label>
                          <Switch
                            id="use-gradients"
                            checked={settings.effects.useGradients}
                            onCheckedChange={(checked) => setSettings({
                              ...settings,
                              effects: {
                                ...settings.effects,
                                useGradients: checked
                              }
                            })}
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label className="text-[#212121]">Hover Effects Intensity ({settings.effects.hoverEffectsIntensity})</Label>
                          </div>
                          <Slider 
                            value={[settings.effects.hoverEffectsIntensity]} 
                            onValueChange={(value) => setSettings({
                              ...settings,
                              effects: {
                                ...settings.effects,
                                hoverEffectsIntensity: value[0]
                              }
                            })}
                            min={0}
                            max={16}
                            step={1}
                            className="py-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Effects Preview */}
                  <div className="mt-6 p-5 rounded-[20px] border border-[#E9E6DD] bg-[#FAF9F7]">
                    <h3 className="font-semibold text-[#212121] mb-4">Effects Preview</h3>
                    
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div 
                        className="p-5 flex flex-col items-center justify-center border overflow-hidden"
                        style={{ 
                          borderColor: settings.colors.secondaryBackground,
                          borderRadius: `${settings.layout.borderRadius}px`,
                          backgroundColor: settings.effects.useGradients ? 
                            `linear-gradient(135deg, ${settings.colors.background} 0%, ${settings.colors.secondaryBackground} 100%)` :
                            settings.colors.background,
                          transition: settings.effects.enableAnimations ? `all ${settings.effects.animationSpeed}ms ease` : 'none',
                          boxShadow: `0 ${settings.layout.shadowIntensity / 4}px ${settings.layout.shadowIntensity / 2}px rgba(0,0,0,0.05)`,
                        }}
                      >
                        <div 
                          className="mb-3 w-12 h-12 flex items-center justify-center rounded-full"
                          style={{ 
                            backgroundColor: settings.colors.primary,
                            color: 'white',
                            transition: settings.effects.enableAnimations ? `all ${settings.effects.animationSpeed}ms ease` : 'none',
                          }}
                        >
                          <ArrowRight className="h-6 w-6" />
                        </div>
                        <p className="text-center text-[#414141] mb-2">Animation Speed: {settings.effects.animationSpeed}ms</p>
                        <p className="text-center text-[#414141] text-sm">Hover me to see the animation</p>
                      </div>
                      
                      <div 
                        className="p-5 flex flex-col items-center justify-center border relative overflow-hidden"
                        style={{ 
                          borderColor: settings.colors.secondaryBackground,
                          borderRadius: `${settings.layout.borderRadius}px`,
                          transition: settings.effects.enableAnimations ? `all ${settings.effects.animationSpeed}ms ease` : 'none',
                          boxShadow: `0 ${settings.layout.shadowIntensity / 4}px ${settings.layout.shadowIntensity / 2}px rgba(0,0,0,0.05)`,
                        }}
                      >
                        {settings.effects.useGradients && (
                          <div 
                            className="absolute inset-0 opacity-10"
                            style={{ 
                              background: `linear-gradient(135deg, ${settings.colors.primary} 0%, ${settings.colors.accent || settings.colors.primary} 100%)`
                            }}
                          />
                        )}
                        <div 
                          className="mb-3 w-12 h-12 flex items-center justify-center rounded-full relative z-10"
                          style={{ 
                            backgroundColor: settings.colors.primary,
                            color: 'white',
                            transform: `scale(1)`,
                            transition: settings.effects.enableAnimations ? `all ${settings.effects.animationSpeed}ms ease` : 'none',
                          }}
                        >
                          <MousePointer className="h-6 w-6" />
                        </div>
                        <p className="text-center text-[#414141] mb-2 relative z-10">
                          Hover Effects: {settings.effects.hoverEffectsIntensity}
                        </p>
                        <p className="text-center text-[#414141] text-sm relative z-10">
                          {settings.effects.useGradients ? "Gradients Enabled" : "Flat Colors"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <button
                        style={{ 
                          backgroundColor: settings.colors.primary,
                          color: '#ffffff',
                          padding: '10px 20px',
                          borderRadius: settings.layout.buttonStyle === "square" ? "4px" : 
                                         settings.layout.buttonStyle === "pill" ? "9999px" : "8px",
                          border: 'none',
                          fontWeight: '600',
                          transition: settings.effects.enableAnimations ? `all ${settings.effects.animationSpeed}ms ease` : 'none',
                        }}
                        className="hover:shadow-lg"
                      >
                        Interactive Button
                      </button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Design Preview */}
        <div className="hidden lg:block">
          <Card className="border-[#E9E6DD] bg-[#FAF9F7] rounded-[20px] h-full">
            <CardHeader className="border-b border-[#E9E6DD] pb-4">
              <CardTitle className="text-lg font-semibold text-[#212121]">Live Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-6 overflow-auto max-h-[700px]">
              <DesignPreview settings={settings} />
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Color Picker Dialog */}
      {colorDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#FAF9F7] rounded-[20px] p-6 w-full max-w-md">
            <h3 className="font-semibold text-[#212121] mb-6">Select Color</h3>
            
            <div className="mb-6">
              <HexColorPicker
                color={colorValue}
                onChange={setColorValue}
                style={{ width: '100%' }}
              />
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-md border"
                style={{ backgroundColor: colorValue, borderColor: '#E9E6DD' }}
              />
              <Input 
                value={colorValue} 
                onChange={(e) => setColorValue(e.target.value)} 
                className="font-mono bg-[#FAF9F7] border-[#E9E6DD]"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setColorDialogOpen(false)}
                className="border-[#E9E6DD] bg-[#FAF9F7] text-[#212121]"
              >
                Cancel
              </Button>
              <Button 
                onClick={updateColor}
                className="bg-[#212121] text-white"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end gap-3 mt-6">
        <Button 
          variant="outline" 
          onClick={handleReset}
          className="border-[#E9E6DD] text-[#212121]"
        >
          <Undo className="h-4 w-4 mr-1.5" />
          Reset to Defaults
        </Button>
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#212121] text-white"
        >
          {saving ? (
            <>Saving...</>
          ) : (
            <>
              <Check className="h-4 w-4 mr-1.5" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}