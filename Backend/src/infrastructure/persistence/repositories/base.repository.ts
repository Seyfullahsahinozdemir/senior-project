import { IRead } from '@application/persistence/IRead';
import { IWrite } from '@application/persistence/IWrite';
import { Dependencies } from '@infrastructure/di';
import { Collection, ObjectId, Document, OptionalId } from 'mongodb';
import { AnyObject } from 'mongoose';

export abstract class BaseRepository<T extends OptionalId<Document>> implements IWrite<T>, IRead<T> {
  public readonly _collection: Collection<AnyObject>;

  constructor(db: Pick<Dependencies, 'db'>, collectionName: string) {
    this._collection = db.db.collection(collectionName);
  }

  async deleteMany(query: any): Promise<T[]> {
    const result = await this._collection.deleteMany(query);
    if (result.deletedCount && result.deletedCount > 0) {
      const deletedDocuments = await this._collection.find(query).toArray();
      return deletedDocuments as T[];
    } else {
      throw new Error('No documents found matching the provided query for deletion.');
    }
  }

  async create(item: T): Promise<T> {
    const result = await this._collection.insertOne(item);

    const insertedId = result.insertedId;

    if (!insertedId) {
      throw new Error('Failed to retrieve inserted document ID');
    }

    const insertedDocument = await this._collection.findOne({ _id: insertedId });
    if (!insertedDocument) {
      throw new Error('Failed to retrieve inserted document');
    }

    return insertedDocument as T;
  }

  async update(id: string, item: T): Promise<T> {
    const objectId = new ObjectId(id);
    const result = await this._collection.findOneAndUpdate(
      { _id: objectId },
      { $set: item },
      { returnDocument: 'after' },
    );
    return result as T;
  }

  async delete(id: string): Promise<T> {
    const objectId = new ObjectId(id);
    const result = await this._collection.findOneAndDelete({ _id: objectId });
    return result as T;
  }

  async find(query: any, index: number, size: number, sort?: any): Promise<T[]> {
    let cursor = this._collection.find(query);

    if (sort) {
      cursor = cursor.sort(sort);
    }

    if (index !== undefined && size !== undefined && index >= 0 && size >= 0) {
      cursor = cursor.skip(index * size).limit(size);
    }

    return cursor.toArray() as Promise<T[]>;
  }

  async findOne(id: string): Promise<T> {
    const objectId = new ObjectId(id);
    const result = await this._collection.findOne({ _id: objectId });
    return result as T;
  }
}
