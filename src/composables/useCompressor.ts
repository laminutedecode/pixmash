import type { CompressionMode, CompressorResult } from '../types';
import { compressImage, formatFileSize } from '../utils/compressor';

/**
 * Vue composable for image compression
 * @returns Image compression utilities
 */
export const useCompressor = () => {
  /**
   * Compress an image file
   */
  const compressImageFn = async (
    file: File,
    compressionMode: CompressionMode,
    quality: number = compressionMode === 'lossy' ? 80 : 100
  ): Promise<CompressorResult> => {
    return compressImage(file, compressionMode, quality);
  };

  return {
    compressImage: compressImageFn,
    formatFileSize
  };
};

export default useCompressor; 