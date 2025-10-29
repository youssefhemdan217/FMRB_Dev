"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnalyticsRoutes = void 0;
const express_1 = require("express");
const createAnalyticsRoutes = (analyticsController) => {
    const router = (0, express_1.Router)();
    router.get('/summary', analyticsController.getSummary);
    return router;
};
exports.createAnalyticsRoutes = createAnalyticsRoutes;
//# sourceMappingURL=analytics.routes.js.map