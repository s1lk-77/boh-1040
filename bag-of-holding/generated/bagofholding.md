<!-- Generated from the BagOfHolding assembly. Do not edit. -->
<!-- Manifest producer: @mit-sdg/sync-engine@1.1.0; concept specification: sync-engine.concept-specification@1; renderer: @mit-sdg/sync-engine@1.1.0. -->

# BagOfHolding — assembled read-back

_Assembled by sync-engine from registered concepts and composition. Edit the concept_
_specifications and composition source, then regenerate this file._

## Concepts

### Cataloging

Defined in [Cataloging](../design/concepts/Cataloging.md), line 1.

#### Actions

- `catalog(name: String, features: Features, default_: Value) : returns (catalog: Catalog)`
  - Refuses `BAD_CATALOG_OP`: Catalog with this name already exists
- `addEntry(catalog: Catalog, entry: Entry) : returns (entry: Entry)`
  - Refuses `BAD_CATALOG_OP`: failed to add entry to catalog
- `update(catalog: Catalog, entry: Entry, feature: Feature, value: Value) : returns (entry: Entry)`
  - Refuses `BAD_CATALOG_OP`: Could not update catalog entry
- `delete(catalog: Catalog, entry: Entry) : returns (entry: Entry)`
  - Refuses `BAD_CATALOG_OP`: Could not delete entry from catalog

#### Queries

- `_isCatalog(name: String) : one (isCatalog: Flag)`
- `_get(catalog: Catalog, entry: Entry) : many (feature: Feature, value: Value)`
- `_exists(catalog: Catalog, entry: Entry) : one (exists: Flag)`

#### Instances

- `Cataloging` — instance of `Cataloging` — [Application types](../design/types.md), line 29.
  - `Entry` is `Naming.Key` — [Application types](../design/types.md), line 30.
  - `Feature` is `AnyString` — [Application types](../design/types.md), line 31.
  - `Value` is `AnyString` — [Application types](../design/types.md), line 32.

### Inventorying

Defined in [Inventorying](../design/concepts/Inventorying.md), line 1.

#### Actions

- `make(owner: Owner) : returns (owner: Owner)`
  - Refuses `BAD_INVENTORY_OP`: Owner already exists
- `add(owner: Owner, item: Item) : returns (item: Item)`
  - Refuses `BAD_INVENTORY_OP`: Owner already owns item
- `remove(owner: Owner, item: Item) : returns (item: Item)`
  - Refuses `BAD_INVENTORY_OP`: Owner does not own item
- `delete(owner: Owner) : returns (owner: Owner)`
  - Refuses `BAD_INVENTORY_OP`: Owner does not exist

#### Queries

- `_owns(owner: Owner, item: Item) : one (owns: Flag)`
- `_getAll(owner: Owner) : many (item: Item)`

#### Instances

- `Inventorying` — instance of `Inventorying` — [Application types](../design/types.md), line 25.
  - `Item` is `Naming.Key` — [Application types](../design/types.md), line 27.
  - `Owner` is `AnyString` — [Application types](../design/types.md), line 26.

### Joining

Defined in [Joining](../design/concepts/Joining.md), line 1.

#### Actions

- `create(id: Identifier, name: String) : returns (context: Context)`
  - Refuses `DUPLICATE_CONTEXT`: That id is already in use.
- `join(id: Identifier, member: Member) : returns (member: Member)`
  - Refuses `NO_SUCH_CONTEXT`: The given id is not a context
  - Refuses `DUPLICATE_MEMBER`: Cannot add a member that is already in the context
- `updateName(id: Identifier, name: String) : returns (name: String)`
  - Refuses `NO_SUCH_CONTEXT`: no such context.

#### Queries

- `_isContext(id: Identifier) : one (isContext: Flag)`
- `_isMember(id: Identifier, member: Member) : one (isMember: Flag)`
- `_getName(id: Identifier) : one (name: String)`

#### Instances

- `Joining` — instance of `Joining` — [Application types](../design/types.md), line 21.
  - `Identifier` is `GameCode` — [Application types](../design/types.md), line 22.
  - `Member` is `Name` — [Application types](../design/types.md), line 23.

### Naming

Defined in [Naming](../design/concepts/Naming.md), line 1.

#### Actions

- `uniquify(context: Context, suffix: Suffix) : returns (key: Key)`
  - Refuses `ALREADY_EXISTS`: Key already exists.
- `delete(key: Key) : returns (key: Key)`
  - Refuses `DOES_NOT_EXIST`: Key does not exist

#### Queries

- `_getKey(context: Context, suffix: Suffix) : one (key: Key)`
- `_getValue(key: Key) : one (context: Context, suffix: Suffix)`

#### Instances

- `Naming` — instance of `Naming` — [Application types](../design/types.md), line 17.
  - `Context` is `GameCode` — [Application types](../design/types.md), line 18.
  - `Suffix` is `Name` — [Application types](../design/types.md), line 19.

## Application types

Concrete types:

- `AnyString` — [Application types](../design/types.md), line 12.
- `GameCode` — [Application types](../design/types.md), line 6.
- `Name` — [Application types](../design/types.md), line 9.

## Formers

_Formers name result shapes evaluated when asked. The source former owns_
_the authored explanation; this section records the generated shape._

### the abil card

Authored path: `Collect.Card`.
- Covered by [Collect](../design/compositions/Collect.md), line 21.

```former
Former "the abil card" — inputs (entry); bindings (feature, value); promises exactly one record — forms:
  a record of
    card: each Cataloging._get (catalog: "abils", entry) has (feature, value)
      form a record of
        feature
        value
```

### the abil compendium

Authored path: `Collect.Compendium`.
- Covered by [Collect](../design/compositions/Collect.md), line 23.

```former
Former "the abil compendium" — inputs (pid); bindings (entry, feature, value); promises exactly one record — forms:
  a record of
    cards: each Inventorying._getAll (owner: pid) has (item: entry)
      form a record of
        card: each Cataloging._get (catalog: "abils", entry) has (feature, value)
          form a record of
            feature
            value
```

## Reactions

### Collect.Admin:collected

Authored path: `Collect.Admin`.
- Covered by [Collect](../design/compositions/Collect.md), line 15.
- Covered by [Collect](../design/compositions/Collect.md), line 18.

```reaction
when RequestBoundary.request (gameCode, path: "/collect/admin", requestId)
where
  Joining._isContext (id: gameCode) has (isContext: true)
then
  RequestBoundary.respond (abils: former "the abil compendium" with (pid: gameCode), requestId)
```

### Collect.Admin:gameNotFound

Authored path: `Collect.Admin`.
- Covered by [Collect](../design/compositions/Collect.md), line 15.
- Covered by [Collect](../design/compositions/Collect.md), line 18.

```reaction
when RequestBoundary.request (gameCode, path: "/collect/admin", requestId)
where
  Joining._isContext (id: gameCode) has (isContext: false)
then
  RequestBoundary.respond (error: "DOES_NOT_EXIST", msg: "gameNotFound", requestId)
```

### Collect.Print:alreadyFound

Authored path: `Collect.Print`.
- Covered by [Collect](../design/compositions/Collect.md), line 3.
- Covered by [Collect](../design/compositions/Collect.md), line 6.

```reaction
when RequestBoundary.request (gameCode, lookup, path: "/collect/print", playerName, requestId)
where
  Naming._getKey (context: gameCode, suffix: lookup) has (key: entry)
  Naming._getKey (context: gameCode, suffix: playerName) has (key: pid)
  Inventorying._owns (item: entry, owner: pid) has (owns: true)
then
  RequestBoundary.respond (error: "BAD_INVENTORY_OP", msg: "alreadyFound", requestId)
```

### Collect.Print:found

Authored path: `Collect.Print`.
- Covered by [Collect](../design/compositions/Collect.md), line 3.
- Covered by [Collect](../design/compositions/Collect.md), line 6.

```reaction
when RequestBoundary.request (gameCode, lookup, path: "/collect/print", playerName, requestId)
where
  Naming._getKey (context: gameCode, suffix: playerName) has (key: pid)
  Naming._getKey (context: gameCode, suffix: lookup) has (key: entry)
  Inventorying._owns (item: entry, owner: gameCode) has (owns: true)
  Inventorying._owns (item: entry, owner: pid) has (owns: false)
then
  Inventorying.add (item: entry, owner: pid)
```

### Collect.Print:found#2

Authored path: `Collect.Print`.
- Covered by [Collect](../design/compositions/Collect.md), line 3.
- Covered by [Collect](../design/compositions/Collect.md), line 6.

```reaction
when Inventorying.add (item: entry, owner: pid), asked by Collect.Print:found
where
  earlier, RequestBoundary.request (gameCode, lookup, path: "/collect/print", playerName, requestId)
then
  RequestBoundary.respond (abil: former "the abil card" with (entry), requestId)
```

### Collect.Print:noKey

Authored path: `Collect.Print`.
- Covered by [Collect](../design/compositions/Collect.md), line 3.
- Covered by [Collect](../design/compositions/Collect.md), line 6.

```reaction
when RequestBoundary.request (gameCode, lookup, path: "/collect/print", playerName, requestId)
where
  Naming._getKey (context: gameCode, suffix: lookup) has (key: null)
then
  RequestBoundary.respond (error: "DOES_NOT_EXIST", msg: "noKey", requestId)
```

### Collect.Print:noPlayer

Authored path: `Collect.Print`.
- Covered by [Collect](../design/compositions/Collect.md), line 3.
- Covered by [Collect](../design/compositions/Collect.md), line 6.

```reaction
when RequestBoundary.request (gameCode, lookup, path: "/collect/print", playerName, requestId)
where
  Naming._getKey (context: gameCode, suffix: playerName) has (key: null)
then
  RequestBoundary.respond (error: "DOES_NOT_EXIST", msg: "noPlayer", requestId)
```

### Collect.Print:noSuchAbil

Authored path: `Collect.Print`.
- Covered by [Collect](../design/compositions/Collect.md), line 3.
- Covered by [Collect](../design/compositions/Collect.md), line 6.

```reaction
when RequestBoundary.request (gameCode, lookup, path: "/collect/print", playerName, requestId)
where
  Naming._getKey (context: gameCode, suffix: lookup) has (key: entry)
  Inventorying._owns (item: entry, owner: gameCode) has (owns: false)
then
  RequestBoundary.respond (error: "BAD_INVENTORY_OP", msg: "noSuchAbil", requestId)
```

### Collect.Production:collected

Authored path: `Collect.Production`.
- Covered by [Collect](../design/compositions/Collect.md), line 9.
- Covered by [Collect](../design/compositions/Collect.md), line 12.

```reaction
when RequestBoundary.request (gameCode, path: "/collect/production", playerName, requestId)
where
  Naming._getKey (context: gameCode, suffix: playerName) has (key: pid)
then
  RequestBoundary.respond (abils: former "the abil compendium" with (pid), requestId)
```

### Collect.Production:noPlayer

Authored path: `Collect.Production`.
- Covered by [Collect](../design/compositions/Collect.md), line 9.
- Covered by [Collect](../design/compositions/Collect.md), line 12.

```reaction
when RequestBoundary.request (gameCode, path: "/collect/production", playerName, requestId)
where
  Naming._getKey (context: gameCode, suffix: playerName) has (key: null)
then
  RequestBoundary.respond (error: "DOES_NOT_EXIST", msg: "noPlayer", requestId)
```

### DeliverFaultToAsker

```reaction
when any action is faulted, not asked by DeliverFaultToAsker
where
  earlier, RequestBoundary.request (requestId)
then
  RequestBoundary.respondFramework (error: "INTERNAL_ERROR", requestId)
```

### DeliverRefusalToAsker

```reaction
when any action is refused (message), except RequestBoundary
where
  earlier, RequestBoundary.request (requestId)
then
  RequestBoundary.respond (error: message, requestId)
```

### Edit.AddEntry:entryAdded

Authored path: `Edit.AddEntry`.
- Covered by [Edit](../design/compositions/Edit.md), line 3.
- Covered by [Edit](../design/compositions/Edit.md), line 6.

```reaction
when RequestBoundary.request (gameCode, lookup, path: "/edit/add-entry", requestId)
where
  Naming._getKey (context: gameCode, suffix: lookup) has (key: null)
then
  Naming.uniquify (context: gameCode, suffix: lookup)
```

### Edit.AddEntry:entryAdded#2

Authored path: `Edit.AddEntry`.
- Covered by [Edit](../design/compositions/Edit.md), line 3.
- Covered by [Edit](../design/compositions/Edit.md), line 6.

```reaction
when Naming.uniquify (context: gameCode, suffix: lookup, key: entry), asked by Edit.AddEntry:entryAdded
then
  Cataloging.addEntry (catalog: "abils", entry)
```

### Edit.AddEntry:entryAdded#3

Authored path: `Edit.AddEntry`.
- Covered by [Edit](../design/compositions/Edit.md), line 3.
- Covered by [Edit](../design/compositions/Edit.md), line 6.

```reaction
when Cataloging.addEntry (catalog: "abils", entry), asked by Edit.AddEntry:entryAdded#2
where
  earlier, Naming.uniquify (context: gameCode, suffix: lookup, key: entry), asked by Edit.AddEntry:entryAdded
then
  Inventorying.add (item: entry, owner: gameCode)
```

### Edit.AddEntry:entryAdded#4

Authored path: `Edit.AddEntry`.
- Covered by [Edit](../design/compositions/Edit.md), line 3.
- Covered by [Edit](../design/compositions/Edit.md), line 6.

```reaction
when Inventorying.add (item: entry, owner: gameCode), asked by Edit.AddEntry:entryAdded#3
where
  earlier, Naming.uniquify (context: gameCode, suffix: lookup, key: entry), asked by Edit.AddEntry:entryAdded
  earlier, RequestBoundary.request (gameCode, lookup, path: "/edit/add-entry", requestId)
then
  RequestBoundary.respond (gameCode, lookup, requestId)
```

### Edit.AddEntry:refused

Authored path: `Edit.AddEntry`.
- Covered by [Edit](../design/compositions/Edit.md), line 3.
- Covered by [Edit](../design/compositions/Edit.md), line 6.

```reaction
when RequestBoundary.request (gameCode, lookup, path: "/edit/add-entry", requestId)
where
  Naming._getKey (context: gameCode, suffix: lookup)
then
  RequestBoundary.respond (error: "ALREADY_EXISTS", requestId)
```

### Edit.UpdateEntry:entryUpdated

Authored path: `Edit.UpdateEntry`.
- Covered by [Edit](../design/compositions/Edit.md), line 9.
- Covered by [Edit](../design/compositions/Edit.md), line 12.

```reaction
when RequestBoundary.request (feature, gameCode, lookup, path: "/edit/update-entry", requestId, value)
where
  Naming._getKey (context: gameCode, suffix: lookup) has (key: entry)
  Inventorying._owns (item: entry, owner: gameCode) has (owns: true)
then
  Cataloging.update (catalog: "abils", entry, feature, value)
```

### Edit.UpdateEntry:entryUpdated#2

Authored path: `Edit.UpdateEntry`.
- Covered by [Edit](../design/compositions/Edit.md), line 9.
- Covered by [Edit](../design/compositions/Edit.md), line 12.

```reaction
when Cataloging.update (catalog: "abils", entry, feature, value), asked by Edit.UpdateEntry:entryUpdated
where
  earlier, RequestBoundary.request (feature, gameCode, lookup, path: "/edit/update-entry", requestId, value)
then
  RequestBoundary.respond (entry, requestId)
```

### Edit.UpdateEntry:refused

Authored path: `Edit.UpdateEntry`.
- Covered by [Edit](../design/compositions/Edit.md), line 9.
- Covered by [Edit](../design/compositions/Edit.md), line 12.

```reaction
when RequestBoundary.request (feature, gameCode, lookup, path: "/edit/update-entry", requestId, value)
where
  Naming._getKey (context: gameCode, suffix: lookup) has (key: null)
then
  RequestBoundary.respond (error: "DOES_NOT_EXIST", requestId)
```

### Edit.UpdateName:gameNameUpdated

Authored path: `Edit.UpdateName`.
- Covered by [Edit](../design/compositions/Edit.md), line 15.
- Covered by [Edit](../design/compositions/Edit.md), line 18.

```reaction
when RequestBoundary.request (gameCode, gameName, path: "/edit/update-name", requestId)
where
  Joining._isContext (id: gameCode) has (isContext: true)
then
  Joining.updateName (id: gameCode, name: gameName)
```

### Edit.UpdateName:gameNameUpdated#2

Authored path: `Edit.UpdateName`.
- Covered by [Edit](../design/compositions/Edit.md), line 15.
- Covered by [Edit](../design/compositions/Edit.md), line 18.

```reaction
when Joining.updateName (id: gameCode, name: gameName), asked by Edit.UpdateName:gameNameUpdated
where
  earlier, RequestBoundary.request (gameCode, gameName, path: "/edit/update-name", requestId)
then
  RequestBoundary.respond (gameName, requestId)
```

### Edit.UpdateName:refused

Authored path: `Edit.UpdateName`.
- Covered by [Edit](../design/compositions/Edit.md), line 15.
- Covered by [Edit](../design/compositions/Edit.md), line 18.

```reaction
when RequestBoundary.request (gameCode, gameName, path: "/edit/update-name", requestId)
where
  Joining._isContext (id: gameCode) has (isContext: false)
then
  RequestBoundary.respond (error: "NO_SUCH_CONTEXT", requestId)
```

### Portal.Create:gameCode

Authored path: `Portal.Create`.
- Covered by [Portal](../design/compositions/Portal.md), line 16.
- Covered by [Portal](../design/compositions/Portal.md), line 19.

```reaction
when RequestBoundary.request (gameCode, gameName, path: "/portal/create-game", requestId)
where
  Joining._isContext (id: gameCode) has (isContext: false)
then
  Joining.create (id: gameCode, name: gameName)
```

### Portal.Create:gameCode#2

Authored path: `Portal.Create`.
- Covered by [Portal](../design/compositions/Portal.md), line 16.
- Covered by [Portal](../design/compositions/Portal.md), line 19.

```reaction
when Joining.create (id: gameCode, name: gameName), asked by Portal.Create:gameCode
then
  Inventorying.make (owner: gameCode)
```

### Portal.Create:gameCode#3

Authored path: `Portal.Create`.
- Covered by [Portal](../design/compositions/Portal.md), line 16.
- Covered by [Portal](../design/compositions/Portal.md), line 19.

```reaction
when Inventorying.make (owner: gameCode), asked by Portal.Create:gameCode#2
where
  earlier, RequestBoundary.request (gameCode, gameName, path: "/portal/create-game", requestId)
then
  RequestBoundary.respond (gameCode, requestId)
```

### Portal.Create:refused

Authored path: `Portal.Create`.
- Covered by [Portal](../design/compositions/Portal.md), line 16.
- Covered by [Portal](../design/compositions/Portal.md), line 19.

```reaction
when RequestBoundary.request (gameCode, gameName, path: "/portal/create-game", requestId)
where
  Joining._isContext (id: gameCode) has (isContext: true)
then
  RequestBoundary.respond (error: "DUPLICATE_CONTEXT", requestId)
```

### Portal.Join:gameNotFound

Authored path: `Portal.Join`.
- Covered by [Portal](../design/compositions/Portal.md), line 9.
- Covered by [Portal](../design/compositions/Portal.md), line 12.

```reaction
when RequestBoundary.request (gameCode, path: "/portal/open-bag", playerName, requestId)
where
  Joining._isContext (id: gameCode) has (isContext: false)
then
  RequestBoundary.respond (error: "NO_SUCH_CONTEXT", requestId)
```

### Portal.Join:openedBag

Authored path: `Portal.Join`.
- Covered by [Portal](../design/compositions/Portal.md), line 9.
- Covered by [Portal](../design/compositions/Portal.md), line 12.

```reaction
when RequestBoundary.request (gameCode, path: "/portal/open-bag", playerName, requestId)
where
  Joining._isContext (id: gameCode) has (isContext: true)
  Joining._isMember (id: gameCode, member: playerName) has (isMember: false)
then
  Joining.join (id: gameCode, member: playerName)
```

### Portal.Join:openedBag#2

Authored path: `Portal.Join`.
- Covered by [Portal](../design/compositions/Portal.md), line 9.
- Covered by [Portal](../design/compositions/Portal.md), line 12.

```reaction
when Joining.join (id: gameCode, member: playerName), asked by Portal.Join:openedBag
then
  Naming.uniquify (context: gameCode, suffix: playerName)
```

### Portal.Join:openedBag#3

Authored path: `Portal.Join`.
- Covered by [Portal](../design/compositions/Portal.md), line 9.
- Covered by [Portal](../design/compositions/Portal.md), line 12.

```reaction
when Naming.uniquify (context: gameCode, suffix: playerName, key: pid), asked by Portal.Join:openedBag#2
then
  Inventorying.make (owner: pid)
```

### Portal.Join:openedBag#4

Authored path: `Portal.Join`.
- Covered by [Portal](../design/compositions/Portal.md), line 9.
- Covered by [Portal](../design/compositions/Portal.md), line 12.

```reaction
when Inventorying.make (owner: pid), asked by Portal.Join:openedBag#3
where
  earlier, Joining.join (id: gameCode, member: playerName), asked by Portal.Join:openedBag
  earlier, RequestBoundary.request (gameCode, path: "/portal/open-bag", playerName, requestId)
then
  RequestBoundary.respond (gameCode, playerName, requestId)
```

### Portal.Join:playerAlreadyExists

Authored path: `Portal.Join`.
- Covered by [Portal](../design/compositions/Portal.md), line 9.
- Covered by [Portal](../design/compositions/Portal.md), line 12.

```reaction
when RequestBoundary.request (gameCode, path: "/portal/open-bag", playerName, requestId)
where
  Joining._isMember (id: gameCode, member: playerName) has (isMember: true)
then
  RequestBoundary.respond (error: "DUPLICATE_MEMBER", requestId)
```

### Portal.Name

Authored path: `Portal.Name`.
- Covered by [Portal](../design/compositions/Portal.md), line 23.
- Covered by [Portal](../design/compositions/Portal.md), line 26.

```reaction
when RequestBoundary.request (gameCode, path: "/portal/name", requestId)
where
  Joining._getName (id: gameCode) has (name: gameName)
then
  RequestBoundary.respond (gameName, requestId)
```

### Portal.Rejoin:gameNotFound

Authored path: `Portal.Rejoin`.
- Covered by [Portal](../design/compositions/Portal.md), line 9.
- Covered by [Portal](../design/compositions/Portal.md), line 13.

```reaction
when RequestBoundary.request (gameCode, path: "/portal/reopen-bag", playerName, requestId)
where
  Joining._isContext (id: gameCode) has (isContext: false)
then
  RequestBoundary.respond (error: "NO_SUCH_CONTEXT", requestId)
```

### Portal.Rejoin:playerNotFound

Authored path: `Portal.Rejoin`.
- Covered by [Portal](../design/compositions/Portal.md), line 9.
- Covered by [Portal](../design/compositions/Portal.md), line 13.

```reaction
when RequestBoundary.request (gameCode, path: "/portal/reopen-bag", playerName, requestId)
where
  Joining._isMember (id: gameCode, member: playerName) has (isMember: false)
then
  RequestBoundary.respond (error: "DOES_NOT_EXIST", requestId)
```

### Portal.Rejoin:reopenBag

Authored path: `Portal.Rejoin`.
- Covered by [Portal](../design/compositions/Portal.md), line 9.
- Covered by [Portal](../design/compositions/Portal.md), line 13.

```reaction
when RequestBoundary.request (gameCode, path: "/portal/reopen-bag", playerName, requestId)
where
  Joining._isContext (id: gameCode) has (isContext: true)
  Joining._isMember (id: gameCode, member: playerName) has (isMember: true)
then
  RequestBoundary.respond (gameCode, playerName, requestId)
```

### Portal.Reopen:gameCode

Authored path: `Portal.Reopen`.
- Covered by [Portal](../design/compositions/Portal.md), line 16.
- Covered by [Portal](../design/compositions/Portal.md), line 20.

```reaction
when RequestBoundary.request (gameCode, path: "/portal/reopen-game", requestId)
where
  Joining._isContext (id: gameCode) has (isContext: true)
then
  RequestBoundary.respond (gameCode, requestId)
```

### Portal.Reopen:refused

Authored path: `Portal.Reopen`.
- Covered by [Portal](../design/compositions/Portal.md), line 16.
- Covered by [Portal](../design/compositions/Portal.md), line 20.

```reaction
when RequestBoundary.request (gameCode, path: "/portal/reopen-game", requestId)
where
  Joining._isContext (id: gameCode) has (isContext: false)
then
  RequestBoundary.respond (error: "NO_SUCH_CONTEXT", requestId)
```

### Portal.Start:abilsAdded

Authored path: `Portal.Start`.
- Covered by [Portal](../design/compositions/Portal.md), line 3.
- Covered by [Portal](../design/compositions/Portal.md), line 6.

```reaction
when RequestBoundary.request (path: "/portal/start", requestId)
where
  Cataloging._isCatalog (name: "abils") has (isCatalog: false)
then
  Cataloging.catalog (default_: "", features: ["MYlookup", "MYname", "MYtext", "MYeffect"], name: "abils")
```

### Portal.Start:abilsAdded#2

Authored path: `Portal.Start`.
- Covered by [Portal](../design/compositions/Portal.md), line 3.
- Covered by [Portal](../design/compositions/Portal.md), line 6.

```reaction
when Cataloging.catalog (default_: "", features: ["MYlookup", "MYname", "MYtext", "MYeffect"], name: "abils", catalog: "abils"), asked by Portal.Start:abilsAdded
where
  earlier, RequestBoundary.request (path: "/portal/start", requestId)
then
  RequestBoundary.respond (requestId)
```

### Portal.Start:abilsVerified

Authored path: `Portal.Start`.
- Covered by [Portal](../design/compositions/Portal.md), line 3.
- Covered by [Portal](../design/compositions/Portal.md), line 6.

```reaction
when RequestBoundary.request (path: "/portal/start", requestId)
where
  Cataloging._isCatalog (name: "abils") has (isCatalog: true)
then
  RequestBoundary.respond (requestId)
```

## Endpoint input contracts

Before recording an action ask, the boundary rejects a body that is not an
object or lacks a required key. The response uses `INVALID_INPUT` and names
the path or missing key. A declared default fills an absent key. Endpoints
not listed here have no explicit input contract.

- `/collect/admin` — requires `gameCode`
- `/collect/print` — requires `gameCode`, `playerName`, `lookup`
- `/collect/production` — requires `gameCode`, `playerName`
- `/edit/add-entry` — requires `gameCode`, `lookup`
- `/edit/update-entry` — requires `gameCode`, `lookup`, `feature`, `value`
- `/edit/update-name` — requires `gameCode`, `gameName`
- `/portal/create-game` — requires `gameCode`, `gameName`
- `/portal/name` — requires `gameCode`
- `/portal/open-bag` — requires `gameCode`, `playerName`
- `/portal/reopen-bag` — requires `gameCode`, `playerName`
- `/portal/reopen-game` — requires `gameCode`
