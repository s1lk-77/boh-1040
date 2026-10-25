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
make(owner: Owner) : returns (owner: Owner)
    where owner does not exist
    then
        add a new owner with an no items
        returns owner
    where owner already exists
    then
        refuses BAD_INVENTORY_OP "Owner already exists"

add(owner: Owner, item: Item) : returns (item: Item)
    where owner exists and does not have item
    then
        add item to owner
        returns item
    where owner does not exist or owner has this item
    then
        refuses BAD_INVENTORY_OP "Owner already owns item"

remove(owner: Owner, item: Item) : returns (item: Item)
    where owner exists and has item
    then
        remove item from owner
        returns item
    where owner does not exist or owner exists and does not have item
    then
        refuses BAD_INVENTORY_OP "Owner does not own item"

delete(owner: Owner) : returns (owner: Owner)
    where owner does not exist
    then
        refuses BAD_INVENTORY_OP "Owner does not exist"
    where owner exists
    then
        remove owner
        returns owner
```

## Queries

```queries
_owns(owner: Owner, item: Item) : one (owns: Flag)
    Returns true if owner exists and owns item, false otherwise

_getAll(owner: Owner) : many (item: Item)
    Returns all items owned by owner, or no items if owner does not exist
```
