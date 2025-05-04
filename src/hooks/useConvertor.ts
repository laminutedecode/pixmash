import { useCallback, useState } from 'react';
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
 * React hook for file conversion
 * @returns File conversion utilities and state
 */
const useConvertor = () => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [converting, setConverting] = useState(false);
  const { compressImage } = useCompressor();

  const addFiles = useCallback((newFiles: FileList) => {
    const fileInfoArray: FileInfo[] = Array.from(newFiles).map(createFileInfo);
    setFiles((prevFiles) => [...prevFiles, ...fileInfoArray]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((file) => file.id !== id);
      const fileToRemove = prevFiles.find((file) => file.id === id);
      if (fileToRemove?.compressedUrl) {
        URL.revokeObjectURL(fileToRemove.compressedUrl);
      }
      return updatedFiles;
    });
  }, []);

  const clearFiles = useCallback(() => {
    files.forEach((file) => {
      if (file.compressedUrl) {
        URL.revokeObjectURL(file.compressedUrl);
      }
    });
    setFiles([]);
  }, [files]);

  const convertSingleFile = useCallback(
    async (fileInfo: FileInfo, options: ConversionOptions): Promise<FileInfo> => {
      return convertFile(fileInfo, options);
    },
    []
  );

  const convertAllFiles = useCallback(
    async (options: ConversionOptions) => {
      if (files.length === 0) return;

      setConverting(true);
      const startTime = Date.now();

      try {
        for (let i = 0; i < files.length; i++) {
          if (files[i].status === 'completed') continue;

          setFiles((prevFiles) => {
            const updatedFiles = [...prevFiles];
            updatedFiles[i] = { ...updatedFiles[i], status: 'processing' };
            return updatedFiles;
          });

          const processedFile = await convertSingleFile(files[i], options);

          setFiles((prevFiles) => {
            const updatedFiles = [...prevFiles];
            updatedFiles[i] = processedFile;
            return updatedFiles;
          });
        }
        
        const processingTime = Date.now() - startTime;
        if (processingTime < 3000) {
          await delay(3000 - processingTime);
        }
      } catch (error) {
        console.error('Error converting files:', error);
      } finally {
        setConverting(false);
      }
    },
    [files, convertSingleFile]
  );

  const downloadFileHook = useCallback((fileInfo: FileInfo) => {
    downloadFile(fileInfo);
  }, []);

  const downloadAllFiles = useCallback(async () => {
    await downloadFilesAsZip(files);
  }, [files]);

  return {
    files,
    converting,
    addFiles,
    removeFile,
    clearFiles,
    convertAllFiles,
    downloadFile: downloadFileHook,
    downloadAllFiles,
  };
};

export default useConvertor; 