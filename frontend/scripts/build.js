#!/usr/bin/env node
import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const projectRoot = join(__dirname, '..');
const distDir = join(projectRoot, 'dist');

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });
cpSync(join(projectRoot, 'index.html'), join(distDir, 'index.html'));
cpSync(join(projectRoot, 'src'), join(distDir, 'src'), { recursive: true });
cpSync(join(projectRoot, 'config.js'), join(distDir, 'config.js'));

console.log('Build complete. Files written to', distDir);
