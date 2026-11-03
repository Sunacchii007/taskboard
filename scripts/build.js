// Copies the frontend into dist/ and stamps a build-info file.
// In CI, this proves the app can be packaged before anything is deployed.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(path.join(root, 'public'), path.join(dist, 'public'), { recursive: true });
fs.writeFileSync(
  path.join(dist, 'build-info.json'),
  JSON.stringify({ builtAt: new Date().toISOString(), commit: process.env.GITHUB_SHA || 'local' }, null, 2),
);

console.log('build ok → dist/');
