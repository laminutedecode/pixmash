import { v4 } from 'uuid';
import { useCallback, useState } from 'react';
import { ref } from 'vue';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var formatFileSize = function (bytes) {
    if (bytes === 0)
        return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
var resizeImageIfNeeded = function (img, maxDimension) {
    if (maxDimension === void 0) { maxDimension = 2048; }
    var width = img.width;
    var height = img.height;
    if (width > maxDimension || height > maxDimension) {
        if (width > height) {
            height = Math.round((height / width) * maxDimension);
            width = maxDimension;
        }
        else {
            width = Math.round((width / height) * maxDimension);
            height = maxDimension;
        }
    }
    return { width: width, height: height };
};
var compressImage = function (file_1, compressionMode_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([file_1, compressionMode_1], args_1, true), void 0, function (file, compressionMode, quality) {
        if (quality === void 0) { quality = compressionMode === 'lossy' ? 80 : 100; }
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        var _a;
                        var img = new Image();
                        img.onload = function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a, width, height, canvas, ctx, originalFormat, mimeType, bestQuality, pixelCount, tryCompression;
                            var _b;
                            return __generator(this, function (_c) {
                                _a = resizeImageIfNeeded(img), width = _a.width, height = _a.height;
                                canvas = document.createElement('canvas');
                                canvas.width = width;
                                canvas.height = height;
                                ctx = canvas.getContext('2d', {
                                    alpha: file.type.includes('png') || file.type.includes('svg'),
                                    willReadFrequently: true
                                });
                                if (!ctx) {
                                    reject(new Error('Failed to get canvas context'));
                                    return [2 /*return*/];
                                }
                                ctx.imageSmoothingEnabled = true;
                                ctx.imageSmoothingQuality = 'high';
                                ctx.drawImage(img, 0, 0, width, height);
                                originalFormat = ((_b = file.type.split('/')[1]) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || 'jpeg';
                                mimeType = 'image/jpeg';
                                bestQuality = compressionMode === 'lossy' ? quality / 100 : 0.92;
                                if (compressionMode === 'lossless') {
                                    if (originalFormat === 'png' || originalFormat === 'gif') {
                                        mimeType = 'image/png';
                                        bestQuality = null;
                                    }
                                    else if (originalFormat === 'webp') {
                                        mimeType = 'image/webp';
                                        bestQuality = 1.0;
                                    }
                                    else {
                                        mimeType = 'image/jpeg';
                                        bestQuality = 0.95;
                                    }
                                }
                                else {
                                    if (originalFormat === 'webp') {
                                        mimeType = 'image/webp';
                                    }
                                    else {
                                        mimeType = 'image/jpeg';
                                    }
                                    pixelCount = width * height;
                                    if (pixelCount > 4000000) {
                                        bestQuality = Math.max(0.65, bestQuality * 0.85);
                                    }
                                    bestQuality = Math.max(0.3, Math.min(bestQuality, 0.9));
                                }
                                tryCompression = function (currentQuality) {
                                    canvas.toBlob(function (blob) {
                                        if (!blob) {
                                            reject(new Error('Failed to compress image'));
                                            return;
                                        }
                                        if (blob.size >= file.size * 0.95) {
                                            if (compressionMode === 'lossy' && currentQuality && currentQuality > 0.4) {
                                                tryCompression(currentQuality - 0.1);
                                                return;
                                            }
                                            if (width > 1600 || height > 1600) {
                                                var newCanvas = document.createElement('canvas');
                                                var newWidth = Math.round(width * 0.75);
                                                var newHeight = Math.round(height * 0.75);
                                                newCanvas.width = newWidth;
                                                newCanvas.height = newHeight;
                                                var newCtx = newCanvas.getContext('2d');
                                                if (newCtx) {
                                                    newCtx.drawImage(img, 0, 0, newWidth, newHeight);
                                                    newCanvas.toBlob(function (resizedBlob) {
                                                        if (!resizedBlob || resizedBlob.size >= file.size * 0.95) {
                                                            resolve({
                                                                compressedBlob: file,
                                                                compressedUrl: URL.createObjectURL(file)
                                                            });
                                                        }
                                                        else {
                                                            var compressedUrl = URL.createObjectURL(resizedBlob);
                                                            resolve({ compressedBlob: resizedBlob, compressedUrl: compressedUrl });
                                                        }
                                                    }, mimeType, compressionMode === 'lossy' ? 0.7 : undefined);
                                                }
                                                else {
                                                    resolve({
                                                        compressedBlob: file,
                                                        compressedUrl: URL.createObjectURL(file)
                                                    });
                                                }
                                            }
                                            else {
                                                resolve({
                                                    compressedBlob: file,
                                                    compressedUrl: URL.createObjectURL(file)
                                                });
                                            }
                                        }
                                        else {
                                            var compressedUrl = URL.createObjectURL(blob);
                                            resolve({ compressedBlob: blob, compressedUrl: compressedUrl });
                                        }
                                    }, mimeType, currentQuality !== null ? currentQuality : undefined);
                                };
                                tryCompression(bestQuality);
                                return [2 /*return*/];
                            });
                        }); };
                        img.onerror = function () {
                            reject(new Error('Failed to load image'));
                        };
                        if ((_a = event.target) === null || _a === void 0 ? void 0 : _a.result) {
                            img.src = event.target.result;
                        }
                        else {
                            reject(new Error('Failed to read file'));
                        }
                    };
                    reader.onerror = function () {
                        reject(new Error('Failed to read file'));
                    };
                    reader.readAsDataURL(file);
                })];
        });
    });
};

var delay = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
/**
 * Converts a single file using the specified options
 */
var convertFile = function (fileInfo, options) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, compressedBlob, compressedUrl, finalBlob, finalUrl, fileExtension, mimeTypes, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, compressImage(fileInfo.file, options.compressionMode, options.compressionMode === 'lossy' ? options.quality : 100)];
            case 1:
                _a = _c.sent(), compressedBlob = _a.compressedBlob, compressedUrl = _a.compressedUrl;
                finalBlob = compressedBlob;
                finalUrl = compressedUrl;
                fileExtension = (_b = fileInfo.file.name.split('.').pop()) === null || _b === void 0 ? void 0 : _b.toLowerCase();
                if (options.outputFormat !== fileExtension) {
                    mimeTypes = {
                        jpg: 'image/jpeg',
                        png: 'image/png',
                        webp: 'image/webp',
                    };
                    finalBlob = new Blob([compressedBlob], { type: mimeTypes[options.outputFormat] });
                    URL.revokeObjectURL(compressedUrl);
                    finalUrl = URL.createObjectURL(finalBlob);
                }
                return [2 /*return*/, __assign(__assign({}, fileInfo), { convertedSize: finalBlob.size, outputFormat: options.outputFormat, compressedUrl: finalUrl, status: 'completed' })];
            case 2:
                error_1 = _c.sent();
                return [2 /*return*/, __assign(__assign({}, fileInfo), { error: error_1 instanceof Error ? error_1.message : 'Unknown error', status: 'error' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * Creates a FileInfo object from a File
 */
var createFileInfo = function (file) { return ({
    id: v4(),
    file: file,
    originalSize: file.size,
    status: 'pending',
}); };
/**
 * Prepares a file for download
 */
var downloadFile = function (fileInfo) {
    if (!fileInfo.compressedUrl)
        return;
    var originalName = fileInfo.file.name;
    var baseName = originalName.substring(0, originalName.lastIndexOf('.'));
    var extension = fileInfo.outputFormat || originalName.split('.').pop();
    var fileName = "".concat(baseName, ".").concat(extension);
    var a = document.createElement('a');
    a.href = fileInfo.compressedUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};
/**
 * Downloads multiple files as a zip
 */
var downloadFilesAsZip = function (files) { return __awaiter(void 0, void 0, void 0, function () {
    var completedFiles, JSZip, zip, _i, completedFiles_1, fileInfo, response, blob, originalName, baseName, extension, fileName, zipBlob, zipUrl, a, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                completedFiles = files.filter(function (file) { return file.status === 'completed' && file.compressedUrl; });
                if (completedFiles.length === 0)
                    return [2 /*return*/];
                if (completedFiles.length === 1) {
                    downloadFile(completedFiles[0]);
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 9, , 10]);
                return [4 /*yield*/, import('jszip')];
            case 2:
                JSZip = (_a.sent()).default;
                zip = new JSZip();
                _i = 0, completedFiles_1 = completedFiles;
                _a.label = 3;
            case 3:
                if (!(_i < completedFiles_1.length)) return [3 /*break*/, 7];
                fileInfo = completedFiles_1[_i];
                if (!fileInfo.compressedUrl)
                    return [3 /*break*/, 6];
                return [4 /*yield*/, fetch(fileInfo.compressedUrl)];
            case 4:
                response = _a.sent();
                return [4 /*yield*/, response.blob()];
            case 5:
                blob = _a.sent();
                originalName = fileInfo.file.name;
                baseName = originalName.substring(0, originalName.lastIndexOf('.'));
                extension = fileInfo.outputFormat || originalName.split('.').pop();
                fileName = "".concat(baseName, ".").concat(extension);
                zip.file(fileName, blob);
                _a.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 3];
            case 7: return [4 /*yield*/, zip.generateAsync({ type: 'blob' })];
            case 8:
                zipBlob = _a.sent();
                zipUrl = URL.createObjectURL(zipBlob);
                a = document.createElement('a');
                a.href = zipUrl;
                a.download = 'converted-images.zip';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(zipUrl);
                return [3 /*break*/, 10];
            case 9:
                error_2 = _a.sent();
                console.error('Failed to create zip file:', error_2);
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };

/**
 * React hook for image compression
 * @returns Image compression utilities
 */
var useCompressor$1 = function () {
    var compressImageHook = useCallback(function (file_1, compressionMode_1) {
        var args_1 = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args_1[_i - 2] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([file_1, compressionMode_1], args_1, true), void 0, function (file, compressionMode, quality) {
            if (quality === void 0) { quality = compressionMode === 'lossy' ? 80 : 100; }
            return __generator(this, function (_a) {
                return [2 /*return*/, compressImage(file, compressionMode, quality)];
            });
        });
    }, []);
    return {
        compressImage: compressImageHook,
        formatFileSize: formatFileSize
    };
};

/**
 * React hook for file conversion
 * @returns File conversion utilities and state
 */
var useConvertor$1 = function () {
    var _a = useState([]), files = _a[0], setFiles = _a[1];
    var _b = useState(false), converting = _b[0], setConverting = _b[1];
    var addFiles = useCallback(function (newFiles) {
        var fileInfoArray = Array.from(newFiles).map(createFileInfo);
        setFiles(function (prevFiles) { return __spreadArray(__spreadArray([], prevFiles, true), fileInfoArray, true); });
    }, []);
    var removeFile = useCallback(function (id) {
        setFiles(function (prevFiles) {
            var updatedFiles = prevFiles.filter(function (file) { return file.id !== id; });
            var fileToRemove = prevFiles.find(function (file) { return file.id === id; });
            if (fileToRemove === null || fileToRemove === void 0 ? void 0 : fileToRemove.compressedUrl) {
                URL.revokeObjectURL(fileToRemove.compressedUrl);
            }
            return updatedFiles;
        });
    }, []);
    var clearFiles = useCallback(function () {
        files.forEach(function (file) {
            if (file.compressedUrl) {
                URL.revokeObjectURL(file.compressedUrl);
            }
        });
        setFiles([]);
    }, [files]);
    var convertSingleFile = useCallback(function (fileInfo, options) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, convertFile(fileInfo, options)];
        });
    }); }, []);
    var convertAllFiles = useCallback(function (options) { return __awaiter(void 0, void 0, void 0, function () {
        var startTime, _loop_1, i, processingTime, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (files.length === 0)
                        return [2 /*return*/];
                    setConverting(true);
                    startTime = Date.now();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, 9, 10]);
                    _loop_1 = function (i) {
                        var processedFile;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (files[i].status === 'completed')
                                        return [2 /*return*/, "continue"];
                                    setFiles(function (prevFiles) {
                                        var updatedFiles = __spreadArray([], prevFiles, true);
                                        updatedFiles[i] = __assign(__assign({}, updatedFiles[i]), { status: 'processing' });
                                        return updatedFiles;
                                    });
                                    return [4 /*yield*/, convertSingleFile(files[i], options)];
                                case 1:
                                    processedFile = _b.sent();
                                    setFiles(function (prevFiles) {
                                        var updatedFiles = __spreadArray([], prevFiles, true);
                                        updatedFiles[i] = processedFile;
                                        return updatedFiles;
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < files.length)) return [3 /*break*/, 5];
                    return [5 /*yield**/, _loop_1(i)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    processingTime = Date.now() - startTime;
                    if (!(processingTime < 3000)) return [3 /*break*/, 7];
                    return [4 /*yield*/, delay(3000 - processingTime)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [3 /*break*/, 10];
                case 8:
                    error_1 = _a.sent();
                    console.error('Error converting files:', error_1);
                    return [3 /*break*/, 10];
                case 9:
                    setConverting(false);
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); }, [files, convertSingleFile]);
    var downloadFileHook = useCallback(function (fileInfo) {
        downloadFile(fileInfo);
    }, []);
    var downloadAllFiles = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, downloadFilesAsZip(files)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [files]);
    return {
        files: files,
        converting: converting,
        addFiles: addFiles,
        removeFile: removeFile,
        clearFiles: clearFiles,
        convertAllFiles: convertAllFiles,
        downloadFile: downloadFileHook,
        downloadAllFiles: downloadAllFiles,
    };
};

/**
 * Vue composable for image compression
 * @returns Image compression utilities
 */
var useCompressor = function () {
    /**
     * Compress an image file
     */
    var compressImageFn = function (file_1, compressionMode_1) {
        var args_1 = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args_1[_i - 2] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([file_1, compressionMode_1], args_1, true), void 0, function (file, compressionMode, quality) {
            if (quality === void 0) { quality = compressionMode === 'lossy' ? 80 : 100; }
            return __generator(this, function (_a) {
                return [2 /*return*/, compressImage(file, compressionMode, quality)];
            });
        });
    };
    return {
        compressImage: compressImageFn,
        formatFileSize: formatFileSize
    };
};

/**
 * Vue composable for file conversion
 * @returns File conversion utilities and state
 */
var useConvertor = function () {
    var files = ref([]);
    var converting = ref(false);
    useCompressor().compressImage;
    /**
     * Add files to the conversion queue
     */
    var addFiles = function (newFiles) {
        var fileInfoArray = Array.from(newFiles).map(createFileInfo);
        files.value = __spreadArray(__spreadArray([], files.value, true), fileInfoArray, true);
    };
    /**
     * Remove a file from the conversion queue
     */
    var removeFile = function (id) {
        var fileToRemove = files.value.find(function (file) { return file.id === id; });
        if (fileToRemove === null || fileToRemove === void 0 ? void 0 : fileToRemove.compressedUrl) {
            URL.revokeObjectURL(fileToRemove.compressedUrl);
        }
        files.value = files.value.filter(function (file) { return file.id !== id; });
    };
    /**
     * Clear all files from the conversion queue
     */
    var clearFiles = function () {
        files.value.forEach(function (file) {
            if (file.compressedUrl) {
                URL.revokeObjectURL(file.compressedUrl);
            }
        });
        files.value = [];
    };
    /**
     * Convert a single file
     */
    var convertSingleFile = function (fileInfo, options) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, convertFile(fileInfo, options)];
        });
    }); };
    /**
     * Convert all files in the queue
     */
    var convertAllFiles = function (options) { return __awaiter(void 0, void 0, void 0, function () {
        var startTime, i, updatedFiles, processedFile, newUpdatedFiles, processingTime, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (files.value.length === 0)
                        return [2 /*return*/];
                    converting.value = true;
                    startTime = Date.now();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, 9, 10]);
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < files.value.length)) return [3 /*break*/, 5];
                    if (files.value[i].status === 'completed')
                        return [3 /*break*/, 4];
                    updatedFiles = __spreadArray([], files.value, true);
                    updatedFiles[i] = __assign(__assign({}, updatedFiles[i]), { status: 'processing' });
                    files.value = updatedFiles;
                    return [4 /*yield*/, convertSingleFile(files.value[i], options)];
                case 3:
                    processedFile = _a.sent();
                    newUpdatedFiles = __spreadArray([], files.value, true);
                    newUpdatedFiles[i] = processedFile;
                    files.value = newUpdatedFiles;
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    processingTime = Date.now() - startTime;
                    if (!(processingTime < 3000)) return [3 /*break*/, 7];
                    return [4 /*yield*/, delay(3000 - processingTime)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [3 /*break*/, 10];
                case 8:
                    error_1 = _a.sent();
                    console.error('Error converting files:', error_1);
                    return [3 /*break*/, 10];
                case 9:
                    converting.value = false;
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Download a single converted file
     */
    var downloadSingleFile = function (fileInfo) {
        downloadFile(fileInfo);
    };
    /**
     * Download all converted files as a zip
     */
    var downloadAllFiles = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, downloadFilesAsZip(files.value)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return {
        files: files,
        converting: converting,
        addFiles: addFiles,
        removeFile: removeFile,
        clearFiles: clearFiles,
        convertAllFiles: convertAllFiles,
        downloadFile: downloadSingleFile,
        downloadAllFiles: downloadAllFiles,
    };
};

/**
 * Vanilla JavaScript class for image compression
 */
var Compressor = /** @class */ (function () {
    function Compressor() {
    }
    /**
     * Compress an image file
     * @param file - The file to compress
     * @param compressionMode - The compression mode to use
     * @param quality - The quality to use (for lossy compression)
     * @returns A promise resolving to the compressed image blob and URL
     */
    Compressor.prototype.compressImage = function (file_1, compressionMode_1) {
        return __awaiter(this, arguments, void 0, function (file, compressionMode, quality) {
            if (quality === void 0) { quality = compressionMode === 'lossy' ? 80 : 100; }
            return __generator(this, function (_a) {
                return [2 /*return*/, compressImage(file, compressionMode, quality)];
            });
        });
    };
    /**
     * Format a file size in bytes to a human-readable string
     * @param bytes - The file size in bytes
     * @returns A formatted string (e.g. "1.5 MB")
     */
    Compressor.prototype.formatFileSize = function (bytes) {
        return formatFileSize(bytes);
    };
    return Compressor;
}());

/**
 * Class representing a file conversion manager
 */
var Convertor = /** @class */ (function () {
    /**
     * Create a new Convertor instance
     * @param onStateChange - Optional callback to be notified of state changes
     */
    function Convertor(onStateChange) {
        this.files = [];
        this.converting = false;
        this.compressor = new Compressor();
        this.onStateChange = onStateChange;
    }
    /**
     * Get the current files
     */
    Convertor.prototype.getFiles = function () {
        return __spreadArray([], this.files, true);
    };
    /**
     * Check if files are currently being converted
     */
    Convertor.prototype.isConverting = function () {
        return this.converting;
    };
    /**
     * Trigger the state change callback
     */
    Convertor.prototype.triggerStateChange = function () {
        if (this.onStateChange) {
            this.onStateChange(__spreadArray([], this.files, true), this.converting);
        }
    };
    /**
     * Add files to the conversion queue
     * @param newFiles - The files to add
     */
    Convertor.prototype.addFiles = function (newFiles) {
        var _a;
        var fileInfoArray = Array.from(newFiles).map(createFileInfo);
        (_a = this.files).push.apply(_a, fileInfoArray);
        this.triggerStateChange();
    };
    /**
     * Remove a file from the conversion queue
     * @param id - The ID of the file to remove
     */
    Convertor.prototype.removeFile = function (id) {
        var fileToRemove = this.files.find(function (file) { return file.id === id; });
        if (fileToRemove === null || fileToRemove === void 0 ? void 0 : fileToRemove.compressedUrl) {
            URL.revokeObjectURL(fileToRemove.compressedUrl);
        }
        this.files = this.files.filter(function (file) { return file.id !== id; });
        this.triggerStateChange();
    };
    /**
     * Clear all files from the conversion queue
     */
    Convertor.prototype.clearFiles = function () {
        this.files.forEach(function (file) {
            if (file.compressedUrl) {
                URL.revokeObjectURL(file.compressedUrl);
            }
        });
        this.files = [];
        this.triggerStateChange();
    };
    /**
     * Convert a single file
     * @param fileInfo - The file to convert
     * @param options - The conversion options
     * @returns The converted file
     */
    Convertor.prototype.convertSingleFile = function (fileInfo, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, convertFile(fileInfo, options)];
            });
        });
    };
    /**
     * Convert all files in the queue
     * @param options - The conversion options
     */
    Convertor.prototype.convertAllFiles = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, i, processedFile, processingTime, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.files.length === 0)
                            return [2 /*return*/];
                        this.converting = true;
                        this.triggerStateChange();
                        startTime = Date.now();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, 9, 10]);
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < this.files.length)) return [3 /*break*/, 5];
                        if (this.files[i].status === 'completed')
                            return [3 /*break*/, 4];
                        // Set file status to processing
                        this.files[i] = __assign(__assign({}, this.files[i]), { status: 'processing' });
                        this.triggerStateChange();
                        return [4 /*yield*/, this.convertSingleFile(this.files[i], options)];
                    case 3:
                        processedFile = _a.sent();
                        // Update file with processed result
                        this.files[i] = processedFile;
                        this.triggerStateChange();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5:
                        processingTime = Date.now() - startTime;
                        if (!(processingTime < 3000)) return [3 /*break*/, 7];
                        return [4 /*yield*/, delay(3000 - processingTime)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        error_1 = _a.sent();
                        console.error('Error converting files:', error_1);
                        return [3 /*break*/, 10];
                    case 9:
                        this.converting = false;
                        this.triggerStateChange();
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Download a single converted file
     * @param fileInfo - The file to download
     */
    Convertor.prototype.downloadFile = function (fileInfo) {
        downloadFile(fileInfo);
    };
    /**
     * Download all converted files as a zip
     */
    Convertor.prototype.downloadAllFiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, downloadFilesAsZip(this.files)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Convertor;
}());

// Export types
var pixmash = {
    Compressor: Compressor,
    Convertor: Convertor,
};

export { Compressor, Convertor, compressImage, convertFile, createFileInfo, pixmash as default, delay, downloadFile, downloadFilesAsZip, formatFileSize, useCompressor$1 as useCompressor, useConvertor$1 as useConvertor, useCompressor as vueUseCompressor, useConvertor as vueUseConvertor };
//# sourceMappingURL=index.esm.js.map
