import express from 'express';
import { Dependencies } from '@web/crosscutting/container';
import * as controllers from './controllers';
import * as middlewares from './middlewares';
import multer from 'multer';

export function makeApp(dependencies: Dependencies) {
  const app = express();

  const upload = multer({ dest: 'uploads/' });

  middlewares.onRequest({ app });

  app.use(controllers.authController({ dependencies, router: express.Router() }));
  app.use(controllers.userController({ dependencies, router: express.Router() }));
  app.use(controllers.categoryController({ dependencies, router: express.Router() }));
  app.use(controllers.itemController({ dependencies, router: express.Router(), upload }));
  app.use(controllers.postController({ dependencies, router: express.Router(), upload }));

  middlewares.onResponse({ app, dependencies });

  return app;
}
