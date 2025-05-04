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
    watermark?: WatermarkOptions;
}
export interface WatermarkOptions {
    type: 'text' | 'image';
    content: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    opacity?: number;
    size?: number;
    color?: string;
    font?: string;
}
export type ReactSetState<T> = ((prevState: T) => T) | T;
export type ReactDispatch<T> = (value: ReactSetState<T>) => void;
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
