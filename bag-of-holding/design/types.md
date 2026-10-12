# Application types

GMs give names to their games, and players give themselves names. GMs also give abilities lookup codes.

```types
concrete GameCode
    The game code a GM types in when creating a game.

concrete PlayerName
    The name a player types in when creating a bag for themself.

concrete Lookup
    The code a GM gives to an ability that the players then use to look it up
```

```instances
instantiate Naming as PlayerNaming with
    Context is GameCode
    Suffix is PlayerName

instantiate Naming as EntryNaming with
    Context is GameCode
    Suffix is Lookup

instantiate Joining with
    Context is string
    Member is Naming.Key
```
