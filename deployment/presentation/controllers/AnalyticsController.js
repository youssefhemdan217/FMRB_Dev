"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
class AnalyticsController {
    getAnalyticsSummaryUseCase;
    constructor(getAnalyticsSummaryUseCase) {
        this.getAnalyticsSummaryUseCase = getAnalyticsSummaryUseCase;
    }
    getSummary = async (req, res, next) => {
        try {
            const { startDate, endDate, roomId } = req.query;
            const start = startDate
                ? new Date(startDate)
                : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
            const end = endDate
                ? new Date(endDate)
                : new Date();
            const summary = await this.getAnalyticsSummaryUseCase.execute(start, end, roomId);
            res.json(summary);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AnalyticsController = AnalyticsController;
//# sourceMappingURL=AnalyticsController.js.map