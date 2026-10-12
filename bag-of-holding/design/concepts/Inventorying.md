# Inventorying

## Purpose

keep track of the things you own; prevents not being able to find the things you own or know what they are.

## Principle

Owner makes an inventory. Owner adds things to and removes things from the inventory. Owner can check if they own a particular item and what's in the inventory.

## Types

```types
external Owner
  The individual that owns the inventory.

external Item
  An item owned by an owner.
```

## State

```state
a set of Owners with
    a set of Items
```

## Actions

```actions
make(owner: Owner)
    where owner does not exist
    then
        add a new owner with an no items
    where owner already exists
    then
        refuses ALREADY_EXISTS "Owner already exists"

add(owner: Owner, item: Item)
    where owner does not exist
    then
        refuses DOES_NOT_EXIST "Owner does not exist"
    where owner exists and does not have item
    then
        add item to owner
    where owner exists and has item
    then
        refuses ALREADY_EXISTS "Owner already owns item"

remove(owner: Owner, item: Item)
    where owner does not exist
    then
        refuses DOES_NOT_EXIST "Owner does not exist"
    where owner exists and has item
    then
        remove item from owner
    where owner exists and does not have item
    then
        refuses DOES_NOT_EXIST "Owner does not own item"

delete(owner: Owner)
    where owner does not exist
    then
        refuses DOES_NOT_EXIST "Owner does not exist"
    where owner exists
    then
        remove owner
```

## Queries

```queries
_owns(owner: Owner, item: Item) : (isOwner Boolean)
    Returns true if owner exists and owns item, false otherwise

_getAll(owner: Owner) : many (items: Item)
    Returns all items owned by owner, or no items if owner does not exist
```
