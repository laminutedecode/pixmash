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

### Installation interactive

Pendant l'installation, Pixmash vous demandera **quel framework vous utilisez** et si vous utilisez **TypeScript**. Cela permet d'optimiser l'installation en ne conservant que les fichiers nécessaires à votre environnement de développement.

Options disponibles :
- **React**: N'installe que les hooks React et les utilitaires de base
- **Vue.js**: N'installe que les composables Vue et les utilitaires de base
- **JavaScript Vanilla**: N'installe que les classes JS et les utilitaires de base
- **Installation complète**: Installe tous les composants pour tous les frameworks

Pour ignorer l'installation interactive (par exemple dans un environnement CI/CD), vous pouvez définir une variable d'environnement :

```bash
# Pour les environnements CI/CD
PIXMASH_SKIP_POSTINSTALL=1 npm install pixmash

# Pour les installations de développement
npm install pixmash --dev
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
    quality: 80,
    watermark: {
      type: 'text',
      content: '© My Brand',
      position: 'bottom-right',
      opacity: 0.7,
      color: '#ffffff',
      size: 4, // % of image height
      font: 'Arial'
    }
  });

  const handleFileChange = (e) => {
    if (e.target.files?.length) {
      addFiles(e.target.files);
    }
  };

  const toggleWatermark = () => {
    setOptions(prev => ({
      ...prev,
      watermark: prev.watermark ? undefined : {
        type: 'text',
        content: '© My Brand',
        position: 'bottom-right',
        opacity: 0.7,
        color: '#ffffff',
        size: 4,
        font: 'Arial'
      }
    }));
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
      
      <div>
        <label>
          <input 
            type="checkbox" 
            checked={!!options.watermark} 
            onChange={toggleWatermark} 
          />
          Add Watermark
        </label>
      </div>
      
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
    
    <div>
      <label>
        <input 
          type="checkbox" 
          v-model="useWatermark" 
          @change="toggleWatermark"
        />
        Add Watermark
      </label>
    </div>
    
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
import { reactive, ref } from 'vue';
import { vueUseConvertor } from 'pixmash';

const { 
  files, 
  converting, 
  addFiles, 
  convertAllFiles, 
  downloadAllFiles 
} = vueUseConvertor();

const useWatermark = ref(true);
const options = reactive({
  outputFormat: 'jpg',
  compressionMode: 'lossy',
  quality: 80,
  watermark: {
    type: 'text',
    content: '© My Brand',
    position: 'bottom-right',
    opacity: 0.7,
    color: '#ffffff',
    size: 4, // % of image height
    font: 'Arial'
  }
});

const handleFileChange = (e) => {
  if (e.target.files?.length) {
    addFiles(e.target.files);
  }
};

const toggleWatermark = () => {
  if (useWatermark.value) {
    options.watermark = {
      type: 'text',
      content: '© My Brand',
      position: 'bottom-right',
      opacity: 0.7,
      color: '#ffffff',
      size: 4,
      font: 'Arial'
    };
  } else {
    options.watermark = undefined;
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

// Add watermark checkbox to your UI
const watermarkCheckbox = document.querySelector('#watermark-checkbox');
let useWatermark = true;

watermarkCheckbox.addEventListener('change', (e) => {
  useWatermark = e.target.checked;
});

// Add convert button to your UI
const convertButton = document.querySelector('#convert-button');
convertButton.addEventListener('click', () => {
  const options = {
    outputFormat: 'jpg',
    compressionMode: 'lossy',
    quality: 80
  };
  
  // Add watermark if checkbox is checked
  if (useWatermark) {
    options.watermark = {
      type: 'text',
      content: '© My Brand',
      position: 'bottom-right',
      opacity: 0.7,
      color: '#ffffff',
      size: 4,
      font: 'Arial'
    };
  }
  
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
    const listItem = document.createElement('div');
    listItem.textContent = `${file.file.name} - ${file.status}`;
    filesList.appendChild(listItem);
  });
  
  convertButton.disabled = converting;
  convertButton.textContent = converting ? 'Converting...' : 'Convert All';
}
```

## Advanced Features

### Batch Processing Options

Pixmash supports various batch processing options that can be configured when converting multiple images:

```javascript
// With React
const { convertAllFiles } = useConvertor();

// Batch processing with advanced options
convertAllFiles({
  outputFormat: 'webp',
  compressionMode: 'lossy',
  quality: 85,
  // Advanced batch options (coming soon)
  // batchSize: 3,           // Process images in smaller batches to avoid memory issues
  // parallelProcessing: 2,  // Process multiple images at once for faster conversion
  // maxDimension: 1920,     // Maximum width/height for any image
  // preserveExif: false     // Whether to preserve EXIF metadata
});
```

### Watermarking

Pixmash now supports adding text or image watermarks to your converted images:

```javascript
// With React
const { convertAllFiles } = useConvertor();

// Add a text watermark
convertAllFiles({
  outputFormat: 'jpg',
  compressionMode: 'lossy',
  quality: 80,
  watermark: {
    type: 'text',
    content: '© 2023 My Company',
    position: 'bottom-right',
    opacity: 0.6,
    color: '#ffffff',
    size: 5,  // 5% of image height
    font: 'Arial'
  }
});

// Add an image watermark
convertAllFiles({
  outputFormat: 'webp',
  compressionMode: 'lossy',
  quality: 85,
  watermark: {
    type: 'image',
    content: 'https://example.com/logo.png', // URL or data URL of your watermark
    position: 'center',
    opacity: 0.3,
    size: 100 // size in pixels
  }
});
```

Watermark positions can be: `'top-left'`, `'top-right'`, `'bottom-left'`, `'bottom-right'`, or `'center'`.

### Roadmap

We're planning to add the following features in upcoming releases:

1. **SVG Support**: Convert raster images to SVG for scalable graphics
2. **Custom Naming Templates**: Define custom naming patterns for converted files
3. **EXIF Data Preservation**: Option to preserve or strip EXIF metadata
4. **Image Effects**: Simple filters and effects that can be applied during conversion
5. ✅ **Watermarking**: Add text or image watermarks to your converted images
6. **Progressive Loading**: Create progressive JPEGs for better web performance
7. **Parallel Processing**: Convert multiple images simultaneously for better performance
8. **Command Line Interface**: Use Pixmash directly from the command line

If you'd like to contribute to these features, please check out our contribution guidelines.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

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