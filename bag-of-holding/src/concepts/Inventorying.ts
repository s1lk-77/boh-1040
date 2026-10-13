import { MongoServerError, WithId, type Collection, type Db } from "mongodb";

export class BadInventoryOperation extends Error {}
export class BadInventoryQuery extends Error {}
export class InventoryNotFound extends Error {}

interface Inventory {
  owner: string;
  items: string[];
}

export class InventoryingConcept {
  private readonly inventories: Collection<Inventory>;
  private indexed: boolean = false;

  constructor(db: Db) {
    this.inventories = db.collection<Inventory>("inventorying.inventories");
  }

  /* ****** Actions ****** */

  async make({ owner }: { owner: string }): Promise<{ owner: string }> {
    // set up the index
    if (!this.indexed) {
      this.inventories.createIndex({ owner: 1 });
      this.indexed = true;
    }

    try {
      await this.inventories.insertOne({ owner, items: [] });
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new BadInventoryOperation("Inventory already exists.");
      }
      throw error;
    }

    return { owner };
  }

  async add({
    owner,
    item,
  }: {
    owner: string;
    item: string;
  }): Promise<{ item: string }> {
    const inventory: WithId<Inventory> | null = await this.inventories.findOne({
      owner,
    });
    if (!inventory) {
      throw new BadInventoryOperation();
    }
    if (inventory.items.includes(item)) {
      throw new BadInventoryOperation();
    }
    void this.inventories.updateOne(
      { owner },
      { $set: { items: [...inventory.items, item] } },
    );
    return { item };
  }

  async remove({
    owner,
    item,
  }: {
    owner: string;
    item: string;
  }): Promise<{ item: string }> {
    const inventory: WithId<Inventory> | null = await this.inventories.findOne({
      owner,
    });
    if (!inventory) {
      throw new BadInventoryOperation();
    }
    if (!inventory.items.includes(item)) {
      throw new BadInventoryOperation();
    }
    void this.inventories.updateOne(
      { owner },
      {
        $set: {
          items: inventory.items.filter((thisItem) => thisItem !== item),
        },
      },
    );
    return { item };
  }

  async delete({ owner }: { owner: string }): Promise<{ owner: string }> {
    const inventory: WithId<Inventory> | null = await this.inventories.findOne({
      owner,
    });
    if (!inventory) {
      throw new BadInventoryOperation();
    }
    void this.inventories.deleteOne({ owner });
    return { owner };
  }

  /* ****** Queries ****** */

  async _owns({
    owner,
    item,
  }: {
    owner: string;
    item: string;
  }): Promise<{ owns: boolean }> {
    const inventory: WithId<Inventory> | null = await this.inventories.findOne({
      owner,
    });
    if (!inventory) {
      throw new BadInventoryQuery();
    }
    return { owns: inventory.items.includes(item) };
  }

  async _getAll({
    owner,
    item,
  }: {
    owner: string;
    item: string;
  }): Promise<{ item: string }[]> {
    const inventory: WithId<Inventory> | null = await this.inventories.findOne({
      owner,
    });
    if (!inventory) {
      throw new BadInventoryQuery();
    }
    return inventory.items.map((thisItem) => {
      return { item: thisItem };
    });
  }
}
