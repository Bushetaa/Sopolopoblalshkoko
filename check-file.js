
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/docs/page.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

console.log('=== Checking lines 670-720 ===');
for (let i = 670; i < 720; i++) {
  const idx = i - 1;
  if (idx >= 0 && idx < lines.length) {
    const line = lines[idx];
    console.log(`${i} |`, JSON.stringify(line));
  }
}

// Check for any problematic characters
console.log('\n=== Checking for problematic characters ===');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    const code = line.charCodeAt(j);
    if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
      console.log(`Line ${i+1}, Col ${j+1}: Control char 0x${code.toString(16)}`);
    }
  }
  if (line.includes(',->') || line.includes('`->')) {
    console.log(`Line ${i+1}: Found diff marker!`);
    console.log('  ->', JSON.stringify(line));
  }
}
