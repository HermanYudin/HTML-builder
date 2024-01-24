const fs = require('fs').promises;
const path = require('path');

async function buildPage() {
  const distDir = path.join(__dirname, 'project-dist');
  const templateFileDir = path.join(__dirname, 'template.html');
  const componentsDir = path.join(__dirname, 'components');
  const stylesDir = path.join(__dirname, 'styles');
  const assetsDir = path.join(__dirname, 'assets');
  const templateFile = await fs.readFile(templateFileDir, 'utf8');
  const componentsAll = await fs.readdir(componentsDir);
  await fs.mkdir(distDir, { recursive: true });

  let updatedTemplate = templateFile;
  for (const el of componentsAll) {
    if (path.extname(el) === '.html') {
      const componentFile = path.join(componentsDir, el);
      const componentContent = await fs.readFile(componentFile, 'utf8');
      updatedTemplate = updatedTemplate.replace(
        `{{${el.replace('.html', '')}}}`,
        componentContent,
      );
    }
  }

  const styleFile = path.join(__dirname, 'project-dist', 'style.css');
  const files = await fs.readdir(stylesDir);
  const cssFiles = files.filter((el) => path.extname(el) === '.css');
  const css = await Promise.all(
    cssFiles.map((el) => fs.readFile(path.join(stylesDir, el), 'utf8')),
  );
  await fs.writeFile(styleFile, css.join('\n'));
  await fs.writeFile(path.join(distDir, 'index.html'), updatedTemplate);

  async function copyRec(sourceDir, destinationDir) {
    const files = await fs.readdir(sourceDir);
    for (const el of files) {
      const sourcePath = path.join(sourceDir, el);
      const destinationPath = path.join(destinationDir, el);
      const stats = await fs.stat(sourcePath);
      if (stats.isDirectory()) {
        await fs.mkdir(destinationPath, { recursive: true });
        await copyRec(sourcePath, destinationPath);
      } else {
        await fs.copyFile(sourcePath, destinationPath);
      }
    }
  }
  const distDirAssets = path.join(__dirname, 'project-dist', 'assets');
  await copyRec(assetsDir, distDirAssets);
}

buildPage();