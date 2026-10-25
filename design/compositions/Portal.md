# Portal

At the start of the app, [add a catalog named abils if it is not there](reaction:Portal.Start)

```endpoints
Portal.Start at /portal/start
```

The frontend should be able to [verify if a gamecode is already in use](reaction:Portal.Validate)

```endpoints
Portal.Validate at /portal/validate
```

Anyone with a valid gamecode can pick a name and [open a Bag of Holding](reaction:Portal.Join). If they already have a Bag, they can [reopen it](reaction:Portal.Rejoin).

```endpoints
Portal.Join at /portal/open-bag
Portal.Rejoin at /portal/reopen-bag
```

Anyone can set up Bag of Holding support for their Guild game by [creating a game](reaction:Portal.Create) or [reopening a game](reaction:Portal.Reopen) they previously created.

```endpoints
Portal.Create at /portal/create-game
Portal.Reopen at /portal/reopen-game
```

Anyone with a valid gamecode can [get the name of the game](reaction:Portal.Name)

```endpoints
Portal.Name at /portal/name
```
