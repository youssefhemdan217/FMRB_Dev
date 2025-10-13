import { Request, Response, NextFunction } from 'express';
import { GetAnalyticsSummaryUseCase } from '../../application/use-cases/analytics/GetAnalyticsSummary';

export class AnalyticsController {
  constructor(
    private getAnalyticsSummaryUseCase: GetAnalyticsSummaryUseCase
  ) {}

  getSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate, roomId } = req.query;

      const start = startDate 
        ? new Date(startDate as string)
        : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days

      const end = endDate 
        ? new Date(endDate as string)
        : new Date();

      const summary = await this.getAnalyticsSummaryUseCase.execute(
        start,
        end,
        roomId as string | undefined
      );

      res.json(summary);
    } catch (error) {
      next(error);
    }
  };
}

