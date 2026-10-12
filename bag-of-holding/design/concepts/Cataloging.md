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
    a name String
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
catalog(name: String, features: Features) : (catalog: Catalog)
    where a catalog with name exists
    then
        refuses ALREADY_EXISTS "Catalog with this name already exists"
    where a catalog with name does not exist
    then
        add a new catalog with name, the given set of features, and no entries

log(catalog: Catalog, entry: Entry, bindings: {feature: Feature, value: Value}[]) : returns (entry: Entry)
    where catalog exists and entry does not exist in catalog and the features in bindings match this catalog's features
    then
        add a new binding with feature and value for each object in bindings and add this binding to this entry
        add this entry to the catalog
        return entry
    where catalog does not exist or entry exists in catalog or the features in bindings do not match this catalog's features
    then
        refuses FAILED_LOG "Could not add entry to catalog"

update(catalog: Catalog, entry: Entry, feature: Feature, value: Value) : returns (entry: Entry)
    where catalog exists and entry exists in catalog and feature is in this catalog's features
    then
        for this entry's binding with this feature, replace the binding's value with this value
    where catalog does not exist or entry does not exist in catalog or feature is not in catalog
    then
        refuses FAILED_UPDATE "Could not update catalog entry"

delete(catalog: Catalog, entry: Entry)
    where catalog exists and entry exists in catalog
    then
        remove this entry
    where catalog does not exist or entry does not exist in catalog
    then
        refuses FAILED_DELETIE "Could not delete entry from catalog"
```

## Queries

```queries
_get(catalog: Catalog, entry: Entry) : returns (entry Entry, {feature: Feature, value: Value}[])
    Returns the entry and the features and values of its bindings as an array of features and values, or nothing if catalog doesn't exist or entry does not exist in catalog

_exists(catalog: Catalog, entry: Entry) : returns (exists: Boolean)
    Returns true if catalog exists and entry is in catalog, false otherwise
```
