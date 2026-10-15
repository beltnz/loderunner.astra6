// SPDX-License-Identifier: MIT
import {build} from 'esbuild';
import fs from 'node:fs';
const notice=`/* Independently written browser application and tooling:\n${fs.readFileSync('LICENSE','utf8')}\nCPU6502 license:\n${fs.readFileSync('vendor/cpu6502-runtime/LICENSE','utf8')}\nLicense scope:\n${fs.readFileSync('LICENSING.md','utf8')}\nApple II reconstruction: Robert Baruch / XekriRedmane, CC BY-SA 4.0, https://github.com/XekriRedmane/lode_runner_reveng . Changes: binary embedded unchanged; level sectors repackaged as a browser array. https://creativecommons.org/licenses/by-sa/4.0/ . Original game copyright Doug Smith / Broderbund; original assets retain their rights. This combined file is not MIT-only. */`;
await build({entryPoints:['src/app.js'],bundle:true,format:'iife',target:'chrome100',outfile:'dist/game.js',banner:{js:notice}});
const html=fs.readFileSync('src/index.html','utf8').replace('/* INLINE_STYLE */',fs.readFileSync('src/style.css','utf8')).replace('/* INLINE_SCRIPT */',fs.readFileSync('dist/game.js','utf8'));
fs.writeFileSync('dist/Lode Runner.html',html);
fs.copyFileSync('dist/Lode Runner.html','dist/index.html');
await build({entryPoints:['src/machine.js'],bundle:true,format:'esm',platform:'node',outfile:'tests/machine.mjs'});
for(const file of ['README.md','LICENSE','LICENSING.md','THIRD-PARTY.md'])fs.copyFileSync(file,`dist/${file}`);
fs.writeFileSync('dist/.nojekyll','');
