# Naming

**Concept**: Naming\[Context, Suffix\]\
**Purpose**: Allocates a globally unique identifier to individuals across a set of contexts; prevents not being able to distinguish between two identical names in different contexts\
**Principle**: User provides a context and a suffix and obtains a unqiue identifier which identifies the tupled pair. User can also retrieve the individual context and suffix by providing the unique identifier.

**States**\
A set of Items with\
&emsp;A context Context\
&emsp;A suffix Suffix

**Queries**\
\_getKey(context Context, suffix Suffix) : (item Item)\
&emsp;an Item exists with this context and this suffix as a pair\
&emsp;**then** return the item

\_getValue(item Item) : (context Context, suffix Suffix)\
&emsp;this item exists\
&emsp;**then** return its context and the suffix

**Actions**\
uniquify(context Context, suffix Suffix) : (item Item)\
&emsp;**where** no Item exists with this context and this suffix as a pair\
&emsp;**then** create an Item with this context and suffix and add it to items

delete(context Context, suffix Suffix) : (item Item)\
&emsp;**where** Item exists with this context and this suffix as a pair\
&emsp;**then** delete this item
