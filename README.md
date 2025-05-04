# Pixmash

A universal image compression and conversion library for JavaScript applications.

## Features

- Compress images with lossy or lossless compression
- Convert images between formats (jpg, png, webp)
- Works in React, Vue, and vanilla JavaScript
- TypeScript support
- Browser-based (client-side) processing

## Installation

```bash
npm install pixmash
# or
yarn add pixmash
```

## Usage

### React

```jsx
import React, { useState } from 'react';
import { useConvertor } from 'pixmash';

function ImageConverter() {
  const { 
    files, 
    converting, 
    addFiles, 
    convertAllFiles, 
    downloadAllFiles 
  } = useConvertor();
  
  const [options, setOptions] = useState({
    outputFormat: 'jpg',
    compressionMode: 'lossy',
    quality: 80
  });

  const handleFileChange = (e) => {
    if (e.target.files?.length) {
      addFiles(e.target.files);
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      
      <select 
        value={options.outputFormat}
        onChange={(e) => setOptions({...options, outputFormat: e.target.value})}
      >
        <option value="jpg">JPG</option>
        <option value="png">PNG</option>
        <option value="webp">WebP</option>
      </select>
      
      <button onClick={() => convertAllFiles(options)} disabled={converting}>
        {converting ? 'Converting...' : 'Convert All'}
      </button>
      
      <button onClick={downloadAllFiles}>
        Download All
      </button>
      
      <div>
        {files.map(file => (
          <div key={file.id}>
            {file.file.name} - {file.status}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Vue 3

```vue
<template>
  <div>
    <input type="file" multiple @change="handleFileChange" />
    
    <select v-model="options.outputFormat">
      <option value="jpg">JPG</option>
      <option value="png">PNG</option>
      <option value="webp">WebP</option>
    </select>
    
    <button @click="convertAllFiles(options)" :disabled="converting">
      {{ converting ? 'Converting...' : 'Convert All' }}
    </button>
    
    <button @click="downloadAllFiles">
      Download All
    </button>
    
    <div>
      <div v-for="file in files" :key="file.id">
        {{ file.file.name }} - {{ file.status }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { vueUseConvertor } from 'pixmash';

const { 
  files, 
  converting, 
  addFiles, 
  convertAllFiles, 
  downloadAllFiles 
} = vueUseConvertor();

const options = reactive({
  outputFormat: 'jpg',
  compressionMode: 'lossy',
  quality: 80
});

const handleFileChange = (e) => {
  if (e.target.files?.length) {
    addFiles(e.target.files);
  }
};
</script>
```

### Vanilla JavaScript

```javascript
import { Convertor } from 'pixmash';

// Create a new convertor instance
const convertor = new Convertor((files, converting) => {
  // Update your UI here when state changes
  updateUI(files, converting);
});

// Add file input to your UI
const fileInput = document.querySelector('#file-input');
fileInput.addEventListener('change', (e) => {
  if (e.target.files?.length) {
    convertor.addFiles(e.target.files);
  }
});

// Add convert button to your UI
const convertButton = document.querySelector('#convert-button');
convertButton.addEventListener('click', () => {
  const options = {
    outputFormat: 'jpg',
    compressionMode: 'lossy',
    quality: 80
  };
  
  convertor.convertAllFiles(options);
});

// Add download button to your UI
const downloadButton = document.querySelector('#download-button');
downloadButton.addEventListener('click', () => {
  convertor.downloadAllFiles();
});

// Function to update UI
function updateUI(files, converting) {
  // Update your UI based on files and converting state
  const filesList = document.querySelector('#files-list');
  filesList.innerHTML = '';
  
  files.forEach(file => {
    const fileEl = document.createElement('div');
    fileEl.textContent = `${file.file.name} - ${file.status}`;
    filesList.appendChild(fileEl);
  });
  
  convertButton.disabled = converting;
  convertButton.textContent = converting ? 'Converting...' : 'Convert All';
}
```

## API Reference

### Types

```typescript
// Compression mode
type CompressionMode = 'lossy' | 'lossless';

// Output format
type OutputFormat = 'jpg' | 'png' | 'webp' | 'svg';

// File information
interface FileInfo {
  id: string;
  file: File;
  originalSize: number;
  convertedSize?: number;
  outputFormat?: OutputFormat;
  compressedUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

// Conversion options
interface ConversionOptions {
  outputFormat: OutputFormat;
  compressionMode: CompressionMode;
  quality?: number; 
}
```

### React Hooks

#### useCompressor

```typescript
const { compressImage, formatFileSize } = useCompressor();
```

#### useConvertor

```typescript
const { 
  files,                 // Array of FileInfo objects
  converting,            // Boolean indicating if conversion is in progress
  addFiles,              // Function to add files to the queue
  removeFile,            // Function to remove a file from the queue
  clearFiles,            // Function to clear all files
  convertAllFiles,       // Function to convert all files
  downloadFile,          // Function to download a single file
  downloadAllFiles       // Function to download all files as a zip
} = useConvertor();
```

### Vue Composables

#### vueUseCompressor

```typescript
const { compressImage, formatFileSize } = vueUseCompressor();
```

#### vueUseConvertor

```typescript
const { 
  files,                 // Ref to array of FileInfo objects
  converting,            // Ref to boolean indicating if conversion is in progress
  addFiles,              // Function to add files to the queue
  removeFile,            // Function to remove a file from the queue
  clearFiles,            // Function to clear all files
  convertAllFiles,       // Function to convert all files
  downloadFile,          // Function to download a single file
  downloadAllFiles       // Function to download all files as a zip
} = vueUseConvertor();
```

### Vanilla JavaScript Classes

#### Compressor

```typescript
const compressor = new Compressor();

// Compress an image
const { compressedBlob, compressedUrl } = await compressor.compressImage(
  file,                  // File object
  'lossy',               // CompressionMode
  80                     // Quality (0-100)
);

// Format a file size
const formattedSize = compressor.formatFileSize(1024); // "1.00 KB"
```

#### Convertor

```typescript
// Create a convertor with an optional state change callback
const convertor = new Convertor((files, converting) => {
  // This will be called when files or converting state changes
});

// Get current files
const files = convertor.getFiles();

// Check if converting
const isConverting = convertor.isConverting();

// Add files
convertor.addFiles(fileList);

// Remove a file
convertor.removeFile('file-id');

// Clear all files
convertor.clearFiles();

// Convert all files
await convertor.convertAllFiles({
  outputFormat: 'jpg',
  compressionMode: 'lossy',
  quality: 80
});

// Download a file
convertor.downloadFile(fileInfo);

// Download all files
await convertor.downloadAllFiles();
```

## License

ISC 