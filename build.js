const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const distDir = path.join(__dirname, 'dist');

// Ensure dist directory exists and is clean
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      if (childItemName === 'node_modules' || childItemName === '.git' || childItemName === 'dist') return;
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy essential files to dist
const filesToCopy = ['index.html', 'styles.css', 'script.js', '_redirects', 'netlify.toml', 'README.md'];
filesToCopy.forEach(file => {
  const srcPath = path.join(srcDir, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(distDir, file));
    console.log(`Copied ${file} to dist/`);
  }
});

// Copy assets folder
const assetsDir = path.join(srcDir, 'assets');
if (fs.existsSync(assetsDir)) {
  copyRecursiveSync(assetsDir, path.join(distDir, 'assets'));
  console.log('Copied assets/ to dist/assets/');
}

console.log('Production build completed successfully in dist/');
