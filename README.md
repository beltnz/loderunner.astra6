# lode.ai — Lode Runner, Apple II browser edition

GitHub: [beltnz/loderunner.astra6](https://github.com/beltnz/loderunner.astra6).
Play online: [Lode Runner on GitHub Pages](https://beltnz.github.io/loderunner.astra6/).

**Licensing:** independently written browser code and tooling are MIT licensed.
Original game material and CC BY-SA reconstruction files are excluded from that
grant. The standalone game is a mixed-license artifact. See [LICENSING.md](LICENSING.md)
and [THIRD-PARTY.md](THIRD-PARTY.md) before reusing or redistributing components.

Open **`dist/Lode Runner.html`** directly in a Chromium browser. It is a single, self-contained file: no server, installation, network, account, or build step is needed to play. You can copy that file to another computer. `dist/index.html` is an identical copy for static hosting.

The complete original 150-level campaign is included. This edition runs the reconstructed Apple II NMOS 6502 program, rather than approximating its gameplay in a new engine. The browser supplies memory, keyboard input, a nominal 1.020484 MHz CPU clock, Apple II high-resolution video decoding, speaker audio, and in-memory disk reads. The game code controls movement, guard decisions, timers, sprites, gold, scoring, deaths, escape ladders, and progression.

## Controls

| Action | Keys |
|---|---|
| Move | Arrow keys, or original I / J / K / L |
| Dig left / right | Z / X, or original U / O |
| Stop | Space |
| Pause / resume | Escape |
| Sacrifice a life when stuck | Ctrl+A |

As in the Apple II keyboard mode, a direction stays active until another command or Space. Touch buttons stop on release. Collect all the gold, then escape through the top. Five initial lives; completing a room earns another life. Practice starts a fresh run at the chosen level.

Save game / Load save use local browser storage. Export / Import produce portable JSON snapshots, including CPU, RAM, the keyboard latch, and the score table. Browser storage can be unavailable or cleared; exported files are independent of it. Sound starts muted and can be enabled with the Sound button. Leaving the tab pauses the simulation.

## Fidelity and scope

- Original code and data come from the specific Apple II cracked-disk reconstruction identified in `THIRD-PARTY.md`; this is not a DOS, NES, Championship, or Total Recall version.
- The gameplay code and its update order are retained. The two intercepted routines are `ACCESS_COMPRESSED_LEVEL_DATA` at `$630E` and `ACCESS_HI_SCORE_DATA_FROM_DISK` at `$6359`. Disk operations become local array/storage operations.
- Startup goes straight to a playable room and pre-runs its introductory wipe. Browser controls replace disk boot and joystick setup. No Apple ROM is required.
- Color is a simplified Apple II artifact-color decoder, not an analog NTSC signal simulation. Green display is optional. Audio synthesizes the original speaker transitions with a short decay; physical monitor and speaker characteristics are approximate.
- Game Generator / custom floppy disk editing is not exposed. This deliverable is the original campaign game with browser convenience controls, not a complete Apple II computer emulator.
- Exact equivalence to original hardware has **not** been established by a side-by-side emulator/hardware trace.

## Verification

Only **levels 1–10** were exercised. Levels 11–150 are packaged but remain untested, as requested. No permission for further testing is assumed.

`tests/results.json` records 25 passing checks: 45 simulated seconds of control/guard playability smoke testing on each of levels 1–10, plus gold/scoring, walls, gravity, ladders, ropes, trap doors, digging restrictions, hole refill, player death, guard burial/resurrection, trapping/escape, guard gold transfer, falling collisions, hidden ladders, restart, level 1-to-2 progression, and deterministic save restoration. Isolated mechanics fixtures invoke the actual original routines, with controlled memory arrangements based on level 1. These are not full solved walkthroughs of the ten levels.

`tests/browser-results.json` records passing offline tests on Chrome 155.0.8059.41 and Edge 155.0.4283.45: keyboard, pause, storage, downloaded save export, import/rejection, display options, audio activation, help, mobile layout, and first-ten-level rendering. No HTTP requests or JavaScript errors occurred. Audio activation was tested; subjective audio/hardware fidelity was not measured. Other Chromium browsers were not individually tested.

## Development

Node 24 was used. The delivered HTML does not need Node.

```sh
npm ci --ignore-scripts
npm run build
npm test
npm run test:browser
```

The browser test currently locates installed Chrome and Edge at their standard Windows paths. Adapt the executable paths for other development machines. Windows process isolation can cancel browser downloads and prevent Edge startup; the successful browser tests ran outside that process sandbox, with browser networking explicitly offline.

GitHub Pages publishes the checked-in `dist/` directory on pushes to `main`.
Run the build before committing source changes so the standalone files stay
current. The deployment workflow does not execute gameplay tests or load any
levels. All third-party and license-scope notices are shipped alongside the game.

`scripts/extract.mjs` packages the pinned level sectors; it does not execute or analyze later levels. `scripts/build.mjs` bundles the CPU and application and embeds all resources into the HTML. Tests construct `Machine({testLimit:10})`. The browser QA URL suffix `?qa` also enforces that boundary. Do not raise the test limit without the user's permission.

Source layout: `src/machine.js` (CPU/memory, disk adapters, video), `src/app.js` (browser UI, audio, persistence), `research/` (pinned evidence and raw level sectors), `vendor/cpu6502-runtime/` (MIT CPU source), and `tests/` (limited-scope verification).

See `THIRD-PARTY.md` for provenance and license terms.
