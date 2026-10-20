# Naming

**Concept**: Naming\[Context, Suffix\]\
**Purpose**: Allocates a globally unique identifier to individuals across a set of contexts; prevents not being able to distinguish between two identical names in different contexts\
**Principle**: User provides a context and a suffix and obtains a unqiue identifier which identifies the tupled pair. User can also retrieve the individual context and suffix by providing the unique identifier.

**States**\
A set of Keys with\
&emsp;A context Context\
&emsp;A suffix Suffix

**Queries**\
\_getKey(context Context, suffix Suffix) : (key Key)\
&emsp;an key exists with this context and this suffix as a pair\
&emsp;**then** return the key

\_getValue(key Key) : (context Context, suffix Suffix)\
&emsp;this key exists\
&emsp;**then** return its context and the suffix

**Actions**\
uniquify(context Context, suffix Suffix) : (key Key)\
&emsp;**where** no key exists with this context and this suffix as a pair\
&emsp;**then** create an key with this context and suffix and add it to keys

delete(key Key) : (key Key)\
&emsp;**where** key exists with this context and this suffix as a pair\
&emsp;**then** delete this key and return it
