# Cataloging

**Concept:** Cataloging\[Entry, Feature\]\
**Purpose:** Maintain a highly organized, structured record of a list of entries that are attributed the same set of features, allows easy mapping between an entry and its feature; prevents not being able to index entries by the functionality of their features. (e.g. a dictionary would be maintaining a catalog of words by their "definition" feature)
**Princples:** User creates a catalog for a specified feature or set of feature. User adds Entries to the catalog with features specified for each entry. User can search through catalog by entry or for entries with a specific feature.

**States**\
A set of Catalogs with:\
&emsp;A name String\
&emsp;A set of features Features\
&emsp;A set of Entries

A set of Entries with:\
&emsp;A set of features Features

**Actions**
catalog(name String, features Feature[]) : (catalog Catalog)\
&emsp;**where** name does not exist in catalog\
&emsp;**then** create a Catalog with that name and that set of features

log(entry Entry, features Feature[], catalog Catalog) : (entry Entry)\
&emsp;**where** entry does not exist in catalog and the features in features match this catalog's features\
&emsp;**then** add entry to Catalog

update(entry Entry, features Feature[], catalog Catalog)\
&emsp;**where** entry exists in catalog and the features in features match this catalog's features\
&emsp;**then** update the catalog's entry to this entry

detele(entry Entry, features Feature[], catalog Catalog)\
&emsp;**where** entry exists in catalog and the features in features match this catalog's features\
&emsp;**then** delete this entry from this catalog

deleteCatalog(catalog Catalog)\
&emsp;**where** catalog exists in Catalogs\
&emsp;**then** delete this catalog
