import { Request, Response, NextFunction } from 'express';
import { GetAnalyticsSummaryUseCase } from '../../application/use-cases/analytics/GetAnalyticsSummary';
export declare class AnalyticsController {
    private getAnalyticsSummaryUseCase;
    constructor(getAnalyticsSummaryUseCase: GetAnalyticsSummaryUseCase);
    getSummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AnalyticsController.d.ts.map