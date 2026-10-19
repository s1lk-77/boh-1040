import {
  MongoServerError,
  WithId,
  type Collection,
  type Db,
  type UpdateResult,
} from "mongodb";

export class BadCatalogOperation extends Error {}

interface Catalog {
  name: string;
  default: string;
  features: string[];
  entries: Entry[];
}

interface Entry {
  entry: string;
  bindings: Binding[];
}

interface Binding {
  feature: string;
  value: string;
}

export class CatalogingConcept {
  private readonly catalogs: Collection<Catalog>;
  private indexed: boolean = false;

  constructor(db: Db) {
    this.catalogs = db.collection<Catalog>("cataloging.catalogs");
  }

  /* ****** Actions ****** */

  public async catalog({
    name,
    features,
    default_,
  }: {
    name: string;
    features: string[];
    default_: string;
  }): Promise<{ catalog: string }> {
    if (!this.indexed) {
      await this.catalogs.createIndex({ name: 1 });
      this.indexed = true;
    }

    try {
      await this.catalogs.insertOne({
        name,
        default: default_,
        features,
        entries: [],
      });
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new BadCatalogOperation("Catalog already exists.");
      }
      throw error;
    }

    return { catalog: name };
  }

  public async addEntry({
    catalog,
    entry,
  }: {
    catalog: string;
    entry: string;
  }): Promise<{ entry: string }> {
    const catalogObj: WithId<Catalog> | null = await this.catalogs.findOne({
      name: catalog,
    });
    if (!catalogObj) {
      throw new BadCatalogOperation();
    }
    if (catalogObj.entries.some((e) => e.entry === entry)) {
      throw new BadCatalogOperation();
    }

    const newEntry: Entry = {
      entry,
      bindings: catalogObj.features.map((feature) => ({
        feature,
        value: catalogObj.default,
      })),
    };

    await this.catalogs.updateOne(
      { name: catalog },
      { $push: { entries: newEntry } },
    );

    return { entry };
  }

  public async update({
    catalog,
    entry,
    feature,
    value,
  }: {
    catalog: string;
    entry: string;
    feature: string;
    value: string;
  }): Promise<{ entry: string }> {
    const catalogObj: WithId<Catalog> | null = await this.catalogs.findOne({
      name: catalog,
    });
    if (!catalogObj) {
      throw new BadCatalogOperation();
    }

    const thisEntry = catalogObj.entries.find((e) => e.entry === entry);
    if (!thisEntry) {
      throw new BadCatalogOperation();
    }

    const thisBinding = thisEntry.bindings.find((b) => b.feature === feature);
    if (!thisBinding) {
      throw new BadCatalogOperation();
    }

    thisBinding.value = value;

    void this.catalogs.updateOne(
      { name: catalog, "entries.entry": entry },
      { $set: { "entries.$": thisEntry } },
    );
    return { entry };
  }

  public async delete({
    catalog,
    entry,
  }: {
    catalog: string;
    entry: string;
  }): Promise<{ entry: string }> {
    const catalogObj: WithId<Catalog> | null = await this.catalogs.findOne({
      name: catalog,
    });
    if (!catalogObj) {
      throw new BadCatalogOperation();
    }

    if (!catalogObj.entries.some((e) => e.entry === entry)) {
      throw new BadCatalogOperation();
    }

    void this.catalogs.updateOne(
      { catalog },
      { $pull: { entries: { entry } } },
    );
    return { entry };
  }

  /* ******* Queries ******** */

  public async _isCatalog({
    name,
  }: {
    name: string;
  }): Promise<{ isCatalog: boolean }> {
    return { isCatalog: (await this.catalogs.countDocuments({ name })) > 0 };
  }

  public async _get({
    catalog,
    entry,
  }: {
    catalog: string;
    entry: string;
  }): Promise<{ feature: string; value: string }[]> {
    const catalogObj: WithId<Catalog> | null = await this.catalogs.findOne({
      name: catalog,
    });
    if (!catalogObj) {
      return [];
    }

    const thisEntry = catalogObj.entries.find((e) => e.entry === entry);
    if (!thisEntry) {
      throw new BadCatalogOperation();
    }
    return thisEntry.bindings;
  }

  public async _exists({
    catalog,
    entry,
  }: {
    catalog: string;
    entry: string;
  }): Promise<{ exists: boolean }> {
    const catalogObj: WithId<Catalog> | null = await this.catalogs.findOne({
      name: catalog,
    });
    if (!catalogObj) {
      return { exists: false };
    }

    return { exists: catalogObj.entries.some((e) => e.entry === entry) };
  }
}
