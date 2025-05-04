import { v4 as uuidv4 } from 'uuid';
import { ConversionOptions, FileInfo } from '../types';
import { compressImage } from './compressor';

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Converts a single file using the specified options
 */
export const convertFile = async (
  fileInfo: FileInfo, 
  options: ConversionOptions
): Promise<FileInfo> => {
  try {
    const { compressedBlob, compressedUrl } = await compressImage(
      fileInfo.file,
      options.compressionMode,
      options.compressionMode === 'lossy' ? options.quality : 100
    );

    let finalBlob = compressedBlob;
    let finalUrl = compressedUrl;

    const fileExtension = fileInfo.file.name.split('.').pop()?.toLowerCase();
    if (options.outputFormat !== fileExtension) {
      const mimeTypes: Record<string, string> = {
        jpg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
      };

      finalBlob = new Blob([compressedBlob], { type: mimeTypes[options.outputFormat] });
      
      URL.revokeObjectURL(compressedUrl);
      finalUrl = URL.createObjectURL(finalBlob);
    }

    return {
      ...fileInfo,
      convertedSize: finalBlob.size,
      outputFormat: options.outputFormat,
      compressedUrl: finalUrl,
      status: 'completed',
    };
  } catch (error) {
    return {
      ...fileInfo,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error',
    };
  }
};

/**
 * Creates a FileInfo object from a File
 */
export const createFileInfo = (file: File): FileInfo => ({
  id: uuidv4(),
  file,
  originalSize: file.size,
  status: 'pending',
});

/**
 * Prepares a file for download
 */
export const downloadFile = (fileInfo: FileInfo): void => {
  if (!fileInfo.compressedUrl) return;

  const originalName = fileInfo.file.name;
  const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
  const extension = fileInfo.outputFormat || originalName.split('.').pop();
  const fileName = `${baseName}.${extension}`;

  const a = document.createElement('a');
  a.href = fileInfo.compressedUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/**
 * Downloads multiple files as a zip
 */
export const downloadFilesAsZip = async (files: FileInfo[]): Promise<void> => {
  const completedFiles = files.filter((file) => file.status === 'completed' && file.compressedUrl);
  
  if (completedFiles.length === 0) return;
  
  if (completedFiles.length === 1) {
    downloadFile(completedFiles[0]);
    return;
  }

  try {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    for (const fileInfo of completedFiles) {
      if (!fileInfo.compressedUrl) continue;

      const response = await fetch(fileInfo.compressedUrl);
      const blob = await response.blob();

      const originalName = fileInfo.file.name;
      const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
      const extension = fileInfo.outputFormat || originalName.split('.').pop();
      const fileName = `${baseName}.${extension}`;

      zip.file(fileName, blob);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(zipBlob);

    const a = document.createElement('a');
    a.href = zipUrl;
    a.download = 'converted-images.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(zipUrl);
  } catch (error) {
    console.error('Failed to create zip file:', error);
  }
}; 