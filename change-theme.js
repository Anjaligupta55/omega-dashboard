/* eslint-disable */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const value = args[0]?.toLowerCase();

if (!value) {
  console.log('Please specify a theme (bright, dull) or a color (blue, purple, emerald).');
  console.log('Example: node change-theme.js dull');
  process.exit(1);
}

const configPath = path.join(__dirname, 'src', 'theme-config.json');
let config = { theme: 'bright', color: 'blue' };

try {
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
} catch (err) {
  // ignore
}

if (['bright', 'dull'].includes(value)) {
  config.theme = value;
  console.log(`Setting theme to: ${value}`);
} else if (['blue', 'purple', 'emerald'].includes(value)) {
  config.color = value;
  console.log(`Setting accent color to: ${value}`);
} else {
  console.log(`Unknown parameter: "${value}". Supported: bright, dull, blue, purple, emerald.`);
  process.exit(1);
}

fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
console.log('Theme configuration updated successfully!');
