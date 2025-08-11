export type BackgroundType = 'sunset' | 'mountain' | 'night' | 'garden' | 'vintage' | 'minimal' | 'ocean' | 'desert' | 'forest' | 'royal' | 'romantic' | 'mystical';

interface ShayariImageOptions {
  text: string;
  poet?: string;
  background: BackgroundType;
  customImage?: HTMLImageElement;
}

const backgroundGradients: Record<BackgroundType, { colors: string[]; style: 'linear' | 'radial' }> = {
  sunset: { colors: ['#ff7e5f', '#feb47b', '#ff6b6b'], style: 'linear' },
  mountain: { colors: ['#667eea', '#764ba2', '#667eea'], style: 'linear' },
  night: { colors: ['#1a1a2e', '#16213e', '#0f3460'], style: 'linear' },
  garden: { colors: ['#56ab2f', '#a8e6cf', '#56ab2f'], style: 'linear' },
  vintage: { colors: ['#ffeaa7', '#fab1a0', '#e17055'], style: 'linear' },
  minimal: { colors: ['#f8f9fa', '#e9ecef', '#f8f9fa'], style: 'linear' },
  ocean: { colors: ['#00c6ff', '#0072ff', '#74b9ff'], style: 'linear' },
  desert: { colors: ['#f7971e', '#ffd200', '#ffb347'], style: 'linear' },
  forest: { colors: ['#11998e', '#38ef7d', '#2d5a27'], style: 'linear' },
  royal: { colors: ['#667eea', '#764ba2', '#f093fb'], style: 'radial' },
  romantic: { colors: ['#ff9a9e', '#fecfef', '#fecfef'], style: 'radial' },
  mystical: { colors: ['#4b0082', '#8a2be2', '#da70d6'], style: 'radial' },
};

export async function generateShayariImage(options: ShayariImageOptions): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  // Set canvas size (square format for social media)
  const size = 800;
  canvas.width = size;
  canvas.height = size;

  // Draw background
  if (options.customImage) {
    // Use custom uploaded image as background
    ctx.drawImage(options.customImage, 0, 0, size, size);
    
    // Add darker overlay for better text readability on custom images
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, size, size);
  } else {
    // Use gradient backgrounds
    const bgConfig = backgroundGradients[options.background];
    const gradient = bgConfig.style === 'linear' 
      ? ctx.createLinearGradient(0, 0, size, size)
      : ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);

    bgConfig.colors.forEach((color, index) => {
      gradient.addColorStop(index / (bgConfig.colors.length - 1), color);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Add subtle overlay for better text readability
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, size, size);
  }

  // Set up text styling
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'white';
  
  // Main text (shayari)
  const lines = options.text.split('\n').filter(line => line.trim());
  const lineHeight = 60;
  const startY = size / 2 - (lines.length * lineHeight) / 2;

  // Use a web-safe font that supports RTL
  ctx.font = 'bold 36px serif';
  
  lines.forEach((line, index) => {
    const y = startY + (index * lineHeight);
    
    // Add text shadow for better readability
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 4;
    
    ctx.fillText(line.trim(), size / 2, y);
  });

  // Poet attribution
  if (options.poet) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 2;
    ctx.font = '24px serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(`- ${options.poet}`, size / 2, size - 100);
  }

  // Add watermark
  ctx.shadowColor = 'transparent';
  ctx.font = '18px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText('اردو شاعری', size / 2, size - 40);

  return canvas;
}
