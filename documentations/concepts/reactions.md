# Reactions

### Preface

Assume:\
Cataloging.catalog("Abilities", \["name", "serial", "desc", "effect"\])

In general, all requests containing a `playerName` or a `lookup` call the **Naming** concept with their `gameCode` before they are fed into other operations. Similarly, all responses containing a uniquified id call **Naming** to retrieve the (context, suffix) pair right before returning a suffix to the frontend. Furthermore, as the Bag of Holding MVP only aims to support digitally storing Abilities, we can pre-initialize the standard Assassins' Guild ability card features into a catalog that we can then use universally in this application. We will assume all `cataloging` concept calls use the "Abilities" catalog as defined above.

---

### Naming concept reactions

**reaction** uniquifyPlayer\
**when**\
&emsp;Requesting.open(gameCode, playerName)\
**where**\
&emsp;Joining.\_isContext(id: gameCode)\
**then**\
&emsp;Naming.uniquify(gameCode, playerName) : (item)

**reaction** uniquifyEntry\
**when**\
&emsp;Requesting.addEntry(gameCode, lookup)\
**where**\
&emsp;Joining.\_isContext(id: gameCode)\
**then**\
&emsp;Naming.uniquify(gameCode, lookup) : (item)

---

**reaction** addPlayer\
**when**\
&emsp;Requesting.open(gameCode, playerName)\
&emsp;Naming.uniquify(gameCode, playerName) : (item: member)\
**where**\
&emsp;not Joining.\_isMember(id: gameCode, member)\
**then**\
&emsp;Joining.join(id: gameCode, member)\
&emsp;Joining.getMember(id: gameCode, member)\

**reaction** reopen\
**when**\
&emsp;Requesting.reopen(gameCode, playerName)\
&emsp;Naming.\_getKey(gameCode, playerName) : (item member)\
**where**\
&emsp;Joining.\_isContext(id: gameCode)\
&emsp;Joining.\_isMember(id: gameCode, member)\
**then**\
&emsp;Joining.\_getMember(id: gameCode, member) : (member)

**reaction** playerInventory\
**when**\
&emsp;Joining.\_getMember(): (member: owner)\
**then**\
&emsp;Inventorying.\_getAll(owner) : (many(item))

**reaction** retrieve\
**when**\
&emsp;Inventorying.\_getAll() : (many(item: entry))\
**then**\
&emsp;Cataloging.\_get(catalog: "Abilities", entry) : ( {feature, value}[] )

**reaction** lookup\
**when**\
&emsp;Requesting.lookup(gameCode, playerName, lookup)\
**where**\
&emsp;Naming.\_getKey(gameCode, playerName) : (playerKey)\
&emsp;Naming.\_getKey(gameCode, lookup) : (lookupKey)\
&emsp;not Inventorying.\_owns(playerKey, lookupKey)\
&emsp;Cataloging.\_exists("Abilities", lookupKey)\
**then**\
&emsp;Inventorying.add(playerKey, lookupKey)\
&emsp;Cataloging.\_get(catalog: "Abilities", entry: lookupKey) : ( {feature, value}[] )

**reaction** addEntry\
**when**\
&emsp;Requesting.addEntry(gameCode, {feature, value}[])\
**where**\
&emsp;Naming.\_getKey(gameCode, lookup) : (lookupKey)\
&emsp;not Inventorying.\_owns(owner: gameCode, item: lookupKey)\
**then**\
&emsp;Cataloging.log(catalog: "Abilities", entry: lookupKey, features, bindings: {feature, value}[])

**reaction** updateEntry\
**when**\
&emsp;Requesting.updateEntry(gameCode, lookup, feature, value)\
**where**\
&emsp;Naming.\_getKey(gameCode, lookup) : (lookupKey)\
&emsp;Inventorying.\_owns(owner: gameCode, item: lookupKey)\
**then**\
&emsp;Cataloging.update(catalog: "Abilities", entry: lookupKey, feature, value)

**reaction** deleteEntry\
**when**\
&emsp;Requesting.deleteEntry(gameCode, lookup)\
**where**\
&emsp;Naming.\_getKey(gameCode, lookup) : (item: lookupKey)\
&emsp;Inventorying.\_owns(owner: gameCode, item: lookupKey)\
**then**\
&emsp;Cataloging.delete(catalog: "Abilities", entry: lookupKey)

**reaction** createContext\
**when**\
&emsp;Requesting.createGame(gameCode, gameName)\
**where**\
&emsp;not Joining.isContext(id: gameCode)\
**then**\
&emsp;Joining.create(id: gameCode, name: gameName)\
&emsp;Inventorying.\_getAll(owner: gameCode) : (many(item))

**reaction** getContext\
**when**\
&emsp;Requesting.reopenGame(gameCode)\
**where**\
&emsp;Joining.isContext(id: gameCode)\
**then**\
&emsp;Joining.\_getName(id: gameCode) : (name)\
&emsp;Inventorying.\_getAll(owner: gameCode) : (many(item))
