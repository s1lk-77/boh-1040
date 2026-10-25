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
  async create({
    id,
    name,
  }: {
    id: string;
    name: string;
  }): Promise<{ context: string }> {
    // set up the index
    if (!this.indexed) {
      await this.contexts.createIndex({ identifier: 1 }, { unique: true });
      this.indexed = true;
    }

    try {
      await this.contexts.insertOne({
        identifier: id,
        name,
        members: [],
      });
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new DuplicateContext("Key already exists.");
      }
      throw error;
    }

    return { context: id };
  }

  /**
   * Adds a member to the context
   * @param id the id for the context
   * @param member the member to add
   * @returns the member if the add was successful
   */
  async join({
    id,
    member,
  }: {
    id: string;
    member: string;
  }): Promise<{ member: string }> {
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

    await this.contexts.updateOne(
      { _id: contextObj._id },
      { $set: { members: newMembers } },
    );
    return { member };
  }

  public async updateName({
    id,
    name,
  }: {
    id: string;
    name: string;
  }): Promise<{ name: string }> {
    const contextObj: WithId<Context> | null = await this.contexts.findOne({
      identifier: id,
    });

    if (contextObj === null) {
      throw new NoSuchContext(`No context with id ${id} exists`);
    }

    await this.contexts.updateOne({ _id: contextObj._id }, { $set: { name } });
    return { name };
  }

  /* ******* Queries ******* */

  /**
   * Given an id, checks its existence in contexts
   * @param id
   * @returns true iff id is a context
   */
  async _isContext({ id }: { id: string }): Promise<{ isContext: boolean }> {
    return {
      isContext:
        (await this.contexts.countDocuments({ identifier: id }, { limit: 1 })) >
        0,
    };
  }

  /**
   * given a context id and a member, checks membership
   * @param id the context
   * @param member the member to check
   * @returns true iff member in context
   */
  async _isMember({
    id,
    member,
  }: {
    id: string;
    member: string;
  }): Promise<{ isMember: boolean }> {
    const contextObj: Context | null = await this.contexts.findOne({
      identifier: id,
    });

    if (contextObj === null) {
      return { isMember: false };
    }

    return { isMember: contextObj.members.includes(member) };
  }

  /**
   * Gets the name of a context
   *
   * @param id the context
   * @returns its name, if it exists, else null
   */
  async _getName({ id }: { id: string }): Promise<{ name: string | null }> {
    const contextObj: Context | null = await this.contexts.findOne({
      identifier: id,
    });

    if (contextObj === null) {
      return { name: null };
    }

    return { name: contextObj.name };
  }

  /**
   * Gets all members of a context
   *
   * @param id the context
   * @returns all members, if it exists, else null
   */
  async _getAll({ id }: { id: string }): Promise<{ member: string }[]> {
    const contextObj: Context | null = await this.contexts.findOne({
      identifier: id,
    });

    if (contextObj === null) {
      return [];
    }

    return contextObj.members.map((member) => {
      return { member };
    });
  }
}
