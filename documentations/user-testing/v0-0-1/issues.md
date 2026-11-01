# Design Issues Idenitified in v0.0.1 User Tests

### Upload pipeline

Level: conceptual\
Severity: critical

As I mostly expected, the lack of a reasonable data pipeline between GameTeX and BoH was cited as the primary obstacle to use. A new bad situation: GMs don't want to do the extra work to populate game data. As GameTeX is an external tool, this was not something I could have realistically addressed in the span of this project, but further development of BoH will have this listed as the top priority.

I'm not exactly sure how such a pipeline could work, but here are several ideas I've had:

- LaTeX parser: implementing a LaTeX parser in BoH's frontend to parse `abil-list.tex`. The primary difficulty with this is that GameTeX is not LaTeX, and GameTeX abilities might have macro references anywhere in the text. A context-free LaTeX parser cannot perform variable replacement when it has no access to the variables' naming to value bindings.
- New GameTeX compile option: create a new compile option on Overleaf GameTeX where all abilities are compiled into a PDF whose literal text is a parsable JSON object. I don't know how realistic this is, but I am more hopeful about this being possible given LaTeX's potent formatting. This is maybe the best thing I have for now.
- PDF parser: this sounds like a severe headache, but perhaps there would be some way to parse a compiled `abil-print.pdf`, although this truly, truly, sounds like a pain.

### Player-defined Categories

Level: conceptual\
Severity: major

Would be very nice if each player can add their own custom tags to their abilities and sort or filter by tag, or otherwise pin things. This would allow individual players with their own pre-existing classification schemas (e.g. having 5 different pockets, each for a different "category" of abilities) to still enjoy that feature.

This would entail adding more concepts to the application. Definitely a tagging concept. This could also be embedded within the inventorying concept where each owned item has tags.

### Synchronization

Level: conceptual\
Severity: moderate to minor

Kkb very acutely pointed out that the world is not ideal, and not all games are finished before they run. That is, most tendays are not. Therefore, GMs will be changing about 50 things per game day. It would be great to support live updates, notifications, and card-redistribution when a card's text has changed.

The answer is Web Sockets. If we can get sockets working, this notification system can be instant over BoH, which is far faster than our current communication method which is the Box.

### Update on upload

Level: conceptual\
Severity: minor

If an ability is uploaded to the app as part of a JSON batch upload but the ability already exists, the app resolves this by console logging an error and claiming this ability could not be added.

Uploader.tsx, line 128:

```typescript
// perform add
// perform the add
const addedEntry = await client["/edit/add-entry"]({
  gameCode,
  lookup: card.MYlookup,
});
if ("error" in addedEntry) {
  console.error("error adding entry");
  continue;
}
```

This behavior, while intended in v0.0.1, wants some change. It is more convenient instead to update the entries per the uploaded data when the ability exists, rather than to treat them as invalid adds. I imagine this will be the primary way abilities are updated once a better upload pipeline from GameTeX is implemented. Fortunately this should be an easy fix. All we have to do is add `update-entry` logic in that error block.
