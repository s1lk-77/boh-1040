# Collect

Most importantly, a player should be able to enter a code and [collect an ability](reaction:Collect.Print).

```endpoints
Collect.Print at /collect/print
```

Player should be able to [see all the abils they own](reaction:Collect.Production)

```endpoints
Collect.Production at /collect/production
```

GM should be able to [see all the abils in a game](reaction:Collect.Admin)

```endpoints
Collect.Admin at /collect/admin
```

The [card](former:Collect.Card) collects just one.

The [compendium](former:Collect.Compendium) collects a player or a game's abilities.
