# License scope

This repository contains separately licensed components. The root MIT license
applies to the independently written browser application and tooling listed
below. It does **not** relicense the original game or the reverse engineering.

| Material | Terms |
| --- | --- |
| `src/app.js`, `src/machine.js`, `src/index.html`, `src/style.css` | MIT; newly written browser adapters and interface |
| `scripts/*.mjs`, `tests/browser.mjs`, `tests/mechanics.mjs` | MIT; newly written build and verification code |
| Root project documentation and configuration | MIT, excluding quoted third-party notices and the supplied research document |
| `vendor/cpu6502-runtime/` | Upstream MIT, copyright Will Scullin and contributors; its full license is retained |
| `research/main.asm`, `research/main.nw`, `research/track_*.asm` | Upstream reconstruction under CC BY-SA 4.0, subject to underlying original-game rights; see THIRD-PARTY.md |
| `research/main.bin`, `src/data.js`, original maps, sprites, game code and audio sequences | Original game material; **not covered by the project's MIT grant**. Extraction or encoding does not change its rights |
| `dist/*.html`, `dist/game.js`, `tests/machine.mjs`, distribution ZIP | Combined artifacts: retain the component-specific terms above; **not MIT-only** |
| Gameplay screenshots | Contain original game artwork; not covered by the project's MIT grant |
| `lode-runner-codex-research-prompt.md` | User-supplied reference, not relicensed by this project |

The independently written CPU/device adapters execute the original program;
they do not translate or replace its gameplay routines. The binary remains
unchanged. The extraction tool repackages upstream sector bytes. Any adaptation
of the CC BY-SA reconstruction remains under CC BY-SA 4.0; the MIT grant does
not override its ShareAlike obligations.

This is an unofficial preservation project. The availability of an upstream
reconstruction is not a claim that original commercial game assets have been
released under an open-source license. No trademark rights are granted.

See [THIRD-PARTY.md](THIRD-PARTY.md) for pinned sources, attribution, changes,
hashes, and the upstream [CC BY-SA 4.0 terms](https://creativecommons.org/licenses/by-sa/4.0/).
