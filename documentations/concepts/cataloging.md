# Cataloging

**Concept:** Cataloging\[Entry, Feature, Value\]\
**Purpose:** Maintain a highly organized record of entries that are attributed the same set of features, allows easy mapping between an entry and its features; prevents not being able to recognize things or not being able to distinguish what features something has\
**Princples:** User creates a catalog and specifies a set of features. User adds Entries with this set of features to the catalog. User can search through the catalog by entry or for entries with a specific feature.

**States**\
A set of Catalogs with\
&emsp;A name String\
&emsp;A set of features Features\
&emsp;A set of Entries

A set of Entries with\
&emsp;A set of Bindings

A set of Bindings with\
&emsp;A Feature\
&emsp;A Value\

**Queries**\
\_get(catalog Catalog, entry Entry) : (entry Entry, {feature Feature, value Value}[])\ // TODO
&emsp;**where** entry exists in catalog\
&emsp;**then** return the entry and its bindings as an object of feature-value pairs

\_exists(catalog Catalog, entry Entry) : (Boolean)\
&emsp;**where** entry exists in catalog\
&emsp;**then** return true\
&emsp;**where** entry does not exist in catalog\
&emsp;**then** return false

**Actions**\
catalog(name String, features Features) : (catalog Catalog)\
&emsp;**where** name does not exist in Catalogs\
&emsp;**then** create a Catalog with that name and the given set of features with no entries

log(catalog Catalog, entry Entry, bindings {feature: Feature, value: Value}[]) : (entry Entry)\
&emsp;**where** entry does not exist in catalog and the features in bindings match this catalog's features\
&emsp;**then** create a Binding for each object in bindings and associate them with this entry. Add this entry to the catalog

update(catalog Catalog, entry Entry, feature Feature, value Value) : (entry Entry)\
&emsp;**where** entry exists in catalog and the feature is in this catalog's features\
&emsp;**then** find this Entry's binding for this feature and replace its value with value

delete(catalog Catalog, entry Entry)\
&emsp;**where** entry exists in catalog\
&emsp;**then** delete this entry

deleteCatalog(catalog Catalog)\
&emsp;**where** catalog exists in Catalogs\
&emsp;**then** delete this catalog
