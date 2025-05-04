import type { ConversionOptions, FileInfo } from '../types';
import {
  convertFile,
  createFileInfo,
  delay,
  downloadFile,
  downloadFilesAsZip
} from '../utils/convertor';
import { Compressor } from './compressor';

/**
 * Class representing a file conversion manager
 */
export class Convertor {
  private files: FileInfo[] = [];
  private converting: boolean = false;
  private compressor: Compressor;
  private onStateChange?: (files: FileInfo[], converting: boolean) => void;

  /**
   * Create a new Convertor instance
   * @param onStateChange - Optional callback to be notified of state changes
   */
  constructor(onStateChange?: (files: FileInfo[], converting: boolean) => void) {
    this.compressor = new Compressor();
    this.onStateChange = onStateChange;
  }

  /**
   * Get the current files
   */
  getFiles(): FileInfo[] {
    return [...this.files];
  }

  /**
   * Check if files are currently being converted
   */
  isConverting(): boolean {
    return this.converting;
  }

  /**
   * Trigger the state change callback
   */
  private triggerStateChange(): void {
    if (this.onStateChange) {
      this.onStateChange([...this.files], this.converting);
    }
  }

  /**
   * Add files to the conversion queue
   * @param newFiles - The files to add
   */
  addFiles(newFiles: FileList): void {
    const fileInfoArray: FileInfo[] = Array.from(newFiles).map(createFileInfo);
    this.files.push(...fileInfoArray);
    this.triggerStateChange();
  }

  /**
   * Remove a file from the conversion queue
   * @param id - The ID of the file to remove
   */
  removeFile(id: string): void {
    const fileToRemove = this.files.find((file) => file.id === id);
    if (fileToRemove?.compressedUrl) {
      URL.revokeObjectURL(fileToRemove.compressedUrl);
    }
    this.files = this.files.filter((file) => file.id !== id);
    this.triggerStateChange();
  }

  /**
   * Clear all files from the conversion queue
   */
  clearFiles(): void {
    this.files.forEach((file) => {
      if (file.compressedUrl) {
        URL.revokeObjectURL(file.compressedUrl);
      }
    });
    this.files = [];
    this.triggerStateChange();
  }

  /**
   * Convert a single file
   * @param fileInfo - The file to convert
   * @param options - The conversion options
   * @returns The converted file
   */
  async convertSingleFile(fileInfo: FileInfo, options: ConversionOptions): Promise<FileInfo> {
    return convertFile(fileInfo, options);
  }

  /**
   * Convert all files in the queue
   * @param options - The conversion options
   */
  async convertAllFiles(options: ConversionOptions): Promise<void> {
    if (this.files.length === 0) return;

    this.converting = true;
    this.triggerStateChange();
    const startTime = Date.now();

    try {
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].status === 'completed') continue;

        // Set file status to processing
        this.files[i] = { ...this.files[i], status: 'processing' };
        this.triggerStateChange();

        // Process the file
        const processedFile = await this.convertSingleFile(this.files[i], options);

        // Update file with processed result
        this.files[i] = processedFile;
        this.triggerStateChange();
      }
      
      const processingTime = Date.now() - startTime;
      if (processingTime < 3000) {
        await delay(3000 - processingTime);
      }
    } catch (error) {
      console.error('Error converting files:', error);
    } finally {
      this.converting = false;
      this.triggerStateChange();
    }
  }

  /**
   * Download a single converted file
   * @param fileInfo - The file to download
   */
  downloadFile(fileInfo: FileInfo): void {
    downloadFile(fileInfo);
  }

  /**
   * Download all converted files as a zip
   */
  async downloadAllFiles(): Promise<void> {
    await downloadFilesAsZip(this.files);
  }
}

export default Convertor; 