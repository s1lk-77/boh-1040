# Concept Design Summary

The **joining** concept binds game codes as its Identifiers and players as its Members. Maybe GMs too, if we eventually decide we care about distinguishing a host, but we do not for the MVP. This concept manages who is part of which game, and also for that matter, which games even exist in the app. This is the entry point of the app, as anything interacting with the rest of the system is either a player (a member of a context) or the context itself (the game as managed by a user who is a GM).

A player has an Inventory of abilities. A game has an Inventory of abilities. The **inventorying** concept binds games AND players as its Owners, and abilities (or lookup entries) as its Items. Because a game/player may only have 1 copy of each ability (i.e. they are not transferable), we are using an inventorying concept that maintains an invariant of 1 copy per item. This concept will certainly change if we, in the future, decide to incorporate items, which are transferable and countable.

The **cataloging** concept, as the name suggests, maintains a catalog of abilities and what they do. That is, it catalogs all the entries who has the features that an ability has. Each entry can be updated and deleted. And new entries can be added. So this concept binds Entries to ability lookup codes and Features to the schema of an ability.
