// SPDX-License-Identifier: MIT
import fs from 'node:fs';
import crypto from 'node:crypto';
const sectors = [];
for (let track = 3; track <= 12; track++) {
  const file = `research/track_${track.toString(16).padStart(2,'0')}.asm`;
  let sector = -1;
  for (const line of fs.readFileSync(file,'utf8').split(/\r?\n/)) {
    const header = line.match(/; Track \$[0-9a-f]+, sector \$([0-9a-f]+)/i);
    if (header) { sector = (track-3)*16+parseInt(header[1],16); sectors[sector]=[]; }
    const data = line.match(/^\s*HEX\s+([0-9a-f ]+)/i);
    if(data && sector>=0) sectors[sector].push(...data[1].trim().split(/\s+/).map(v=>parseInt(v,16)));
  }
}
// Extraction packages the full game; behavioral tests are separately limited to 1–10.
const levels = Buffer.concat(Array.from({length:150},(_,i)=>Buffer.from(sectors[i])));
const binary = fs.readFileSync('research/main.bin');
fs.mkdirSync('src',{recursive:true});
fs.writeFileSync('src/data.js',`// Pinned Apple II reconstruction; see THIRD-PARTY.md.\nexport const program='${binary.toString('base64')}';\nexport const levelData='${levels.toString('base64')}';\n`);
fs.writeFileSync('research/hashes.json',JSON.stringify({commit:'113db1c16951717259c9ae5e128958b29de0634d',program:crypto.createHash('sha256').update(binary).digest('hex'),levels:crypto.createHash('sha256').update(levels).digest('hex')},null,2));
