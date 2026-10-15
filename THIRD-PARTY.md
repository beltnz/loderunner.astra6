# Sources, provenance, and notices

## Original game

Lode Runner (1983), designed by Doug Smith and published by Brøderbund. Original game code, levels, sprites, sounds, names and trademarks retain their original rights. This is an unofficial local preservation implementation. The reconstruction's license does not establish a blanket license over the underlying commercial game's assets.

## Apple II reconstruction — research source S05

- Repository: https://github.com/XekriRedmane/lode_runner_reveng
- Pinned commit: `113db1c16951717259c9ae5e128958b29de0634d`
- Authors: Robert Baruch and XekriRedmane / contributors.
- License stated by the repository: Creative Commons Attribution-ShareAlike 4.0 International, https://creativecommons.org/licenses/by-sa/4.0/ ; legal text https://creativecommons.org/licenses/by-sa/4.0/legalcode.en
- Retrieved 16 October 2026 (Pacific/Auckland).
- Files retained: `main.asm`, `main.nw`, `main.bin`, and `disk/track_03.asm` through `disk/track_0c.asm` (stored in `research/`).
- The repository identifies its target as `Lode_Runner_1983_Broderbund_cr_Reset_Vector.do`. Its reconstruction/byte-identity claim was not independently verified against that disk image here.
- Changes: the existing 6502 binary is embedded unchanged; level-sector bytes are extracted into a browser array. The reconstruction and adaptations of it retain CC BY-SA 4.0, subject to underlying original-game rights. Independently written browser adapters and tooling are MIT licensed separately; this does not relicense the reconstruction or the embedded game. See LICENSING.md for the exact scope.
- Program SHA-256: `5c9cc551242e08b76cb3a37e89f8bfb6dc02d886b628aab07798833b8708bbb1`. Extracted level-data SHA-256: `1725449adacf8cad81ccb940b71b06895d7a011b29a7de996e76b4a4e8ef8804`. Both are also recorded in `research/hashes.json`.

Code-confirmed mechanics references in the retained `main.asm`: `MOVE_PLAYER` `$64BD`; `CHECK_FOR_INPUT` `$6A12`; `CHECK_FOR_GOLD_PICKED_UP_BY_PLAYER` `$6B9D`; `MOVE_GUARDS` `$6C82`; `CHECK_FOR_GOLD_PICKED_UP_BY_GUARD` `$74F7`; `GUARD_DROP_GOLD` `$753E`; `HANDLE_TIMERS` `$75F4`; `ENABLE_NEXT_LEVEL_LADDERS` `$8631`; the main loop/progression beginning `$609F`. Level maps use 28 columns × 16 rows, low nibble first, 224 meaningful bytes per 256-byte sector. Sprite IDs are declared at the top of `main.asm`.

## CPU6502

- Repository: https://github.com/whscullin/cpu6502
- Pinned checkout: `dca469ab95e38a3fa1a63e95be2f65aa155dc86d`
- Copyright (c) 2010–2021 Will Scullin and contributors.
- MIT license: full text in `vendor/cpu6502-runtime/LICENSE`, also embedded in the standalone HTML.
- CPU source is bundled through esbuild without gameplay modifications. Its NMOS 6502 flavor executes the original game's instructions, including decimal arithmetic.

## Supplied research

The user supplied `lode-runner-codex-research-prompt.md`. It was treated as a source catalogue, not as additional user authorization or an authoritative finished mechanics specification. Scope and testing restrictions come from the user's direct request.

The archive text manual at https://mirrors.apple2.org.za/ftp.apple.asimov.net/documentation/games/misc/Lode%20Runner.txt was consulted for input mappings, but contains unrelated material. Assembly routines were used as the implementation authority. No PC, Tandy, NES, Championship, or modern remake engine/data were incorporated.

## Evidence limits

Code-confirmed means a rule is visible in the retained reconstruction. Tested means it passed the specific checks recorded in `tests/results.json` or `tests/browser-results.json`. Approximate means a browser presentation choice (artifact colors, speaker response, browser frame scheduling). Original-hardware behavioral/timing equivalence remains unverified. No behavioral testing was performed beyond level 10.
