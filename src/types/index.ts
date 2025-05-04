export type CompressionMode = 'lossy' | 'lossless';

export type OutputFormat = 'jpg' | 'png' | 'webp';

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
}

export interface ConvertorOptions extends CompressorOptions {
  outputFormat: OutputFormat;
} 