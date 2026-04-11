import { copyFile, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const assetExtensions = new Set(['.PNG', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.webp', '.avif']);

const syncTargets = [
  {
    sourceRoot: path.join(projectRoot, 'content', 'posts'),
    targetRoot: path.join(projectRoot, 'public', 'static', 'posts'),
  },
  {
    sourceRoot: path.join(projectRoot, 'content', 'translations'),
    targetRoot: path.join(projectRoot, 'public', 'static', 'translations'),
  },
];

async function emptyDir(dirPath) {
  await rm(dirPath, { recursive: true, force: true });
  await mkdir(dirPath, { recursive: true });
}

async function copyAssetsRecursively(sourceRoot, targetRoot, relativeDir = '') {
  const currentSourceDir = path.join(sourceRoot, relativeDir);
  const entries = await readdir(currentSourceDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      continue;
    }

    const relativePath = path.join(relativeDir, entry.name);
    const sourcePath = path.join(sourceRoot, relativePath);
    const targetPath = path.join(targetRoot, relativePath);

    if (entry.isDirectory()) {
      await copyAssetsRecursively(sourceRoot, targetRoot, relativePath);
      continue;
    }

    if (!assetExtensions.has(path.extname(entry.name).toLowerCase())) {
      continue;
    }

    await mkdir(path.dirname(targetPath), { recursive: true });
    await copyFile(sourcePath, targetPath);
  }
}

for (const { sourceRoot, targetRoot } of syncTargets) {
  await emptyDir(targetRoot);
  await copyAssetsRecursively(sourceRoot, targetRoot);
}
