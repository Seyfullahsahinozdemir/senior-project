import { asFunction, Resolver } from 'awilix';
import { makeAuth, makeCategory, makeUser } from './features';

export type Dependencies = {
  auth: ReturnType<typeof makeAuth>;
  user: ReturnType<typeof makeUser>;
  category: ReturnType<typeof makeCategory>;
};

export function makeApplication(): { [dependency in keyof Dependencies]: Resolver<Dependencies[dependency]> } {
  return {
    auth: asFunction(makeAuth).singleton(),
    user: asFunction(makeUser).singleton(),
    category: asFunction(makeCategory).singleton(),
  };
}
