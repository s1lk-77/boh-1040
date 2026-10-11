## Inventorying

**concept** Inventorying \[Owner, Item\]\
**purpose** keep track of the things you own; prevents not being able to find the things you own or know what they are\
**principle** Owner makes an inventory. Owner adds things they own to the inventory. Owner can check what's in the inventory

**states**\
a set of Owners\
&emsp;with a set of Items

**actions**

make(owner Owner)\
&emsp;**where** owner does not exist in Owners\
&emsp;**then** create an owner with an empty set of Items

add(owner Owner, item Item)\
&emsp;**where** owner exists in Owners\
&emsp;**then** add item to the Owner's set of Items

delete(owner Owner)\
&emsp;**where** owner exists in Owners\
&emsp;**then** remove owner from Owners

remove(owner Owner, item Item)\
&emsp;**where** Owner exist in Owners\
&emsp;**then** If item is in owner's items, remove item from owner's items

**queries**

\_owns(owner Owner, item Item) : (isOwner Boolean)\
&emsp;**where** owner exists in Owner\
&emsp;**then** checks if owner's items has item

\_getAll(owner Owner) : (many(items Item))
&emsp;**where** owner exists in Owner\
&emsp;**then** return all of owner's items

## Notes

This inventorying concept currently does not support one owner having more than one inventory. We could parameterize the concept off of an additional generic parameter like "Context" to give an owner the ability to have more than one inventory, which may be helpful in different situations.
