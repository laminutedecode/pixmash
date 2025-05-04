#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function optimizeInstallation() {
  try {
    const modulePath = path.resolve(__dirname, '..');
    const configPath = path.join(process.cwd(), 'node_modules', 'pixmash', 'pixmash.config.js');
    
    if (!fs.existsSync(configPath)) {
      console.log('No configuration file found. Complete installation preserved.');
      return;
    }
    
    const config = require(configPath);
    const framework = config.framework;
    
    if (framework === 'all') {
      console.log('Complete installation requested. All files are preserved.');
      return;
    }
    
    const distPath = path.join(modulePath, 'dist');
    
    const keepDirectories = ['utils', 'types', 'vanilla'];
    
    if (framework === 'react') {
      keepDirectories.push('hooks');
    } else if (framework === 'vue') {
      keepDirectories.push('composables');
    }
    
    fs.readdirSync(distPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .forEach(dirent => {
        const dirName = dirent.name;
        const dirPath = path.join(distPath, dirName);
        
        if (!keepDirectories.includes(dirName)) {
          console.log(`Removing unnecessary directory: ${dirName}`);
          fs.rmdirSync(dirPath, { recursive: true });
        }
      });
    
    console.log(`Installation optimized for ${getFrameworkName(framework)}.`);
  } catch (error) {
    console.error('Error optimizing installation:', error);
    console.log('Complete installation has been preserved for safety.');
  }
}

function getFrameworkName(framework) {
  switch (framework) {
    case 'react': return 'React';
    case 'vue': return 'Vue.js';
    case 'vanilla': return 'Vanilla JavaScript';
    default: return 'all frameworks';
  }
}

optimizeInstallation(); 