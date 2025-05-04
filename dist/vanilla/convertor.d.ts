import type { ConversionOptions, FileInfo } from '../types';
/**
 * Class representing a file conversion manager
 */
export declare class Convertor {
    private files;
    private converting;
    private compressor;
    private onStateChange?;
    /**
     * Create a new Convertor instance
     * @param onStateChange - Optional callback to be notified of state changes
     */
    constructor(onStateChange?: (files: FileInfo[], converting: boolean) => void);
    /**
     * Get the current files
     */
    getFiles(): FileInfo[];
    /**
     * Check if files are currently being converted
     */
    isConverting(): boolean;
    /**
     * Trigger the state change callback
     */
    private triggerStateChange;
    /**
     * Add files to the conversion queue
     * @param newFiles - The files to add
     */
    addFiles(newFiles: FileList): void;
    /**
     * Remove a file from the conversion queue
     * @param id - The ID of the file to remove
     */
    removeFile(id: string): void;
    /**
     * Clear all files from the conversion queue
     */
    clearFiles(): void;
    /**
     * Convert a single file
     * @param fileInfo - The file to convert
     * @param options - The conversion options
     * @returns The converted file
     */
    convertSingleFile(fileInfo: FileInfo, options: ConversionOptions): Promise<FileInfo>;
    /**
     * Convert all files in the queue
     * @param options - The conversion options
     */
    convertAllFiles(options: ConversionOptions): Promise<void>;
    /**
     * Download a single converted file
     * @param fileInfo - The file to download
     */
    downloadFile(fileInfo: FileInfo): void;
    /**
     * Download all converted files as a zip
     */
    downloadAllFiles(): Promise<void>;
}
export default Convertor;
