import {
  MongoServerError,
  DeleteResult,
  type Collection,
  type Db,
} from "mongodb";

export class AlreadyExists extends Error {}
export class DoesNotExist extends Error {}

/**
 * The internal Key interface
 */
interface Key {
  _id: string;
  context: string;
  suffix: string;
}

/**
 * Typescript class for the naming concept
 */
export class NamingConcept {
  private readonly keys: Collection<Key>;
  private indexed: boolean = false;

  /**
   * Instantiates the naming concept
   * @param db MongoDB instance managing this concept
   */
  constructor(db: Db) {
    this.keys = db.collection<Key>("naming.keys");
  }

  /* ******* Actions ******* */

  /**
   * Given suffix in a context, return a key that is globally unique across all contexts
   *
   * @param context
   * @param suffix
   * @returns a promise of a key
   * @throws error if this pair of context and suffix already exists
   */
  async uniquify({
    context,
    suffix,
  }: {
    context: string;
    suffix: string;
  }): Promise<{ key: string }> {
    // set up indexing if not already
    if (!this.indexed) {
      await this.keys.createIndex({ context: 1, suffix: 1 }, { unique: true });
      this.indexed = true;
    }

    // data structure
    const key: string = `${context}@${suffix}`;
    try {
      await this.keys.insertOne({ _id: key, context, suffix });
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new AlreadyExists("Key already exists.");
      }
      throw error;
    }
    return { key };
  }

  /**
   * Given key, delete the key and the pair associated with it and
   * return the deleted key
   *
   * @param key the key to delete
   * @returns a promise of a key
   * @throws error if this key does not exist
   */
  async delete({ key }: { key: string }): Promise<{ key: string }> {
    const result: DeleteResult = await this.keys.deleteOne({ _id: key });
    if (result.deletedCount === 0) {
      throw new DoesNotExist("Cannot delete non existent key");
    }
    return { key };
  }

  /* ******* Queries ******* */

  /**
   * Given a context and a suffix, retrieve its key
   * @param context the context
   * @param suffix the suffix
   * @returns a key if it exists and null otherwise
   */
  async _getKey({
    context,
    suffix,
  }: {
    context: string;
    suffix: string;
  }): Promise<{ key: string | null }> {
    const keyObj: Key | null = await this.keys.findOne({ context, suffix });
    if (keyObj !== null) {
      return { key: keyObj._id };
    } else {
      return { key: null };
    }
  }

  /**
   * Given a key, retreieves its context and suffix
   * @param key the key
   * @returns the context and suffix matched, or null if key does not exist
   */
  async _getValue({
    key,
  }: {
    key: string;
  }): Promise<{ context: string | null; suffix: string | null }> {
    const keyObj: Key | null = await this.keys.findOne({ _id: key });
    if (keyObj !== null) {
      return { context: keyObj.context, suffix: keyObj.suffix };
    } else {
      return { context: null, suffix: null };
    }
  }
}
