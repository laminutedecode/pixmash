#!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Fonction améliorée pour détecter les environnements non-interactifs
const isAutomatedEnvironment = () => {
  // Vérifier explicitement les variables d'environnement CI/CD courantes
  const ciEnvironments = [
    'CI',
    'CONTINUOUS_INTEGRATION',
    'TRAVIS',
    'CIRCLECI',
    'GITHUB_ACTIONS',
    'GITLAB_CI',
    'JENKINS_URL',
    'BITBUCKET_BUILD_NUMBER',
    'APPVEYOR',
    'TF_BUILD'
  ];
  
  const isCI = ciEnvironments.some(env => process.env[env]);
  
  return (
    isCI || 
    process.env.AUTOMATED_INSTALL || 
    process.env.npm_config_global ||
    process.env.PIXMASH_SKIP_POSTINSTALL ||
    // Garder cette vérification mais en dernier lieu
    (process.env.npm_config_node_env === 'production' && !process.stdin.isTTY)
  );
};

// Ignorer l'installation interactive dans les environnements automatisés
if (isAutomatedEnvironment()) {
  console.log('Environnement automatisé détecté. Installation complète de Pixmash sans interaction...');
  process.exit(0);
}

// Ignorer l'installation interactive pour les installations de développement
if (process.env.npm_config_dev) {
  console.log('Installation de développement détectée. Script postinstall ignoré.');
  process.exit(0);
}

console.log('\n🎨 Bienvenue dans l\'installation de Pixmash! 🖼️\n');
console.log('Cette bibliothèque vous permet de compresser et convertir facilement des images dans différents frameworks JavaScript.\n');

async function main() {
  try {
    // Forcer le mode interactif pour inquirer
    process.env.FORCE_TTY = 'true';
    
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        message: 'Quel framework utilisez-vous dans votre projet?',
        choices: [
          { name: 'React', value: 'react' },
          { name: 'Vue.js', value: 'vue' },
          { name: 'JavaScript Vanilla', value: 'vanilla' },
          { name: 'Installation complète (tous les frameworks)', value: 'all' }
        ],
        default: 'all'
      },
      {
        type: 'confirm',
        name: 'typescript',
        message: 'Utilisez-vous TypeScript?',
        default: false
      }
    ]);

    console.log('\n📦 Configuration de Pixmash pour ' + getFrameworkName(answers.framework) + '...\n');

    const modulePath = path.resolve(__dirname, '..');
    const distPath = path.join(modulePath, 'dist');

    checkDependencies(answers.framework);
    createConfigFile(answers);
    optimizeInstallation(answers.framework);

    console.log('\n✅ Installation de Pixmash terminée!\n');
    console.log(`Pour commencer à utiliser Pixmash avec ${getFrameworkName(answers.framework)}, consultez notre documentation:`);
    console.log('https://github.com/laminutedecode/pixmash#readme\n');
  } catch (error) {
    console.error('❌ Une erreur s\'est produite pendant l\'installation interactive:', error);
    console.log('L\'installation complète a été effectuée par défaut.');
  }
}

function getFrameworkName(framework) {
  switch (framework) {
    case 'react': return 'React';
    case 'vue': return 'Vue.js';
    case 'vanilla': return 'JavaScript Vanilla';
    default: return 'tous les frameworks';
  }
}

function checkDependencies(framework) {
  const projectPackageJsonPath = findProjectPackageJson();
  
  if (!projectPackageJsonPath) {
    console.log('⚠️ Impossible de trouver le fichier package.json du projet parent.');
    return;
  }

  try {
    const packageJson = require(projectPackageJsonPath);
    const allDeps = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {})
    };

    if (framework === 'react' && !allDeps.react) {
      console.log('⚠️ React ne semble pas être installé dans votre projet.');
      console.log('Pour utiliser Pixmash avec React, installez React:');
      console.log('npm install react\n');
    }

    if (framework === 'vue' && !allDeps.vue) {
      console.log('⚠️ Vue ne semble pas être installé dans votre projet.');
      console.log('Pour utiliser Pixmash avec Vue, installez Vue:');
      console.log('npm install vue\n');
    }
  } catch (error) {
    console.log('⚠️ Erreur lors de la vérification des dépendances:', error.message);
  }
}

function findProjectPackageJson() {
  let currentDir = process.cwd();
  
  while (currentDir !== path.parse(currentDir).root) {
    const packageJsonPath = path.join(currentDir, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = require(packageJsonPath);
        if (packageJson.name !== 'pixmash') {
          return packageJsonPath;
        }
      } catch (error) {
      }
    }
    
    currentDir = path.dirname(currentDir);
  }
  
  return null;
}

function createConfigFile(answers) {
  const configDir = path.join(process.cwd(), 'node_modules', 'pixmash');
  const configPath = path.join(configDir, 'pixmash.config.js');

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const configContent = `module.exports = {
  framework: '${answers.framework}',
  typescript: ${answers.typescript},
  configured: true
};
`;

  fs.writeFileSync(configPath, configContent);
  
  const importHelperContent = getImportHelper(answers.framework, answers.typescript);
  const importHelperPath = path.join(configDir, 'import-helper.js');
  
  fs.writeFileSync(importHelperPath, importHelperContent);

  console.log(`📝 Configuration enregistrée dans ${configPath}`);
  console.log(`💡 Un assistant d'importation a été créé à ${importHelperPath}`);
}

function optimizeInstallation(framework) {
  if (framework === 'all') {
    console.log('Installation complète demandée. Tous les fichiers sont conservés.');
    return;
  }
  
  try {
    console.log('🔧 Optimisation de l\'installation...');
    require('./optimize-install');
    console.log('🔧 Installation optimisée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'optimisation de l\'installation:', error);
    console.log('L\'installation complète a été conservée.');
  }
}

function getImportHelper(framework, typescript) {
  let content = '';
  
  if (typescript) {
    content += `export * from './dist/types';\n\n`;
  }
  
  switch (framework) {
    case 'react':
      content += `import { useCompressor, useConvertor } from 'pixmash';\n\n`;
      break;
      
    case 'vue':
      content += `import { vueUseCompressor, vueUseConvertor } from 'pixmash';\n\n`;
      break;
      
    case 'vanilla':
      content += `import { Compressor, Convertor } from 'pixmash';\n\n`;
      break;
      
    default:
      content += `import pixmash from 'pixmash';\n\n`;
      break;
  }
  
  return content;
}

main().catch(err => {
  console.error('Erreur pendant l\'installation interactive:', err);
  process.exit(1);
}); 