export interface IRead<T> {
  find(query: any, index?: number, size?: number): Promise<T[]>;
  findOne(id: string): Promise<T>;
}
