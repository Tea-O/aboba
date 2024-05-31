import { userRoute } from './user';
import { type Application } from 'express';

export const withApiRoutes = (app: Application) => {
  app.use(userRoute);

  return app;
};
