import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await readFile(join(root, 'COMMERCIAL_BUILD.json'), 'utf8'));
const worker = await readFile(join(root, manifest.entry));
const actual = createHash('sha256').update(worker).digest('hex');
if (actual !== manifest.sha256) throw new Error('商业发行模块 SHA-256 校验失败');
const text = worker.toString('utf8');
if (/sourceMappingURL|license\.imsuk\.cn/u.test(text)) throw new Error('发行模块包含禁止公开的映射或授权端点明文');
async function scan(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) await scan(file);
    else if (entry.name.endsWith('.map')) throw new Error(`发行包包含 Source Map: ${relative(root, file)}`);
  }
}
await scan(root);
console.log(`verified ${manifest.entry} sha256=${actual}`);
