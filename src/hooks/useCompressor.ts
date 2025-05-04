import { useCallback } from 'react';
import type { CompressionMode, CompressorResult } from '../types';
import { compressImage, formatFileSize } from '../utils/compressor';

/**
 * React hook for image compression
 * @returns Image compression utilities
 */
export const useCompressor = () => {
  const compressImageHook = useCallback(
    async (
      file: File,
      compressionMode: CompressionMode,
      quality: number = compressionMode === 'lossy' ? 80 : 100
    ): Promise<CompressorResult> => {
      return compressImage(file, compressionMode, quality);
    },
    []
  );

  return { 
    compressImage: compressImageHook, 
    formatFileSize 
  };
};

export default useCompressor; 