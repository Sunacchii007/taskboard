// A small linter with zero dependencies. It fails (exit code 1) when:
//   - a .js file has a syntax error
//   - a file contains a `debugger` statement
//   - a .js or .yml/.yaml file contains a TAB character
// Exit code 1 is what makes the CI step go red.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const skip = new Set(['node_modules', 'dist', '.git']);
const problems = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else check(full);
  }
}

function check(file) {
  const ext = path.extname(file);
  if (!['.js', '.yml', '.yaml'].includes(ext)) return;
  const rel = path.relative(root, file);
  const lines = fs.readFileSync(file, 'utf8').split('\n');

  lines.forEach((line, i) => {
    if (line.includes('\t')) problems.push(`${rel}:${i + 1}  TAB character (use spaces)`);
    if (ext === '.js' && file !== __filename && /^\s*debugger\s*;?\s*$/.test(line)) problems.push(`${rel}:${i + 1}  debugger statement`);
  });

  if (ext === '.js') {
    try {
      execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
    } catch (err) {
      problems.push(`${rel}  syntax error:\n${err.stderr.toString().trim()}`);
    }
  }
}

walk(root);

if (problems.length) {
  console.error(`lint failed: ${problems.length} problem(s)\n` + problems.join('\n'));
  process.exit(1);
}
console.log('lint ok');
