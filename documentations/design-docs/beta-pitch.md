# Beta Version Notes

Beta version notes: BoH's core functionality is complete with across-the-board UX improvements. The player's catalog supports both filtering and alphabetical sorting, and the ability card display flips with an animation that we hope is the crux of "making this still feel real." The GM interface supports adding, GameTeX rendering, updating, and deleting ability entries, as well as batch uploading an ability list via a (correctly formatted) JSON. While we do not endorse the use of AI, we acknowledge that an LLM would now be able to parse your `abil-LIST.tex` or `abil-PRINT.pdf` into the desired JSON format, provided you have integrated `MYlookup` as an `FD` field. Building a dedicated integration pipeline via handwritten parsers is still among our top priorities.

Changelog:

- Functionality
  - [GM] JSON upload & template JSON download
  - Alphabetical sorting
- UI
  - Card flip animation
  - Help button & help tool messages for all pages
  - Color scheme polish
  - Border weight adjustments
  - Title font
