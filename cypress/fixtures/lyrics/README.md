# Lyrics Test Fixtures

OpenSubsonic v1/v2 lyric response fixtures for Cypress component tests.

| File | Description | Used by |
|------|-------------|---------|
| v1-line-only.json | V1 plain lyrics response (no cueLine, no kind) | T11, T14 |
| v2-with-cues.json | Full v2 with ASCII cues + start+end on every cue | T11, T13, T14 |
| v2-no-cues.json | V2 server but no cueLine (no ELRC source) | T11, T14 |
| v2-cjk-korean.json | Korean text with correct UTF-8 byte offsets | T11, T14 |
| v2-rtl-arabic.json | Arabic RTL text with byte offsets | T11 |
| v2-no-end.json | All cues missing `end` (all-or-none fill test) | T11, T13 |
| v2-multi-agent-same-value.json | Two agents, identical text (D3 stack test) | T11, T14 |
| v2-multi-agent-different-value.json | Two agents, different concurrent text (K-pop ad-libs) | T11, T13, T14 |
| v2-multi-language.json | translation first, main second (picker test) | T14 |
| v2-empty.json | Empty structuredLyrics array | T14 |
| v2-oob-cueline.json | cueLine index 99 in a 3-line response (OOB filter) | T13 |
| v2-bad-byte-range.json | byteStart > byteEnd (defensive guard test) | T11 |
| v2-with-offset.json | offset: -100 at structuredLyric level | T13 |
