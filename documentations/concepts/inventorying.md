## Inventorying

A player has an Inventory of abilities.

**concept** Inventorying \[Owner, Item\]\
**purpose** keep track of the things you own; prevents not being able to find the things you own or know what they are\
**principle** Owner makes an inventory. Owner adds things they own to the inventory. Owner can check what's in the inventory

**states**\
a set of Owners\
&emsp;with a list of Items

**actions**

make(owner: Owner)\
&emsp;**where** owner does not exist in Owners\
&emsp;**then** create an owner with an empty list of Items

add(owner: Owner, item: Item)\
&emsp;**where** owner exists in Owners\
&emsp;**then** add item to the Owner's list of Items

delete(owner: Owner)\
&emsp;**where** owner exists in Owners\
&emsp;**then** remove owner from Owners

remove(owner: Owner, item Item)\
&emsp;**where** Owner exist is Owners\
&emsp;**then** If there is at least one of item in owner's items, remove one item from owner's items

**queries**

\_check(owner: Owner, item: Item) (isOwner Boolean)\
&emsp;**where** owner exists in Owner\
&emsp;**then** checks if owner's items has at least one of item
