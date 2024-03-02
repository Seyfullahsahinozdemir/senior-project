import express from 'express';
import { Dependencies } from '@web/crosscutting/container';
import * as controllers from './controllers';
import * as middlewares from './middlewares';

export function makeApp(dependencies: Dependencies) {
  const app = express();

  middlewares.onRequest({ app });

  app.use(controllers.authController({ dependencies, router: express.Router() }));
  app.use(controllers.userController({ dependencies, router: express.Router() }));

  middlewares.onResponse({ app, dependencies });

  return app;
}
