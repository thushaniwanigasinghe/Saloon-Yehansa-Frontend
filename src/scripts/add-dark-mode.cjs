const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const colorMap = {
  'bg-neutral-950': 'bg-white dark:bg-neutral-950',
  'bg-neutral-900': 'bg-gray-50 dark:bg-neutral-900',
  'bg-black': 'bg-white dark:bg-black',
  'text-white': 'text-neutral-900 dark:text-white',
  'text-gray-300': 'text-gray-600 dark:text-gray-300',
  'text-gray-400': 'text-gray-500 dark:text-gray-400',
  'border-white/10': 'border-neutral-900/10 dark:border-white/10',
  'border-white/20': 'border-neutral-900/20 dark:border-white/20',
  'border-white/30': 'border-neutral-900/30 dark:border-white/30',
  'border-white/5': 'border-neutral-900/5 dark:border-white/5',
  'bg-white/5': 'bg-neutral-900/5 dark:bg-white/5',
  'bg-white/10': 'bg-neutral-900/10 dark:bg-white/10',
  'bg-black/60': 'bg-white/60 dark:bg-black/60',
  'bg-black/40': 'bg-white/40 dark:bg-black/40',
  'bg-black/90': 'bg-white/90 dark:bg-black/90'
};

function replaceClassesProperly(content) {
  let newContent = content;
  
  for (const [oldClass, newClasses] of Object.entries(colorMap)) {
    const escapedClass = oldClass.replace(/\//g, '\\/');
    
    const regex = new RegExp(`\\b([a-z0-9-:]*?)${escapedClass}(?![\\w/-])`, 'g');
    
    newContent = newContent.replace(regex, (match, prefix) => {
      // If it's already a dark: variant, skip it
      if (prefix.includes('dark:')) {
        return match;
      }
      const parts = newClasses.split(' '); // e.g. ['bg-white', 'dark:bg-neutral-950']
      const p = prefix || '';
      return `${p}${parts[0]} dark:${p}${parts[1].replace('dark:', '')}`;
    });
  }
  
  return newContent;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
      let content = fs.readFileSync(filePath, 'utf-8');
      let newContent = replaceClassesProperly(content);
      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log(`Updated ${filePath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Done.');
