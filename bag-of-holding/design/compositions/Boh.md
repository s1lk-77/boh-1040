# Boh

Anyone with a valid gamecode can pick a name and [open a Bag of Holding](reaction:Boh.Open). If they already have a Bag, they can [reopen it](reaction:Boh.Reopen).

```endpoints
Boh.OpenBag at /player/open
Boh.ReopenBag at /player/reopen
```

Anyone can set up Bag of Holding support for their Guild game by [creating a game](reaction:Boh.CreateGame) or [reopening a game](reaction:Boh.ReopenGame) they previously created.

```endpoints
Boh.CreateGame at /gm/create
Boh.ReopenGame at /gm/reopen
```

Now, most importantly, a player should be able to enter a code and [lookup an ability](reaction:Boh.Lookup).

```endpoints
Boh.Lookup at /player/lookup
```

And correspondingly, a GM should be able to [add an ability](reaction:Boh.AddEntry) with a lookup code.

```endpoints
Boh.AddEntry at /gm/upload
```
