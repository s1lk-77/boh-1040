# Serializing

**Concept**: Serializing\[Data, Rule\]\
**Purpose**: Packages separate pieces of related data into one string; prevents having to deliver things that should be sent together in many separate trips\
**Principle**: User creates a serialization context with specific rules for serializing data in a specified form. User feeds data of this form to the serializer context and is returned serialized data. User feeds serialized data into the serializer and is returned deserialized data.

**States**
A set of Contexts with:\
&emsp;A serialization Rule

**Actions**
define(rule Rule) : (context Context)\
&emsp;**then** create a context that serializes data of this format per the rule given and return it

serialize(context Context, data Data) : (serial String)\
&emsp;**then** serialize the data collection based on the specified rule, and return the serial

deserialize(context Context, serial String) : (data Data)\
&emsp;**then** deserialize the string based on reversing the specified rule, and return the data
