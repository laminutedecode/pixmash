#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Optimize installation based on configuration
function optimizeInstallation() {
  try {
    const configPath = path.join(process.cwd(), 'node_modules', 'pixmash', 'pixmash.config.js');
    
    if (!fs.existsSync(configPath)) {
      console.log('Configuration Pixmash non trouvée. Impossible d\'optimiser l\'installation.');
      return;
    }
    
    const config = require(configPath);
    
    if (!config.framework || config.framework === 'all') {
      console.log('Installation complète demandée. Aucune optimisation nécessaire.');
      return;
    }
    
    const distDir = path.join(process.cwd(), 'node_modules', 'pixmash', 'dist');
    if (!fs.existsSync(distDir)) {
      console.log('Répertoire dist non trouvé. Impossible d\'optimiser l\'installation.');
      return;
    }
    
    // Nettoyer les fichiers selon le framework choisi
    cleanupFiles(distDir, config.framework);
    
    console.log(`Installation optimisée pour ${config.framework} complétée.`);
  } catch (error) {
    console.error('Erreur pendant l\'optimisation:', error);
  }
}

function cleanupFiles(distDir, framework) {
  if (framework === 'react') {
    // Supprimer les fichiers Vue et Vanilla
    deleteFilesMatching(distDir, ['composables', 'vanilla']);
    console.log('Fichiers Vue et Vanilla supprimés pour l\'installation React.');
  } else if (framework === 'vue') {
    // Supprimer les fichiers React et Vanilla
    deleteFilesMatching(distDir, ['hooks', 'vanilla']);
    console.log('Fichiers React et Vanilla supprimés pour l\'installation Vue.');
  } else if (framework === 'vanilla') {
    // Supprimer les fichiers React et Vue
    deleteFilesMatching(distDir, ['hooks', 'composables']);
    console.log('Fichiers React et Vue supprimés pour l\'installation Vanilla.');
  }
}

function deleteFilesMatching(dir, patterns) {
  // Lire tous les fichiers et répertoires
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Si c'est un répertoire à supprimer
      if (patterns.some(pattern => item === pattern || item.startsWith(pattern + '/'))) {
        deleteDirectory(itemPath);
      } else {
        // Sinon, examiner récursivement le répertoire
        deleteFilesMatching(itemPath, patterns);
      }
    } else if (stat.isFile()) {
      // Vérifier si le fichier correspond à un modèle à supprimer
      const shouldDelete = patterns.some(pattern => {
        return (
          item === pattern + '.js' ||
          item === pattern + '.mjs' ||
          item === pattern + '.cjs' ||
          item === pattern + '.d.ts' ||
          item.startsWith(pattern + '.')
        );
      });
      
      if (shouldDelete) {
        fs.unlinkSync(itemPath);
      }
    }
  }
}

function deleteDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      const curPath = path.join(dir, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // Récursion
        deleteDirectory(curPath);
      } else {
        // Supprimer le fichier
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dir);
  }
}

// Run the optimization
optimizeInstallation(); 