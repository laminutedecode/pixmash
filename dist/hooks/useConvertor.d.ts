import { ConversionOptions, FileInfo } from '../types';
/**
 * React hook for file conversion
 * @returns File conversion utilities and state
 */
declare const useConvertor: () => {
    files: FileInfo[];
    converting: boolean;
    addFiles: (newFiles: FileList) => void;
    removeFile: (id: string) => void;
    clearFiles: () => void;
    convertAllFiles: (options: ConversionOptions) => Promise<void>;
    downloadFile: (fileInfo: FileInfo) => void;
    downloadAllFiles: () => Promise<void>;
};
export default useConvertor;
