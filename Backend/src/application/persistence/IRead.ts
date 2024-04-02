export interface IRead<T> {
  find(query: any, index?: number, size?: number, sort?: any): Promise<T[]>;
  findOne(id: string): Promise<T>;
  aggregate(pipeline: any[]): Promise<any[]>;
}
