import { ConversionOptions, FileInfo } from '../types';
export declare const delay: (ms: number) => Promise<unknown>;
/**
 * Converts a single file using the specified options
 */
export declare const convertFile: (fileInfo: FileInfo, options: ConversionOptions) => Promise<FileInfo>;
/**
 * Creates a FileInfo object from a File
 */
export declare const createFileInfo: (file: File) => FileInfo;
/**
 * Prepares a file for download
 */
export declare const downloadFile: (fileInfo: FileInfo) => void;
/**
 * Downloads multiple files as a zip
 */
export declare const downloadFilesAsZip: (files: FileInfo[]) => Promise<void>;
