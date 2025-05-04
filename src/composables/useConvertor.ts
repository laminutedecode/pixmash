import { ref } from 'vue';
import { ConversionOptions, FileInfo } from '../types';
import {
  convertFile,
  createFileInfo,
  delay,
  downloadFile,
  downloadFilesAsZip
} from '../utils/convertor';
import { useCompressor } from './useCompressor';

/**
 * Vue composable for file conversion
 * @returns File conversion utilities and state
 */
export const useConvertor = () => {
  const files = ref<FileInfo[]>([]);
  const converting = ref(false);
  const { compressImage } = useCompressor();

  /**
   * Add files to the conversion queue
   */
  const addFiles = (newFiles: FileList) => {
    const fileInfoArray: FileInfo[] = Array.from(newFiles).map(createFileInfo);
    files.value = [...files.value, ...fileInfoArray];
  };

  /**
   * Remove a file from the conversion queue
   */
  const removeFile = (id: string) => {
    const fileToRemove = files.value.find((file: FileInfo) => file.id === id);
    if (fileToRemove?.compressedUrl) {
      URL.revokeObjectURL(fileToRemove.compressedUrl);
    }
    files.value = files.value.filter((file: FileInfo) => file.id !== id);
  };

  /**
   * Clear all files from the conversion queue
   */
  const clearFiles = () => {
    files.value.forEach((file: FileInfo) => {
      if (file.compressedUrl) {
        URL.revokeObjectURL(file.compressedUrl);
      }
    });
    files.value = [];
  };

  /**
   * Convert a single file
   */
  const convertSingleFile = async (fileInfo: FileInfo, options: ConversionOptions): Promise<FileInfo> => {
    return convertFile(fileInfo, options);
  };

  /**
   * Convert all files in the queue
   */
  const convertAllFiles = async (options: ConversionOptions) => {
    if (files.value.length === 0) return;

    converting.value = true;
    const startTime = Date.now();

    try {
      for (let i = 0; i < files.value.length; i++) {
        if (files.value[i].status === 'completed') continue;

        // Set file status to processing
        const updatedFiles = [...files.value];
        updatedFiles[i] = { ...updatedFiles[i], status: 'processing' };
        files.value = updatedFiles;

        // Process the file
        const processedFile = await convertSingleFile(files.value[i], options);

        // Update file with processed result
        const newUpdatedFiles = [...files.value];
        newUpdatedFiles[i] = processedFile;
        files.value = newUpdatedFiles;
      }
      
      const processingTime = Date.now() - startTime;
      if (processingTime < 3000) {
        await delay(3000 - processingTime);
      }
    } catch (error) {
      console.error('Error converting files:', error);
    } finally {
      converting.value = false;
    }
  };

  /**
   * Download a single converted file
   */
  const downloadSingleFile = (fileInfo: FileInfo) => {
    downloadFile(fileInfo);
  };

  /**
   * Download all converted files as a zip
   */
  const downloadAllFiles = async () => {
    await downloadFilesAsZip(files.value);
  };

  return {
    files,
    converting,
    addFiles,
    removeFile,
    clearFiles,
    convertAllFiles,
    downloadFile: downloadSingleFile,
    downloadAllFiles,
  };
};

export default useConvertor; 