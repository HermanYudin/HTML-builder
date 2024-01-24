const fs = require('fs').promises;
const path = require('path');

async function buildPage() {
  const distDir = path.join(__dirname, 'project-dist');
  const templateFile = path.join(__dirname, 'template.html');
  const componentsDir = path.join(__dirname, 'components');
  const stylesDir = path.join(__dirname, 'styles');
  const assetsDir = path.join(__dirname, 'assets');

  await fs.mkdir(distDir, { recursive: true });
  const template = await fs.readFile(templateFile, 'utf8');
  const components = await fs.readdir(componentsDir);

  let updatedTemplate = template;
  for (const component of components) {
    if (path.extname(component) === '.html') {
      const componentFile = path.join(componentsDir, component);
      const componentContent = await fs.readFile(componentFile, 'utf8');
      updatedTemplate = updatedTemplate.replace(
        `{{${component.replace('.html', '')}}}`,
        componentContent,
      );
    }
  }

  const styleFile = path.join(__dirname, 'project-dist', 'style.css');
  const files = await fs.readdir(stylesDir);
  const cssFiles = files.filter((file) => path.extname(file) === '.css');
  const css = await Promise.all(
    cssFiles.map((file) => fs.readFile(path.join(stylesDir, file), 'utf8')),
  );
  await fs.writeFile(styleFile, css.join('\n'));
  await fs.writeFile(path.join(distDir, 'index.html'), updatedTemplate);

  async function copyRecursive(sourceDir, destinationDir) {
    const files = await fs.readdir(sourceDir);
    for (const file of files) {
      const sourcePath = path.join(sourceDir, file);
      const destinationPath = path.join(destinationDir, file);
      const stats = await fs.stat(sourcePath);
      if (stats.isDirectory()) {
        await fs.mkdir(destinationPath, { recursive: true });
        await copyRecursive(sourcePath, destinationPath);
      } else {
        await fs.copyFile(sourcePath, destinationPath);
      }
    }
  }
  const distDirAssets = path.join(__dirname, 'project-dist', 'assets');
  await copyRecursive(assetsDir, distDirAssets);
}

buildPage();