import { MongoServerError, WithId, type Collection, type Db } from "mongodb";

export class DuplicateContext extends Error {}
export class NoSuchContext extends Error {}
export class DuplicateMember extends Error {}

interface Context {
  identifier: string;
  name: string;
  members: string[];
}

/**
 * Class implementation of the Joining concept
 */
export class JoiningConcept {
  private readonly contexts: Collection<Context>;
  private indexed: boolean = false;

  /**
   * Instantiates the joining concept
   * @param db MongoDB instance managing this concept
   */
  constructor(db: Db) {
    this.contexts = db.collection<Context>("joining.contexts");
  }

  /* ******* Actions ******* */

  /**
   * Creates a context
   * @param id the identifier for that context
   * @param name a name for the context
   * @returns the promise of a Context
   * @throws error if ID already exists
   */
  async create({ id, name }: { id: string; name: string }): Promise<string> {
    // set up the index
    if (!this.indexed) {
      this.contexts.createIndex({ identifier: 1 });
      this.indexed = true;
    }

    try {
      this.contexts.insertOne({ identifier: id, name, members: [] });
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new DuplicateContext("Key already exists.");
      }
      throw error;
    }

    return id;
  }

  /**
   * Adds a member to the context
   * @param id the id for the context
   * @param member the member to add
   * @returns the member if the add was successful
   */
  async join({ id, member }: { id: string; member: string }): Promise<string> {
    const contextObj: WithId<Context> | null = await this.contexts.findOne({
      identifier: id,
    });

    if (contextObj === null) {
      throw new NoSuchContext(`No context with id ${id} exists`);
    }

    if (contextObj.members.includes(member)) {
      throw new DuplicateMember(
        `member ${member} already exists in context ${id}`,
      );
    }

    const newMembers = [...contextObj.members, member];

    // we are NOT awaiting this promise, write lock will take care of race conditions
    void this.contexts.updateOne(
      { _id: contextObj._id },
      { $set: { members: newMembers } },
    );
    return member;
  }

  /* ******* Queries ******* */

  /**
   * Given an id, checks its existence in contexts
   * @param id
   * @returns true iff id is a context
   */
  async _isContext(id: string): Promise<boolean> {
    return (
      (await this.contexts.countDocuments({ identifier: id }, { limit: 1 })) > 0
    );
  }

  /**
   * given a context id and a member, checks membership
   * @param id the context
   * @param member the member to check
   * @returns true iff member in context
   */
  async _isMember(id: string, member: string): Promise<boolean> {
    const contextObj: Context | null = await this.contexts.findOne({
      identifier: id,
    });

    if (contextObj === null) {
      return false;
    }

    return contextObj.members.includes(member);
  }

  /**
   * Gets the name of a context
   *
   * @param id the context
   * @returns its name, if it exists, else null
   */
  async _getName(id: string): Promise<string | null> {
    const contextObj: Context | null = await this.contexts.findOne({
      identifier: id,
    });

    if (contextObj === null) {
      return null;
    }

    return contextObj.name;
  }
}
