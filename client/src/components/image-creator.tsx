import { useState, useRef, useEffect } from "react";
import { X, Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { type ShayariWithPoet } from "@shared/schema";
import { generateShayariImage, type BackgroundType } from "@/lib/image-generator";

interface ImageCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  initialShayari?: ShayariWithPoet | null;
}

const backgrounds: { type: BackgroundType; label: string; preview: string }[] = [
  { type: "sunset", label: "غروب آفتاب", preview: "from-orange-400 to-red-500" },
  { type: "mountain", label: "پہاڑ", preview: "from-blue-400 to-purple-500" },
  { type: "night", label: "رات", preview: "from-gray-900 to-blue-900" },
  { type: "garden", label: "باغ", preview: "from-green-400 to-teal-500" },
  { type: "ocean", label: "سمندر", preview: "from-blue-400 to-cyan-500" },
  { type: "desert", label: "صحرا", preview: "from-yellow-400 to-orange-500" },
  { type: "forest", label: "جنگل", preview: "from-green-600 to-emerald-400" },
  { type: "royal", label: "شاہی", preview: "from-purple-500 to-pink-500" },
  { type: "romantic", label: "رومانی", preview: "from-pink-300 to-rose-400" },
  { type: "mystical", label: "پُراسرار", preview: "from-purple-600 to-violet-500" },
  { type: "vintage", label: "پرانا", preview: "from-yellow-100 to-amber-200" },
  { type: "minimal", label: "سادہ", preview: "bg-gray-200" },
];

export default function ImageCreator({ isOpen, onClose, initialShayari }: ImageCreatorProps) {
  const [shayariText, setShayariText] = useState("");
  const [poetName, setPoetName] = useState("");
  const [selectedBackground, setSelectedBackground] = useState<BackgroundType>("sunset");
  const [isGenerating, setIsGenerating] = useState(false);
  const [customImage, setCustomImage] = useState<HTMLImageElement | null>(null);
  const [useCustomImage, setUseCustomImage] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && initialShayari) {
      setShayariText(initialShayari.text);
      setPoetName(initialShayari.poet.urduName);
    } else if (isOpen && !initialShayari) {
      setShayariText("");
      setPoetName("");
    }
  }, [isOpen, initialShayari]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setCustomImage(img);
          setUseCustomImage(true);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "خرابی",
        description: "براہ کرم صحیح تصویر منتخب کریں",
        variant: "destructive",
      });
    }
  };

  const removeCustomImage = () => {
    setCustomImage(null);
    setUseCustomImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerateImage = async () => {
    if (!shayariText.trim()) {
      toast({
        title: "خرابی",
        description: "پہلے شعر لکھیں",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const canvas = await generateShayariImage({
        text: shayariText,
        poet: poetName,
        background: selectedBackground,
        customImage: useCustomImage ? customImage : undefined,
      });

      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          canvasRef.current.width = canvas.width;
          canvasRef.current.height = canvas.height;
          ctx.drawImage(canvas, 0, 0);
        }
      }

      // Download the image
      const link = document.createElement('a');
      link.download = `shayari-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast({
        title: "تصویر تیار ہو گئی",
        description: "شعر کی تصویر ڈاؤن لوڈ ہو گئی",
      });
    } catch (error) {
      toast({
        title: "خرابی",
        description: "تصویر بنانے میں مسئلہ ہوا",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!canvasRef.current) {
      toast({
        title: "خرابی",
        description: "پہلے تصویر بنائیں",
        variant: "destructive",
      });
      return;
    }

    try {
      canvasRef.current.toBlob(async (blob) => {
        if (blob && navigator.share) {
          const file = new File([blob], 'shayari.png', { type: 'image/png' });
          await navigator.share({
            title: 'اردو شعر',
            files: [file],
          });
        }
      });
    } catch (error) {
      toast({
        title: "خرابی",
        description: "شیئر نہیں ہو سکا",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex">
      <div className="bg-white h-full max-w-md mx-auto flex flex-col w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold font-urdu">شعر کی تصویر بنائیں</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {/* Text Input */}
          <div className="mb-4">
            <Label className="block text-sm font-medium font-urdu mb-2 text-right">
              شعر لکھیں
            </Label>
            <Textarea
              value={shayariText}
              onChange={(e) => setShayariText(e.target.value)}
              className="w-full font-urdu text-right h-32 resize-none"
              placeholder="یہاں اپنا شعر لکھیں..."
              dir="rtl"
            />
          </div>

          {/* Poet Name */}
          <div className="mb-4">
            <Label className="block text-sm font-medium font-urdu mb-2 text-right">
              شاعر کا نام
            </Label>
            <Input
              value={poetName}
              onChange={(e) => setPoetName(e.target.value)}
              className="w-full font-urdu text-right"
              placeholder="شاعر کا نام"
              dir="rtl"
            />
          </div>

          {/* Background Selection */}
          <div className="mb-6">
            <Label className="block text-sm font-medium font-urdu mb-3 text-right">
              پس منظر منتخب کریں
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {backgrounds.map((bg) => (
                <button
                  key={bg.type}
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${bg.preview} border-2 transition-all duration-300 transform ${
                    selectedBackground === bg.type
                      ? "border-primary scale-105 shadow-lg"
                      : "border-transparent hover:border-primary/50 hover:scale-102"
                  }`}
                  onClick={() => setSelectedBackground(bg.type)}
                >
                  <div className="aspect-[4/3] relative">
                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-black/30"></div>
                    
                    {/* Background label */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white font-urdu text-sm font-medium drop-shadow-lg">
                      {bg.label}
                    </div>
                    
                    {/* Selected indicator */}
                    {selectedBackground === bg.type && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Selected background name */}
            {!useCustomImage && (
              <p className="text-center font-urdu text-sm text-muted-foreground mt-3">
                منتخب پس منظر: {backgrounds.find(b => b.type === selectedBackground)?.label}
              </p>
            )}
          </div>

          {/* Custom Background Image Upload */}
          <div className="mb-6">
            <Label className="block text-sm font-medium font-urdu mb-3 text-right">
              اپنی تصویر اپ لوڈ کریں
            </Label>
            
            {!useCustomImage ? (
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-primary transition-colors bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 font-urdu">
                      <span className="font-semibold">کلک کریں</span> یا تصویر گھسیٹیں
                    </p>
                    <p className="text-xs text-gray-500 font-urdu">PNG, JPG یا GIF (زیادہ سے زیادہ 10MB)</p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="relative">
                <div className="w-full h-32 rounded-2xl overflow-hidden border-2 border-primary">
                  <img 
                    src={customImage?.src} 
                    alt="Custom background" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={removeCustomImage}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <p className="text-center font-urdu text-sm text-primary mt-2">
                  آپ کی تصویر استعمال ہو رہی ہے
                </p>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="mb-6">
            <Label className="block text-sm font-medium font-urdu mb-3 text-right">
              پیش منظر
            </Label>
            <div 
              className={`rounded-2xl p-8 aspect-square flex flex-col justify-center text-white shadow-xl relative overflow-hidden ${
                useCustomImage && customImage 
                  ? 'bg-cover bg-center' 
                  : `bg-gradient-to-br ${backgrounds.find(b => b.type === selectedBackground)?.preview || "from-orange-400 to-red-500"}`
              }`}
              style={useCustomImage && customImage ? { backgroundImage: `url(${customImage.src})` } : {}}
            >
              
              {/* Custom image overlay for text readability */}
              {useCustomImage && <div className="absolute inset-0 bg-black/40"></div>}
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full blur-xl translate-y-8 -translate-x-8"></div>
              
              {/* Quote decorations */}
              <div className="absolute top-4 left-4 text-4xl font-serif opacity-20 rotate-180">"</div>
              <div className="absolute bottom-4 right-4 text-4xl font-serif opacity-20">"</div>
              
              <div className="relative z-10">
                <p className="font-urdu text-center leading-relaxed text-lg urdu-text drop-shadow-lg">
                  {shayariText || "یہاں آپ کا شعر دکھایا جائے گا"}
                </p>
                {poetName && (
                  <div className="flex items-center justify-center mt-6">
                    <div className="h-px bg-white/30 flex-1 max-w-16"></div>
                    <p className="font-urdu text-center text-sm mx-4 opacity-90 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                      {poetName}
                    </p>
                    <div className="h-px bg-white/30 flex-1 max-w-16"></div>
                  </div>
                )}
              </div>
              
              {/* Watermark */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-xs opacity-60 font-urdu">
                اردو شاعری
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-200 bg-warm-gray">
          <div className="flex space-x-3 space-x-reverse">
            <Button
              onClick={handleGenerateImage}
              className="flex-1"
              disabled={isGenerating || !shayariText.trim()}
            >
              <Download className="h-4 w-4 mr-2 ml-2" />
              {isGenerating ? "بن رہا ہے..." : "ڈاؤن لوڈ کریں"}
            </Button>
            <Button
              onClick={handleShare}
              variant="secondary"
              className="flex-1"
              disabled={!canvasRef.current}
            >
              <Share className="h-4 w-4 mr-2 ml-2" />
              شیئر کریں
            </Button>
          </div>
        </div>

        {/* Hidden canvas for image generation */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
