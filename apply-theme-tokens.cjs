const fs = require('fs');
const path = require('path');

const applyTokens = (content) => {
  return content
    // Backgrounds
    .replace(/bg-\[#09090b\]/g, 'bg-[var(--theme-bg)]')
    .replace(/bg-\[#111113\]/g, 'bg-[var(--theme-card)]')
    .replace(/bg-\[#18181b\]/g, 'bg-[var(--theme-card-secondary)]')
    
    // Borders
    .replace(/border-zinc-800\/50/g, 'border-[var(--theme-border)]')
    .replace(/border-zinc-800/g, 'border-[var(--theme-border)]')
    
    // Texts
    .replace(/text-zinc-100/g, 'text-[var(--theme-text)]')
    .replace(/text-zinc-400/g, 'text-[var(--theme-text-muted)]')
    .replace(/text-zinc-500/g, 'text-[var(--theme-text-muted)]')
    
    // Accents
    .replace(/bg-zinc-100/g, 'bg-[var(--theme-accent)]')
    .replace(/text-black/g, 'text-white')
    .replace(/hover:bg-white/g, 'hover:opacity-80')
    .replace(/text-orange-400/g, 'text-[var(--theme-accent)]')
    .replace(/text-purple-400/g, 'text-[var(--theme-accent)]');
};

const componentsDir = path.join(__dirname, 'src', 'components');
const pagesDir = path.join(__dirname, 'src', 'pages');

const processDir = (dir) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const updated = applyTokens(content);
      if (content !== updated) {
        fs.writeFileSync(fullPath, updated, 'utf8');
        console.log('Updated:', fullPath);
      }
    }
  });
};

processDir(componentsDir);
processDir(pagesDir);
