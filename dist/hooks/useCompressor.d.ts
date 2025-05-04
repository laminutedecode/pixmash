import type { CompressionMode, CompressorResult } from '../types';
/**
 * React hook for image compression
 * @returns Image compression utilities
 */
export declare const useCompressor: () => {
    compressImage: (file: File, compressionMode: CompressionMode, quality?: number) => Promise<CompressorResult>;
    formatFileSize: (bytes: number) => string;
};
export default useCompressor;
