import { CompressionMode, CompressorResult } from '../types';
export declare const formatFileSize: (bytes: number) => string;
export declare const compressImage: (file: File, compressionMode: CompressionMode, quality?: number) => Promise<CompressorResult>;
