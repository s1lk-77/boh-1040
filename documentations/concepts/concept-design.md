# Concept Design Summary

The **joining** concept binds game codes as its Identifiers and players as its Members. Maybe GMs too, if we eventually decide we care about distinguishing a host, but we do not for the MVP. This concept manages who is part of which game, and also for that matter, which games even exist in the app. This is the entry point of the app, as anything interacting with the rest of the system is either a player (a member of a context) or the context itself (the game as managed by a user who is a GM).
