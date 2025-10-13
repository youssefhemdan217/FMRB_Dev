import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController';

export const createAnalyticsRoutes = (
  analyticsController: AnalyticsController
): Router => {
  const router = Router();

  router.get('/summary', analyticsController.getSummary);

  return router;
};

