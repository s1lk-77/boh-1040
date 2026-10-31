# Design Issues Idenitified in v0.0.1 User Tests

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
