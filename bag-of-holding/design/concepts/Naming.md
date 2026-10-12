# Naming

## Purpose

Allocates a globally unique identifier to individuals across a set of contexts; prevents not being able to distinguish between two identical names in different contexts.

## Principle

User provides a context and a suffix and obtains a unqiue identifier which identifies the tupled pair. User can retrieve the individual context and suffix by providing the unique identifier, and vice versa.

## Types

```types
external Context
  The context in which the suffix exists.

external Suffix
  The suffix that identifies something within a context.
```

## State

```state
a set of Keys with
    a Context
    a Suffix
```

## Actions

```actions
uniquify(context: Context, suffix: Suffix) : returns (key: Key)
    where key with context and suffix already exists
    then
        refuses ALREADY_EXISTS "Key already exists."
    where key with context and suffix does not exist
    then
        add a new key with the given context and suffix
        returns key

delete(context: Context, suffix: Suffix)
    where key with context and suffix exists
    then
        remove key
    where key with context and suffix does not exist
    then
        refuses DOES_NOT_EXIST "Key does not exist"
```

## Queries

```queries
_getKey(context: Context, suffix: Suffix) : (key Key)
    Returns the key with context and suffix, or nothing if key does not exist.

_getValue(key: Key) : (context: Context, suffix: Suffix)
    Returns the suffix and context of this key, or nothing if key does not exist.

```
