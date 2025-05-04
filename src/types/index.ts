export type CompressionMode = 'lossy' | 'lossless';

export type OutputFormat = 'jpg' | 'png' | 'webp' | 'svg';

export interface FileInfo {
  id: string;
  file: File;
  originalSize: number;
  convertedSize?: number;
  outputFormat?: OutputFormat;
  compressedUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface ConversionOptions {
  outputFormat: OutputFormat;
  compressionMode: CompressionMode;
  quality?: number; 
  watermark?: WatermarkOptions;
}

export interface WatermarkOptions {
  type: 'text' | 'image';
  content: string; // Text content or image URL
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity?: number; // 0-1
  size?: number; // % of image size for text or px for image
  color?: string; // for text watermark
  font?: string; // for text watermark
}

// Declare React types only when React is available
export type ReactSetState<T> = ((prevState: T) => T) | T;
export type ReactDispatch<T> = (value: ReactSetState<T>) => void;

// Generic interfaces for unified API
export interface CompressorResult {
  compressedBlob: Blob;
  compressedUrl: string;
}

export interface CompressorOptions {
  compressionMode: CompressionMode;
  quality?: number;
  watermark?: WatermarkOptions;
}

export interface ConvertorOptions extends CompressorOptions {
  outputFormat: OutputFormat;
} 