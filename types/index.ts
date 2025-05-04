export type CompressionMode = 'lossy' | 'lossless';

export type OutputFormat = 'jpg' | 'png' | 'webp' | 'svg';

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
}


export interface ButtonsDownloadConvertorProps {
  onDownloadAll: () => void;
  hasCompletedFiles: boolean;
}

export interface ModalPreviewProps {
  file: FileInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface OptionsConvertorProps {
  options: ConversionOptions;
  setOptions: React.Dispatch<React.SetStateAction<ConversionOptions>>;
  onConvert: () => void;
  isConverting: boolean;
  hasFiles: boolean;
}

export interface TableConvertorProps {
  files: FileInfo[];
  onRemoveFile: (id: string) => void;
  onDownloadFile: (file: FileInfo) => void;
  onPreviewFile: (file: FileInfo) => void;
  isConverting: boolean;
}

export interface UploadsConvertorProps {
  onFilesSelected: (files: FileList) => void;
  isConverting: boolean;
  onClearFiles: () => void;
}


