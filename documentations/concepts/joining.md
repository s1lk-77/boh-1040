# Joining

**Concept**: Joining\[Identifier, Member\]
**purpose** Provides an entity the agency to partake in a congregation or convention for some shared purpose; prevents not being able to participate and not being able to congregate\
**principles** A host defines a shared context. Others with references to or knowledge of the context opts in to (and opts out of) being part of the shared context.

**States**\
A set of Contexts with:\
&emsp;an identifier Identifier
&emsp;a name String
&emsp;a set of Members
&emsp;(maybe) a host Member

**Queries**
\_isContext(id Identifier) : (boolean)\
&emsp; **where** a context with id exists in Contexts\
&emsp; **then** return true

\_isMember(id Identifier, member Member) : (member Member)\
&emsp; **where** context with id exists and member in context\
&emsp; **then** return member

**Actions**\
create(id Identifier, name String) : (context Context)\
&emsp; **where** context with id does not exist
&emsp; create a new Context with the given id and name, and no Member. Return it.

join(id Identifier, member Member) : (Member)\
&emsp; **where** context exists and Member does not in context\
&emsp; **then** add member to context

### Note

We leave Identifier as a generic parameter because it could be a string, a number, or anything
