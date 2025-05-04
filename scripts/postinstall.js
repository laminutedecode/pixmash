#!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check for CI/CD or automated environments
const isAutomatedEnvironment = () => {
  return process.env.CI || 
    process.env.AUTOMATED_INSTALL || 
    process.env.npm_config_global || 
    !process.stdin.isTTY || // This is key - detects non-interactive environments
    process.env.PIXMASH_SKIP_POSTINSTALL;
};

// Skip interactive install in automated environments
if (isAutomatedEnvironment()) {
  console.log('Automated installation detected. Installing complete Pixmash package without interaction...');
  process.exit(0);
}

if (process.env.npm_config_dev) {
  console.log('Development installation detected. Skipping postinstall script.');
  process.exit(0);
}

console.log('\n🎨 Welcome to Pixmash Installation! 🖼️\n');
console.log('This library allows you to easily compress and convert images in different JavaScript frameworks.\n');

async function main() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        message: 'Which framework are you using in your project?',
        choices: [
          { name: 'React', value: 'react' },
          { name: 'Vue.js', value: 'vue' },
          { name: 'Vanilla JavaScript', value: 'vanilla' },
          { name: 'Complete installation (all frameworks)', value: 'all' }
        ],
        default: 'all'
      },
      {
        type: 'confirm',
        name: 'typescript',
        message: 'Are you using TypeScript?',
        default: false
      }
    ]);

    console.log('\n📦 Configuring Pixmash for ' + getFrameworkName(answers.framework) + '...\n');

    const modulePath = path.resolve(__dirname, '..');
    const distPath = path.join(modulePath, 'dist');

    checkDependencies(answers.framework);
    createConfigFile(answers);
    optimizeInstallation(answers.framework);

    console.log('\n✅ Pixmash installation completed!\n');
    console.log(`To start using Pixmash with ${getFrameworkName(answers.framework)}, check our documentation:`);
    console.log('https://github.com/laminutedecode/pixmash#readme\n');
  } catch (error) {
    console.error('❌ An error occurred during interactive installation:', error);
    console.log('Complete installation was performed by default.');
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

function checkDependencies(framework) {
  const projectPackageJsonPath = findProjectPackageJson();
  
  if (!projectPackageJsonPath) {
    console.log('⚠️ Unable to find the parent project\'s package.json file.');
    return;
  }

  try {
    const packageJson = require(projectPackageJsonPath);
    const allDeps = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {})
    };

    if (framework === 'react' && !allDeps.react) {
      console.log('⚠️ React does not seem to be installed in your project.');
      console.log('To use Pixmash with React, install React:');
      console.log('npm install react\n');
    }

    if (framework === 'vue' && !allDeps.vue) {
      console.log('⚠️ Vue does not seem to be installed in your project.');
      console.log('To use Pixmash with Vue, install Vue:');
      console.log('npm install vue\n');
    }
  } catch (error) {
    console.log('⚠️ Error checking dependencies:', error.message);
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

  console.log(`📝 Configuration saved to ${configPath}`);
  console.log(`💡 An import helper has been created at ${importHelperPath}`);
}

function optimizeInstallation(framework) {
  if (framework === 'all') {
    console.log('Complete installation requested. All files are preserved.');
    return;
  }
  
  try {
    console.log('🔧 Optimizing installation...');
    require('./optimize-install');
    console.log('🔧 Installation successfully optimized!');
  } catch (error) {
    console.error('❌ Error optimizing installation:', error);
    console.log('Complete installation has been preserved.');
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
  console.error('Error during interactive installation:', err);
  process.exit(1);
}); 