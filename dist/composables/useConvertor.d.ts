import { ConversionOptions, FileInfo } from '../types';
/**
 * Vue composable for file conversion
 * @returns File conversion utilities and state
 */
export declare const useConvertor: () => {
    files: import("vue").Ref<{
        id: string;
        file: {
            readonly lastModified: number;
            readonly name: string;
            readonly webkitRelativePath: string;
            readonly size: number;
            readonly type: string;
            arrayBuffer: () => Promise<ArrayBuffer>;
            bytes: () => Promise<Uint8Array>;
            slice: (start?: number, end?: number, contentType?: string) => Blob;
            stream: () => ReadableStream<Uint8Array>;
            text: () => Promise<string>;
        };
        originalSize: number;
        convertedSize?: number | undefined;
        outputFormat?: import("../types").OutputFormat | undefined;
        compressedUrl?: string | undefined;
        status: "pending" | "processing" | "completed" | "error";
        error?: string | undefined;
    }[], FileInfo[] | {
        id: string;
        file: {
            readonly lastModified: number;
            readonly name: string;
            readonly webkitRelativePath: string;
            readonly size: number;
            readonly type: string;
            arrayBuffer: () => Promise<ArrayBuffer>;
            bytes: () => Promise<Uint8Array>;
            slice: (start?: number, end?: number, contentType?: string) => Blob;
            stream: () => ReadableStream<Uint8Array>;
            text: () => Promise<string>;
        };
        originalSize: number;
        convertedSize?: number | undefined;
        outputFormat?: import("../types").OutputFormat | undefined;
        compressedUrl?: string | undefined;
        status: "pending" | "processing" | "completed" | "error";
        error?: string | undefined;
    }[]>;
    converting: import("vue").Ref<boolean, boolean>;
    addFiles: (newFiles: FileList) => void;
    removeFile: (id: string) => void;
    clearFiles: () => void;
    convertAllFiles: (options: ConversionOptions) => Promise<void>;
    downloadFile: (fileInfo: FileInfo) => void;
    downloadAllFiles: () => Promise<void>;
};
export default useConvertor;
