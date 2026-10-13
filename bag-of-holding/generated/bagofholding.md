<!-- Generated from the BagOfHolding assembly. Do not edit. -->
<!-- Manifest producer: @mit-sdg/sync-engine@1.1.0; concept specification: sync-engine.concept-specification@1; renderer: @mit-sdg/sync-engine@1.1.0. -->

# BagOfHolding — assembled read-back

_Assembled by sync-engine from registered concepts and composition. Edit the concept_
_specifications and composition source, then regenerate this file._

## Concepts

### Joining

Defined in [Joining](../design/concepts/Joining.md), line 1.

#### Actions

- `create(id: Identifier, name: String) : returns (context: Context)`
  - Refuses `DUPLICATE_CONTEXT`: That id is already in use.
- `join(id: Identifier, member: Member) : returns (member: Member)`
  - Refuses `NO_SUCH_CONTEXT`: The given id is not a context
  - Refuses `DUPLICATE_MEMBER`: Cannot add a member that is already in the context

#### Queries

- `_isContext(id: Identifier) : one (isContext: Flag)`
- `_isMember(id: Identifier, member: Member) : one (isMember: Flag)`
- `_getName(id: Identifier) : one (name: String)`

#### Instances

- `Joining` — instance of `Joining` — [Application types](../design/types.md), line 18.
  - `Identifier` is `GameCode` — [Application types](../design/types.md), line 19.
  - `Member` is `Naming.Key` — [Application types](../design/types.md), line 20.

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

- `Naming` — instance of `Naming` — [Application types](../design/types.md), line 14.
  - `Context` is `GameCode` — [Application types](../design/types.md), line 15.
  - `Suffix` is `Name` — [Application types](../design/types.md), line 16.

## Application types

Concrete types:

- `GameCode` — [Application types](../design/types.md), line 6.
- `Name` — [Application types](../design/types.md), line 9.

## Reactions

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

### Portal.Create:gameCode

Authored path: `Portal.Create`.
- Covered by [Portal](../design/compositions/Portal.md), line 10.
- Covered by [Portal](../design/compositions/Portal.md), line 13.

```reaction
when RequestBoundary.request (gameCode, gameName, path: "/portal/create-game", requestId)
where
  no Joining._isContext (id: gameCode)
then
  Joining.create (id: gameCode, name: gameName)
```

### Portal.Create:gameCode#2

Authored path: `Portal.Create`.
- Covered by [Portal](../design/compositions/Portal.md), line 10.
- Covered by [Portal](../design/compositions/Portal.md), line 13.

```reaction
when Joining.create (id: gameCode, name: gameName), asked by Portal.Create:gameCode
where
  earlier, RequestBoundary.request (gameCode, gameName, path: "/portal/create-game", requestId)
then
  RequestBoundary.respond (gameCode, requestId)
```

### Portal.Create:refused

Authored path: `Portal.Create`.
- Covered by [Portal](../design/compositions/Portal.md), line 10.
- Covered by [Portal](../design/compositions/Portal.md), line 13.

```reaction
when RequestBoundary.request (gameCode, gameName, path: "/portal/create-game", requestId)
where
  Joining._isContext (id: gameCode)
then
  RequestBoundary.respond (error: "DUPLICATE_KEY", requestId)
```

### Portal.Join:gameNotFound

Authored path: `Portal.Join`.
- Covered by [Portal](../design/compositions/Portal.md), line 3.
- Covered by [Portal](../design/compositions/Portal.md), line 6.

```reaction
when RequestBoundary.request (gameCode, path: "/portal/open-bag", playerName, requestId)
then
  RequestBoundary.respond (error: "NO_SUCH_CONTEXT", requestId)
```

### Portal.Join:openBag

Authored path: `Portal.Join`.
- Covered by [Portal](../design/compositions/Portal.md), line 3.
- Covered by [Portal](../design/compositions/Portal.md), line 6.

```reaction
when RequestBoundary.request (gameCode, path: "/portal/open-bag", playerName, requestId)
where
  Joining._isContext (id: gameCode)
  no Naming._getKey (context: gameCode, suffix: playerName)
then
  Naming.uniquify (context: gameCode, suffix: playerName)
```

### Portal.Join:openBag#2

Authored path: `Portal.Join`.
- Covered by [Portal](../design/compositions/Portal.md), line 3.
- Covered by [Portal](../design/compositions/Portal.md), line 6.

```reaction
when Naming.uniquify (context: gameCode, suffix: playerName, key: pid), asked by Portal.Join:openBag
then
  Joining.join (id: gameCode, member: pid)
```

### Portal.Join:openBag#3

Authored path: `Portal.Join`.
- Covered by [Portal](../design/compositions/Portal.md), line 3.
- Covered by [Portal](../design/compositions/Portal.md), line 6.

```reaction
when Joining.join (id: gameCode, member: pid), asked by Portal.Join:openBag#2
where
  earlier, Naming.uniquify (context: gameCode, suffix: playerName, key: pid), asked by Portal.Join:openBag
  earlier, RequestBoundary.request (gameCode, path: "/portal/open-bag", playerName, requestId)
then
  RequestBoundary.respond (gameCode, playerName, requestId)
```

### Portal.Join:playerAlreadyExists

Authored path: `Portal.Join`.
- Covered by [Portal](../design/compositions/Portal.md), line 3.
- Covered by [Portal](../design/compositions/Portal.md), line 6.

```reaction
when RequestBoundary.request (gameCode, path: "/portal/open-bag", playerName, requestId)
then
  RequestBoundary.respond (error: "DUPLICATE_MEMBER", requestId)
```

### Portal.Rejoin:gameNotFound

Authored path: `Portal.Rejoin`.
- Covered by [Portal](../design/compositions/Portal.md), line 3.
- Covered by [Portal](../design/compositions/Portal.md), line 7.

```reaction
when RequestBoundary.request (gameCode, path: "/portal/reopen-bag", playerName, requestId)
where
  no Joining._isContext (id: gameCode)
then
  RequestBoundary.respond (error: "NO_SUCH_CONTEXT", requestId)
```

### Portal.Rejoin:playerNotFound

Authored path: `Portal.Rejoin`.
- Covered by [Portal](../design/compositions/Portal.md), line 3.
- Covered by [Portal](../design/compositions/Portal.md), line 7.

```reaction
when RequestBoundary.request (gameCode, path: "/portal/reopen-bag", playerName, requestId)
where
  no Naming._getKey (context: gameCode, suffix: playerName)
then
  RequestBoundary.respond (error: "DOES_NOT_EXIST", requestId)
```

### Portal.Rejoin:reopenBag

Authored path: `Portal.Rejoin`.
- Covered by [Portal](../design/compositions/Portal.md), line 3.
- Covered by [Portal](../design/compositions/Portal.md), line 7.

```reaction
when RequestBoundary.request (gameCode, path: "/portal/reopen-bag", playerName, requestId)
where
  Joining._isContext (id: gameCode)
  Naming._getKey (context: gameCode, suffix: playerName)
then
  RequestBoundary.respond (gameCode, playerName, requestId)
```

### Portal.Reopen:gameCode

Authored path: `Portal.Reopen`.
- Covered by [Portal](../design/compositions/Portal.md), line 10.
- Covered by [Portal](../design/compositions/Portal.md), line 14.

```reaction
when RequestBoundary.request (gameCode, path: "/portal/reopen-game", requestId)
where
  Joining._isContext (id: gameCode)
then
  RequestBoundary.respond (gameCode, requestId)
```

### Portal.Reopen:refused

Authored path: `Portal.Reopen`.
- Covered by [Portal](../design/compositions/Portal.md), line 10.
- Covered by [Portal](../design/compositions/Portal.md), line 14.

```reaction
when RequestBoundary.request (gameCode, path: "/portal/reopen-game", requestId)
where
  no Joining._isContext (id: gameCode)
then
  RequestBoundary.respond (error: "NO_SUCH_CONTEXT", requestId)
```

## Endpoint input contracts

Before recording an action ask, the boundary rejects a body that is not an
object or lacks a required key. The response uses `INVALID_INPUT` and names
the path or missing key. A declared default fills an absent key. Endpoints
not listed here have no explicit input contract.

- `/portal/create-game` — requires `gameCode`, `gameName`
- `/portal/open-bag` — requires `gameCode`, `playerName`
- `/portal/reopen-bag` — requires `gameCode`, `playerName`
- `/portal/reopen-game` — requires `gameCode`
