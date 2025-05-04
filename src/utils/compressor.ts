import { CompressionMode, CompressorResult, WatermarkOptions } from '../types';

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const resizeImageIfNeeded = (img: HTMLImageElement, maxDimension = 2048) => {
  let width = img.width;
  let height = img.height;
  
  if (width > maxDimension || height > maxDimension) {
    if (width > height) {
      height = Math.round((height / width) * maxDimension);
      width = maxDimension;
    } else {
      width = Math.round((width / height) * maxDimension);
      height = maxDimension;
    }
  }
  
  return { width, height };
};

const applyWatermark = async (
  canvas: HTMLCanvasElement, 
  ctx: CanvasRenderingContext2D,
  watermark: WatermarkOptions
): Promise<void> => {
  const width = canvas.width;
  const height = canvas.height;
  
  // Save the current context state
  ctx.save();
  
  // Set opacity
  ctx.globalAlpha = watermark.opacity !== undefined ? watermark.opacity : 0.5;
  
  // Calculate position
  let x = 0;
  let y = 0;
  
  if (watermark.type === 'text') {
    // Apply text watermark
    const fontSize = watermark.size !== undefined ? Math.floor(height * watermark.size / 100) : Math.floor(height * 0.05);
    const fontFamily = watermark.font || 'Arial';
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = watermark.color || '#ffffff';
    
    const textMetrics = ctx.measureText(watermark.content);
    const textWidth = textMetrics.width;
    const textHeight = fontSize;
    
    switch (watermark.position) {
      case 'top-left':
        x = 20;
        y = 20 + textHeight;
        break;
      case 'top-right':
        x = width - textWidth - 20;
        y = 20 + textHeight;
        break;
      case 'bottom-left':
        x = 20;
        y = height - 20;
        break;
      case 'bottom-right':
        x = width - textWidth - 20;
        y = height - 20;
        break;
      case 'center':
      default:
        x = (width - textWidth) / 2;
        y = (height + textHeight) / 2;
        break;
    }
    
    ctx.fillText(watermark.content, x, y);
  } else if (watermark.type === 'image') {
    // Apply image watermark
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const imgSize = watermark.size || Math.min(width, height) * 0.2;
        const aspectRatio = img.width / img.height;
        const watermarkWidth = imgSize;
        const watermarkHeight = imgSize / aspectRatio;
        
        switch (watermark.position) {
          case 'top-left':
            x = 20;
            y = 20;
            break;
          case 'top-right':
            x = width - watermarkWidth - 20;
            y = 20;
            break;
          case 'bottom-left':
            x = 20;
            y = height - watermarkHeight - 20;
            break;
          case 'bottom-right':
            x = width - watermarkWidth - 20;
            y = height - watermarkHeight - 20;
            break;
          case 'center':
          default:
            x = (width - watermarkWidth) / 2;
            y = (height - watermarkHeight) / 2;
            break;
        }
        
        ctx.drawImage(img, x, y, watermarkWidth, watermarkHeight);
        resolve();
      };
      
      img.onerror = () => {
        console.error('Failed to load watermark image');
        resolve(); // Continue without watermark rather than failing
      };
      
      img.src = watermark.content;
    });
  }
  
  // Restore the context state
  ctx.restore();
};

export const compressImage = async (
  file: File,
  compressionMode: CompressionMode,
  quality: number = compressionMode === 'lossy' ? 80 : 100,
  watermark?: WatermarkOptions
): Promise<CompressorResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = async () => {
        const { width, height } = resizeImageIfNeeded(img);
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d', { 
          alpha: file.type.includes('png') || file.type.includes('svg'),
          willReadFrequently: true
        });
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Apply watermark if provided
        if (watermark) {
          await applyWatermark(canvas, ctx, watermark);
        }
        
        const originalFormat = file.type.split('/')[1]?.toLowerCase() || 'jpeg';
        let mimeType = 'image/jpeg';
        let bestQuality: number | null = compressionMode === 'lossy' ? quality / 100 : 0.92;
        
        if (compressionMode === 'lossless') {
          if (originalFormat === 'png' || originalFormat === 'gif') {
            mimeType = 'image/png';
            bestQuality = null; 
          } else if (originalFormat === 'webp') {
            mimeType = 'image/webp';
            bestQuality = 1.0; 
          } else {        
            mimeType = 'image/jpeg';
            bestQuality = 0.95;
          }
        } else {
          if (originalFormat === 'webp') {
            mimeType = 'image/webp';
          } else {
            mimeType = 'image/jpeg';
          }
          
          const pixelCount = width * height;
          if (pixelCount > 4000000) { // >4 mégapixels
            bestQuality = Math.max(0.65, bestQuality * 0.85);
          }
          
          bestQuality = Math.max(0.3, Math.min(bestQuality, 0.9));
        }
        
        const tryCompression = (currentQuality: number | null) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              
              if (blob.size >= file.size * 0.95) {
                if (compressionMode === 'lossy' && currentQuality && currentQuality > 0.4) {
                  tryCompression(currentQuality - 0.1);
                  return;
                }
                
                if (width > 1600 || height > 1600) {
                  const newCanvas = document.createElement('canvas');
                  const newWidth = Math.round(width * 0.75);
                  const newHeight = Math.round(height * 0.75);
                  
                  newCanvas.width = newWidth;
                  newCanvas.height = newHeight;
                  const newCtx = newCanvas.getContext('2d');
                  
                  if (newCtx) {
                    newCtx.drawImage(img, 0, 0, newWidth, newHeight);
                    newCanvas.toBlob(
                      (resizedBlob) => {
                        if (!resizedBlob || resizedBlob.size >= file.size * 0.95) {
                          resolve({ 
                            compressedBlob: file, 
                            compressedUrl: URL.createObjectURL(file) 
                          });
                        } else {
                          const compressedUrl = URL.createObjectURL(resizedBlob);
                          resolve({ compressedBlob: resizedBlob, compressedUrl });
                        }
                      },
                      mimeType,
                      compressionMode === 'lossy' ? 0.7 : undefined
                    );
                  } else {
                    resolve({ 
                      compressedBlob: file, 
                      compressedUrl: URL.createObjectURL(file) 
                    });
                  }
                } else {
                  resolve({ 
                    compressedBlob: file, 
                    compressedUrl: URL.createObjectURL(file) 
                  });
                }
              } else {
                const compressedUrl = URL.createObjectURL(blob);
                resolve({ compressedBlob: blob, compressedUrl });
              }
            },
            mimeType,
            currentQuality || undefined
          );
        };
        
        tryCompression(bestQuality);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = event.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}; 