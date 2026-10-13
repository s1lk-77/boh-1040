# Application types

GMs give names to their games, and players give themselves names. GMs also give abilities lookup codes.

```types
concrete GameCode
    The game code a GM types in when creating a game.

concrete Name
    The name a player types in when creating a bag for themself or a lookup code.
```

```instances
instantiate Naming with
    Context is GameCode
    Suffix is Name

instantiate Joining with
    Identifier is GameCode
    Member is Name
```
