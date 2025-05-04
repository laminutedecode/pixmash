import type { CompressionMode, CompressorResult } from '../types';
import { compressImage, formatFileSize } from '../utils/compressor';

/**
 * Vanilla JavaScript class for image compression
 */
export class Compressor {
  /**
   * Compress an image file
   * @param file - The file to compress
   * @param compressionMode - The compression mode to use
   * @param quality - The quality to use (for lossy compression)
   * @returns A promise resolving to the compressed image blob and URL
   */
  async compressImage(
    file: File,
    compressionMode: CompressionMode,
    quality: number = compressionMode === 'lossy' ? 80 : 100
  ): Promise<CompressorResult> {
    return compressImage(file, compressionMode, quality);
  }

  /**
   * Format a file size in bytes to a human-readable string
   * @param bytes - The file size in bytes
   * @returns A formatted string (e.g. "1.5 MB")
   */
  formatFileSize(bytes: number): string {
    return formatFileSize(bytes);
  }
}

export default Compressor; 