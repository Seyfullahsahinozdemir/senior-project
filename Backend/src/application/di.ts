import { asFunction, Resolver } from 'awilix';
import { makeAuth } from './features/auth';

export type Dependencies = {
  auth: ReturnType<typeof makeAuth>;
};

export function makeApplication(): { [dependency in keyof Dependencies]: Resolver<Dependencies[dependency]> } {
  return {
    auth: asFunction(makeAuth).singleton(),
  };
}
