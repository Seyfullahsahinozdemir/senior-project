import { asFunction, Resolver } from 'awilix';
import { makeAuth, makeCategory, makeComment, makeItem, makePost, makeUser } from './features';

export type Dependencies = {
  auth: ReturnType<typeof makeAuth>;
  user: ReturnType<typeof makeUser>;
  item: ReturnType<typeof makeItem>;
  category: ReturnType<typeof makeCategory>;
  post: ReturnType<typeof makePost>;
  comment: ReturnType<typeof makeComment>;
};

export function makeApplication(): { [dependency in keyof Dependencies]: Resolver<Dependencies[dependency]> } {
  return {
    auth: asFunction(makeAuth).singleton(),
    user: asFunction(makeUser).singleton(),
    item: asFunction(makeItem).singleton(),
    category: asFunction(makeCategory).singleton(),
    post: asFunction(makePost).singleton(),
    comment: asFunction(makeComment).singleton(),
  };
}
