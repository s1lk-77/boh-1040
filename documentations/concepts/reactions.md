# Reactions

Assume:\
Serializing.define(rule)\
Cataloging.catalog("Abilities", \["name", "serial", "desc", "effect"\])

**reaction** serialize\
**when**\
&emsp;Requesting.open(gameCode, playerName)\
**then**\
&emsp;Serializing.serialize(data: [gameCode, playerName]) : (serial)\

**reaction** lookupSerialize\
**when**\
&emsp;Requesting.lookup(gameCode, playerName, lookup)\
**then**\
&emsp;Serializing.serialize(data: [gameCode, lookup]) : (serial)\
&emsp;Serializing.serialize(data: [gameCode, playerName]) : (serial)\

**reaction** addPlayer\
**when**\
&emsp;Requesting.open(gameCode String)\
&emsp;Serializing.serialize() : (serial)\
**where**\
&emsp;Joining.\_isContext(id: gameCode)\
&emsp;not Joining.\_isMember(id: gameCode, member: serial)\
**then**\
&emsp;Joining.addMember(id: gameCode, member: serial) : (member: serial)\

**reaction** reopen\
**when**\
&emsp;Requesting.open(gameCode String)\
&emsp;Serializing.serialize() : (serial)\
**where**\
&emsp;Joining.\_isContext(id: gameCode)\
&emsp;Joining.\_isMember(id: gameCode, member: serial)\
**then**\
&emsp;Joining.addMember(id: gameCode, member: serial) : (member: serial)\

**reaction** playerInventory\
**when**\
&emsp;Requesting.inventory(gameCode, serial)\
**where**\
&emsp;Joining.\_isMember(id: gameCode, member: serial)
**then**\
&emsp;Inventorying.\_getAll(owner: serial) : (many(item))

**reaction** gameInventory\
**when**\
&emsp;Requesting.inventory(gameCode)\
**where**\
&emsp;Joining.\_isContext(id: gameCode)
**then**\
&emsp;Inventorying.\_getAll(owner: gameCode) : (many(item))

**reaction** retrieve\
**when**\
&emsp;Inventorying.\_getAll() : (many(serial))\
**then**\
&emsp;Cataloging.\_get(catalog: "Abilities", entry: serial) : ( features )

**reaction** lookup\
**when**\
&emsp;Requesting.lookup(gameCode)\
&emsp;Serializing.serialize(playerName) : (playerSerial)\
&emsp;Serializing.serialize(lookup) : (lookupSerial)\
**where**\
&emsp;not Inventorying.\_owns(playerSerial, lookupSerial)\
**then**\
&emsp;Inventorying.add(playerSerial, lookupSerial)\
&emsp;Cataloging.\_get(catalog: "Abilities", entry: serial) : ( features )

**reaction** addEntry\
**when**\
&emsp;Requesting.addEntry(gameCode, features)\
&emsp;Serializing.serialize(lookup) : (lookupSerial)\
**where**\
&emsp;Joining.isContext(id: gameCode)\
&emsp;not Inventorying.\_owns(owner: gameCode, item: lookupSerial)\
**then**\
&emsp;Cataloging.log(catalog: "Abilities", entry: lookupSerial, features)

**reaction** updateEntry\
**when**\
&emsp;Requesting.updateEntry(gameCode, features)\
&emsp;Serializing.serialize(lookup) : (lookupSerial)\
**where**\
&emsp;Joining.isContext(id: gameCode)\
&emsp;Inventorying.\_owns(owner: gameCode, item: lookupSerial)\
**then**\
&emsp;Cataloging.update(catalog: "Abilities", entry: lookupSerial, features)

**reaction** deleteEntry\
**when**\
&emsp;Requesting.deleteEntry(gameCode)\
&emsp;Serializing.serialize(lookup) : (lookupSerial)\
**where**\
&emsp;Joining.isContext(id: gameCode)\
&emsp;Inventorying.\_owns(owner: gameCode, item: lookupSerial)\
**then**\
&emsp;Cataloging.delete(catalog: "Abilities", entry: lookupSerial)

**reaction** createContext\
**when**\
&emsp;Requesting.createGame(gameCode, gameName)\
**where**\
&emsp;not Joining.isContext(identifier: gameCode)\
**then**\
&emsp;Joining.create(id: gameCode, name: gameName)

**reaction** getContext\
**when**\
&emsp;Requesting.reopenGame(gameCode)\
**where**\
&emsp;not Joining.isContext(identifier: gameCode)\
**then**\
&emsp;Joining.\_getName(id: gameCode) : (name)
