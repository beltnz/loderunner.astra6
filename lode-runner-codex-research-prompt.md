# Lode Runner — Apple II / Apple IIe and IBM PC / DOS research prompt

Research date: 2026-10-15. This is a fresh Lode Runner brief.

## Instructions to the coding agent

You are researching and, when the user's implementation request calls for it, writing code based on the original Lode Runner. Use this document as a source map and working brief. Do not assume that every title or platform bearing the name has identical rules.

Default reference target: Doug Smith's original 1983 Apple II Lode Runner, including operation on an Apple IIe. Keep IBM PC boot-disk, Tandy 1000, and later MS-DOS editions separate until their behavior and data have been checked. “DOS” can mean Apple DOS or IBM-compatible MS-DOS; resolve that distinction in the implementation scope. Championship Lode Runner, NES releases, Lode Runner: The Legend Returns, and modern remakes are separate comparison targets.

First inspect the user's repository and instructions. If asked only for research, produce research, not a game. If asked to implement, establish the target platform, required fidelity, language/runtime, and whether original assets or newly made assets are intended. Work on the portions already specified while identifying unresolved choices.

Use original manuals for intended player-facing rules, the original executable for observed behavior, and annotated disassembly for implementation details. Modern remakes are comparative implementations. Do not present inferred rules as verified original behavior. Keep evidence labels: Manual, Code-confirmed, Observed, Inferred, Unresolved. Cite source IDs below plus file/symbol/page/commit where possible.

This is a broad, verified discovery catalogue, not a claim that every surviving document on the internet has been located. Some materials were inspected only at the catalogue or repository level. Read the relevant source before deriving an exact algorithm from it. No reconstruction was built and no emulator comparison was performed during this research.

## Fastest useful reading order

1. **S01**: original Apple II manual, including Game Generator instructions.
2. **S05**: annotated Apple II reverse engineering; use its source and PDF together.
3. **S06**: searchable research adaptation, level extraction tools, and documented open questions.
4. **S12–S13**: maps and Apple II FAQ for level and puzzle checks.
5. **S03–S04**: PC/Tandy documentation, if that edition is in scope.
6. **S08–S10**: comparative modern engines and guard analysis; verify their differences from the chosen original.

## Original manuals and editor documentation

### S01 — Original Apple II manual: primary player documentation

- Direct PDF: https://mirrors.apple2.org.za/ftp.apple.asimov.net/documentation/applications/misc/Broderbund_Lode_Runner_manual.pdf
- Alternative scan: https://mirrors.apple2.org.za/ftp.apple.asimov.net/documentation/games/misc/lode-runner.pdf
- Archive directory: https://mirrors.apple2.org.za/ftp.apple.asimov.net/documentation/games/misc/
- Status: inspected the first scan and extracted text from the alternate scan. They are alternative scans, not proven different editions.
- Contents: controls, scoring, guards, digging, 150 levels, Game Generator, tile choices, custom level disks, save/test workflow, and Apple IIe key equivalents.
- Coding value: player-facing behavior and editor requirements. Extract exact key mappings from the scan rather than a derivative webpage.
- Known transcription trap: editor tile **5 is a trap door** in the scan. An online transcription loses this label. Editor movement keys also differ from normal play controls; do not merge the two tables.

### S02 — Text transcriptions and editor quick reference

- Full manual transcription: https://apple2games.com/wiki/Lode_Runner.html
- Archive text manual: https://mirrors.apple2.org.za/ftp.apple.asimov.net/documentation/games/misc/Lode%20Runner.txt
- Editor quick reference: https://mirrors.apple2.org.za/www.textfiles.com/apple/DOCUMENTATION/lode.run.editor
- Textfiles directory: https://mirrors.apple2.org.za/www.textfiles.com/apple/DOCUMENTATION/.windex.html
- Status: web transcription and quick reference inspected; the archive text manual was located in the index but not independently compared line by line.
- Coding value: searchable companion text. The quick reference describes editor commands and tile placement. Treat scans as authoritative when transcriptions conflict.

### S03 — Original Tandy 1000 manual

- Direct PDF: https://www.mocagh.org/broderbund/loderunner-manual.pdf
- Supporting catalogue/documentation page: https://www.pixelatedarcade.com/games/lode-runner
- Status: inspected. Cover identifies **Tandy 1000, catalogue 25-1113**; this edition credits Doug Greene's version.
- Coding value: platform-specific input, launch instructions, editor and game operation. Do not silently transfer Apple II keyboard mappings or timing to it.

### S04 — A download labelled “DOS manual” that is actually the Tandy boot-disk manual

- Landing page: https://www.myabandonware.com/game/lode-runner-xt
- Manual download endpoint: https://www.myabandonware.com/download/m4y0-lode-runner
- Observed direct PDF URL: https://d3.xp.myabandonware.com/f/m4y0/Lode-Runner_Manual_DOS_EN.pdf
- Status: downloaded and inspected rendered pages. Cover identifies Tandy 1000; startup instructions tell the reader to boot from the master disk. This is **not independent confirmation of a native MS-DOS edition's manual**.
- Prefer the landing page if the direct download host changes. The scan has no useful embedded text; render or OCR it when needed.

## Source, disassembly, data formats, and implementation research

### S05 — Annotated Apple II disassembly / reconstruction: highest-value technical source

- Repository: https://github.com/XekriRedmane/lode_runner_reveng
- Former URL, currently redirects: https://github.com/RobertBaruch/lode_runner_reveng
- PDF viewer: https://github.com/XekriRedmane/lode_runner_reveng/blob/main/main.pdf
- Raw PDF: https://raw.githubusercontent.com/XekriRedmane/lode_runner_reveng/main/main.pdf
- Snapshot observed: `113db1c16951717259c9ae5e128958b29de0634d`.
- Pinned source tree: https://github.com/XekriRedmane/lode_runner_reveng/tree/113db1c16951717259c9ae5e128958b29de0634d
- Status: repository documentation inspected; PDF downloaded, confirmed to contain **295 pages**, and text extracted. No build performed.
- Important files: `main.nw` (literate source), `main.pdf`, `main.asm`, `main.bin`, `build.py`, `disk/`, and sprite tables.
- The repository describes reconstruction of a known cracked Apple II disk image using `dasm`, and claims byte-identical output. Treat that as the author's claim until reproduced against the specified input. This is reverse engineering, not a verified release of Doug Smith's original source tree.
- Coding value: engine routines, data layout, graphics, disk handling, level data, and source-level evidence. Its documentation explicitly does not explain every detail.
- Check the repository's CC BY-SA terms and original-game asset provenance before reusing material.

### S06 — Research browser and platform-neutral specification project

- Repository: https://github.com/fschuhi/a2-lode-runner
- Raw README: https://raw.githubusercontent.com/fschuhi/a2-lode-runner/main/README.md
- Published browser advertised by the project: https://fschuhi.github.io/a2-lode-runner/
- Published level catalogue: https://fschuhi.github.io/a2-lode-runner/levels.html
- Snapshot observed: `d9ff1ed008bea1126de50f4b1ee3f34afd8d4b83`.
- Pinned tree: https://github.com/fschuhi/a2-lode-runner/tree/d9ff1ed008bea1126de50f4b1ee3f34afd8d4b83
- Status: README retrieved directly and repository contents inspected. The published site was inaccessible through the search tool; use the repository as fallback.
- Relevant paths: `docs/main-nw/index.md`, `docs/main-nw/03-graphics.md`, `docs/main-nw/06-levels.md`, `research/main.nw-edited.md`, `scripts/level_extractor.py`, `scripts/level_images.py`, `reference/lode_runner_reveng/`, `GOALS.md`, `TODO.md`, and `manifest.lst`.
- Commands advertised include `make nwchapter`, `make nwchunk`, `make level-ascii`, `make level-check`, and `make nwhtml`; inspect prerequisites before running.
- Important limitation: its README says `docs/core-game-spec.md` is **not started yet**. Do not mistake the proposed complete specification for a finished deliverable. Some LLM collaboration files mentioned by the repository are intentionally not committed.
- Coding value: navigation, extracted levels, provenance and unresolved research questions. It is derived from S05, not independent corroboration.

### S07 — LRRL development-resources archive: useful but misleadingly labelled

- Directory: https://mirrors.apple2.org.za/ftp.apple.asimov.net/documentation/games/misc/
- Direct ZIP: https://mirrors.apple2.org.za/ftp.apple.asimov.net/documentation/games/misc/lrrl-lode%20runner%20development%20resources%20%28game%20engine%2C%20source%20code%2Cassembly%20listing%2Cmemory%20dump%29.zip
- Status: downloaded and archive contents inspected.
- Contains `LOAD RUNNER#fc0801`, `lrrl.a65`, `lrrl.bin`, `lrrl.lst`, `postmortem.bin`, and `readme.txt`.
- The assembly source and listing are for a **relocator**. Other files include engine binaries and an initial memory dump. This is not a complete original-game source release.
- Coding value: historical binary investigation and comparison with S05. Read its own README before interpreting addresses or memory layout.

### S08 — Lode Runner Total Recall: modern JavaScript implementation

- Repository: https://github.com/SimonHung/LodeRunner_TotalRecall
- Project documentation: https://simonhung.github.io/LodeRunner_TotalRecall/
- Playable implementation: https://simonhung.github.io/LodeRunner_TotalRecall/lodeRunner.html
- Status: repository and project documentation inspected, not executed for fidelity testing.
- Useful files include `lodeRunner.guard.js`, `lodeRunner.runner.js`, `lodeRunner.def.js`, `lodeRunner.edit.js`, `lodeRunner.key.js`, and `lodeRunner.v.classic.js`.
- Coding value: readable actor logic, editor behavior, and classic level data. It includes multiple game sets; select the correct one. It is not original Apple II or IBM PC source, nor proof of exact timing or edge-case fidelity.

### S09 — loderunner-ng: another comparative implementation

- Repository: https://github.com/vchimishuk/loderunner-ng
- Status: repository documentation inspected; no build or behavioral test performed.
- Modern SDL2 implementation with a CMake build. It references Total Recall, so agreement between the two is not necessarily independent evidence. Inspect its GPL licensing and the specific files before copying code.

### S10 — Guard behavior analysis

- Article: https://datadrivengamer.blogspot.com/2023/01/championship-lode-runner-guard.html
- Status: article inspected. It discusses guard decisions in a **Championship Lode Runner** context and refers to remake code.
- Coding value: questions to investigate about routing, direction preferences, and tie breaking. Do not replace the original decision sequence with a generic shortest-path algorithm and assume equivalent results. Verify applicability to the selected original version in S05 or executable traces.

### S11 — Published C/assembly treatment: different platform

- Title: *Lode runnerで学ぶ実践C言語*.
- Catalogue record: https://ci.nii.ac.jp/ncid/BN03446737?l=en
- Identifier: `BN03446737`; ISBN `4893690116`; BNN, December 1986, 333 pages.
- Status: bibliographic record inspected; full book not obtained or read.
- The catalogue describes a **PC-98** treatment with C and assembler listings, memory/I/O/BIOS material, and an interview. This is a promising published source, but not evidence of Apple II or IBM PC source availability. Digital access may be restricted.

## Level maps, solutions, and game verification

### S12 — All 150 Apple II levels as map sheets

- Atlas index: https://vgmaps.com/Atlas/AppleII/index.htm
- One directly verified sheet: https://vgmaps.com/Atlas/AppleII/LodeRunner-Levels055-084.png
- Status: atlas listing inspected. It lists Lode Runner sheets covering levels 001–054, 055–084, 085–126, and 127–150, credited to G.E.R.
- Use the index for the other exact image URLs rather than guessing paths.
- Coding value: visual level comparison. Prefer decoded disk data for tile semantics because screenshots can hide trap doors or unrevealed ladders.

### S13 — Apple II FAQ / text maps

- Andrew Schultz FAQ: https://gamefaqs.gamespot.com/pc/930116-lode-runner/faqs/7328
- Status: inspected. Despite the `/pc/` URL, the document is labelled **FAQ (APL2)** and discusses the Apple II game.
- Contains general information, text maps, tips and cheats. Do not assume it supplies a complete step-by-step solution to every level. Check editor commands against the official manual where they disagree.

## Contemporary and historical documentation

### S14 — Hardcore Computist #22

- Full issue: https://mirrors.apple2.org.za/ftp.apple.asimov.net/documentation/magazines/hardcore_computist/issue22.pdf
- Located article: “Softkey For Lode Runner,” Tom Phelps.
- Status: issue and indexed article located, not fully transcribed. Historical preservation material may help explain disk layout and the particular modified disk variant being studied. Establish page numbers and applicability before citing an exact technique.

### S15 — Hardcore Computist #70

- Full issue: https://mirrors.apple2.org.za/ftp.apple.asimov.net/documentation/magazines/hardcore_computist/Hardcore%20Computist_issue%2070.pdf
- Status: issue located; indexed material discusses Lode Runner custom boards and disk modification. Not fully transcribed. Search/OCR within the issue for the game name.

### S16 — Development history and official series context

- Jimmy Maher, *The Digital Antiquarian*: https://www.filfre.net/2020/12/lode-runner/
- Tozai official history: https://global.tozaigames.com/loderunner/history
- Status: both inspected. Useful for authorship, development context, and distinguishing releases; neither is an exact engine specification.
- Interview lead linked from historical coverage: https://www.ign.com/articles/1999/02/18/locknlode
- Status of IGN lead: discovered, but full article retrieval failed. Do not quote it without obtaining the text.

### S17 — Historical discussion of source remnants

- Thread: https://groups.google.com/g/comp.sys.apple2/c/tdiMYZaKSks
- Linked archive directory: https://www.brutaldeluxe.fr/public/
- Status: indexed discussion located; full thread retrieval was rate-limited. The current linked directory did not expose the cited Lode Runner material.
- Treat as a historical lead about partial source remnants/disassembly, not proof that a complete original source release is currently available there.

## Separate related edition: Championship Lode Runner

These sources can expose differences, but should not be merged into the original 150-level game's specification.

### S18 — Championship manuals and FAQ

- Original manual scan: https://www.mocagh.org/broderbund/masksun-loderunner-loderunner-manual.pdf
- Alternate archive PDF: https://mirrors.apple2.org.za/ftp.apple.asimov.net/documentation/games/misc/Championship%20Lode%20Runner.pdf
- Apple II FAQ: https://gamefaqs.gamespot.com/appleii/575832-championship-lode-runner/faqs/7381
- Textfiles index also lists Championship hint transcriptions named `loderunner1`, `loderunner2`, and `loderunner3`: https://mirrors.apple2.org.za/www.textfiles.com/apple/DOCUMENTATION/.windex.html
- Status: MOCAGH scan inspected; other resources located. Despite the generic MOCAGH filename, the cover identifies **Championship**. It is a distinct 50-level release.
- A previously circulated fanbook lead at `https://www.spoonbillsoftware.com.au/loderunner.htm` was a parked/domain-sale page when checked; do not depend on it as a live source.

## IBM PC / MS-DOS discovery gaps

Useful catalogue leads:

- https://www.mobygames.com/game/243/lode-runner/
- https://www.pixelatedarcade.com/games/lode-runner
- https://www.myabandonware.com/game/lode-runner-xt
- https://www.pcgamingwiki.com/wiki/Lode_Runner

These are discovery and identification sources, not primary authority for binary formats or game algorithms. Catalogue dates for later DOS releases disagree. Establish edition from the executable, title/copyright screen, package, and actual startup procedure. Do not infer a native MS-DOS program merely from a download category called “DOS.”

Not established in this research:

- A complete annotated IBM PC or MS-DOS disassembly comparable to S05.
- A verified release of Doug Smith's original development source tree.
- A separately verified native MS-DOS manual distinct from the Tandy boot-disk scan.
- Exact cross-platform equivalence of levels, guard behavior, timing, graphics, controls, saves, and editor formats.
- Successful download/inspection of the later DOS game's executable and accompanying files.

## Implementation research work to perform

The following is a proposed engineering workflow, not a claim that these details are already settled.

1. **Pin evidence.** Record repository commit IDs, download URLs, retrieval times, file hashes, platform, and edition. Keep manuals, source, extracted data, and your notes distinguishable. Raw branch URLs can change; use the pinned trees above or record a newer commit explicitly.
2. **Identify the binary.** Obtain the intended game image from an appropriate source or the user. Record its hash and variant. For S05 reconstruction, follow that project's named input and build instructions rather than substituting an arbitrary disk image.
3. **Make a mechanics specification.** Trace player movement, climbing/falling, bars, digging eligibility, holes and refill timing, guards entering/escaping holes, gold carrying/dropping, collisions, death, respawn, hidden ladders, completion, scoring and progression. Attach exact routine or observation evidence to each rule.
4. **Recover timing and update order.** Determine movement cadence, input sampling, actor order, collision order and delays. Avoid inventing durations from modern video frame rates. Separate simulation ticks from rendering only after reproducing the required semantics.
5. **Recover level encoding.** Verify dimensions, tile values, packing, disk offsets, actor placement, orientation and hidden tiles. Compare extractor output with manual semantics and atlas maps. Keep stored level data separate from mutable runtime state.
6. **Specify the editor independently.** Trace palette, keyboard commands, placement constraints, testing, saving/loading, and custom disk behavior. Reproducing the original disk format is a separate feature from providing a modern editor.
7. **Use deliberate comparisons.** Compare original execution, S05 routines and remake behavior on selected scenarios. Where they disagree, preserve the chosen original target and document the difference.
8. **Implement only the requested scope.** Keep a deterministic game core and presentation/input adapters where practical. Do not add unrelated ports, editors, networking, or features merely because a reference implements them.
9. **Test consequential behavior.** Use meaningful fixtures for trap-door traversal, hidden-ladder reveal, digging obstacles, hole refill with occupants, guard escape, gold transfer, falling collisions, level reset and completion. Include representative difficult original levels; a plausible-looking first screen is not adequate fidelity evidence.
10. **Report reproducibility and gaps.** Provide build/run commands, sources actually used, verified rules, known deviations, and unresolved assumptions. Distinguish reconstruction success from behavioral equivalence.

Suggested research outputs are `SOURCES.md`, `VERSION-MATRIX.md`, `GAMEPLAY-SPEC.md`, `LEVEL-FORMAT.md`, and `OPEN-QUESTIONS.md`; create them only when useful to the requested project. Each substantive specification claim should point back to a source and precise location or a reproducible observation.

## Retrieval and fallback notes

- All external links here are HTTPS URLs; no special authenticated URI is required. The ISBN and catalogue ID identify the book when web URLs move. No temporary signed download URLs or session-local citation tokens are needed to use this brief.
- GitHub repositories can be cloned from the listed repository URLs. Read build scripts and dependencies before execution. Pin commits for repeatability; the two recorded commits were obtained from GitHub's public API during this research.
- When a web reader cannot open a PDF or raw text file, use an ordinary HTTP download and inspect content type and file signature. Some download endpoints return an HTML page rather than the advertised archive.
- Image-only scans need rendering or OCR. Verify numerals, key names, tile labels and diagrams visually before coding from OCR output.
- If a link disappears, search its exact title or filename and the named archive's index. Archive snapshots are a recovery path, not automatically the same edition; record the snapshot date and URL you actually used.
- Source availability does not establish a blanket license for original artwork, levels, binaries or manuals. Preserve source-specific attribution and reuse terms; do not assume a remake's code license covers every bundled asset.

This brief contains references and research instructions, not redistributed game binaries, full manuals, or a completed game specification.
