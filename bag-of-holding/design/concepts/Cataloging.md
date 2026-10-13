# Cataloging

## Purpose

Maintain a highly organized record of entries that are attributed the same set of features, allows easy mapping between an entry and its features; prevents not being able to recognize things or not being able to distinguish what features something has.

## Principle

User creates a catalog and specifies a set of features. User adds Entries with this set of features to the catalog. User can search through the catalog by entry or for entries with a specific feature.

## Types

```types
external Entry
    An entry in a catalog.

external Feature
    A feature shared by all entries in a catalog

external Value
    A particular value for a feature
```

## State

```state
a set of Catalogs with
    a unique name String
    a default Value
    a set of Features
    a set of Entries

a set of Entries with
    a set of Bindings

a set of Bindings with
    a Feature
    a Value
```

## Actions

```actions
catalog(name: String, features: Features, default_: Value) : returns (catalog: Catalog)
    where a catalog with name exists
    then
        refuses BAD_CATALOG_OP "Catalog with this name already exists"
    where a catalog with name does not exist
    then
        add a new catalog with name, the given set of features, the default value, and no entries
        returns catalog

addEntry(catalog: Catalog, entry: Entry) : returns (entry: Entry)
    where catalog exists and entry not in catalog
    then
        add a new entry to this catalog
        add a new binding to the entry with the catalog's default value for each feature in this catalog
        returns entry
    where catalog does not exist or entry in catalog
    then
        refuses BAD_CATALOG_OP "failed to add entry to catalog"

update(catalog: Catalog, entry: Entry, feature: Feature, value: Value) : returns (entry: Entry)
    where catalog exists and entry exists in catalog and feature is in this catalog's features
    then
        for this entry's binding with this feature, replace the binding's value with this value
        returns entry
    where catalog does not exist or entry does not exist in catalog or feature is not in catalog
    then
        refuses BAD_CATALOG_OP "Could not update catalog entry"

delete(catalog: Catalog, entry: Entry) : returns (entry: Entry)
    where catalog exists and entry exists in catalog
    then
        remove this entry
        returns entry
    where catalog does not exist or entry does not exist in catalog
    then
        refuses BAD_CATALOG_OP "Could not delete entry from catalog"
```

## Queries

```queries
_isCatalog(name: String): one (isCatalog: Flag)
    Returns true iff a catalog with this name exists else false

_get(catalog: Catalog, entry: Entry) : many (feature: Feature, value: Value)
    Returns objects of features and values in all bindings of the entry, or no objects if catalog or entry does not exist

_exists(catalog: Catalog, entry: Entry) : one (exists: Flag)
    Returns true if catalog exists and entry is in catalog, false otherwise
```
