import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  content = content.replace(/hover:bg-white\/(\d+)/g, 'hover:bg-foreground/$1');
  content = content.replace(/bg-white\/(\d+)/g, 'bg-foreground/$1');
  content = content.replace(/border-white\/(\d+)/g, 'border-foreground/$1');
  content = content.replace(/hover:text-white/g, 'hover:text-foreground');
  content = content.replace(/text-white\/(\d+)/g, 'text-foreground/$1');
  content = content.replace(/hover:border-white\/(\d+)/g, 'hover:border-foreground/$1');

  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
