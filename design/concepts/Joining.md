# Joining

## Purpose

Provides an entity with the agency to partake in a congregation or convention for some shared purpose; prevents not being able to participate and not being able to congregate.

## Principle

A host defines a shared context and gives it an identifier. Others with references to or knowledge of the context opts in to (and opts out of) being part of the shared context.

## Types

```types
external Identifier
  The serial or ID for a joinable context, such as a game code.

external Member
  The individual joining the joinable context, such as a player.
```

## State

```state
a set of Contexts with
    a unique Identifier
    a name String
    a set of Members
```

## Actions

```actions
create(id: Identifier, name: String) : returns (context: Context)
    where context with id already exists
    then
        refuses DUPLICATE_CONTEXT "That id is already in use."
    where context with id does not exist
    then
        add a new context with the given id and name, and no Members
        returns context

join(id: Identifier, member: Member) : returns (member: Member)
    where context with id does not exist
    then
        refuses NO_SUCH_CONTEXT "The given id is not a context"
    where context with id exists and has member
    then
        refuses DUPLICATE_MEMBER "Cannot add a member that is already in the context"
    where context with id exists and has member
    then
        adds member to the context with id
        returns member

updateName(id: Identifier, name: String) : returns (name: String)
    where context with id exists
    then
        updates the context's name to name
        returns name
    where context does not exist
    then
        refuses NO_SUCH_CONTEXT "no such context."

remove(id: Identifier, member: String) : returns (member: String)
    where context with id exists and member is a member
    then
        removes member from context
        returns member
    where context does not exist or member is not member
    then
        refuses NO_SUCH_CONTEXT "no such context."
```

## Queries

```queries
_isContext(id: Identifier) : one (isContext: Flag)
    Returns true if a context with this id exists

_isMember(id: Identifier, member: Member) : one (isMember: Flag)
    Returns true if a context with this id exists and the context has this member

_getName(id: Identifier) : one (name: String)
    Returns the name of the context with this id, or nothing if no context with this id exists

_getAll(id: Identifier) : many (member: String)
    Returns all members of the context, or nothig if no context with this id exists
```
