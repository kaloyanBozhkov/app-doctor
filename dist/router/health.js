"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const async_handler_1 = require("../helpers/async-handler");
const sendErrorLog_1 = require("../helpers/sendErrorLog");
const PROJECTS = {
    linkbase: "https://linkbase.kaloyanbozhkov.com/health",
    "linkbase-db": "https://linkbase.kaloyanbozhkov.com/healthz",
    "projects-alert": "https://project-alert-flame.vercel.app/api/health",
};
const router = (0, express_1.Router)();
Object.entries(PROJECTS).forEach(([key, value]) => {
    router.get("/" + key, (0, async_handler_1.asyncHandler)(async (req, res) => {
        const response = await fetch(value);
        if (!response.ok) {
            const msg = {
                message: `${key} is not healthy`,
                timestamp: new Date().toISOString(),
            };
            await (0, sendErrorLog_1.sendErrorLog)(key, msg);
            return res.status(500).json({
                status: "error",
                ...msg,
            });
        }
        res.json({
            status: "ok",
            timestamp: new Date().toISOString(),
        });
    }));
});
router.get("/ok", (0, async_handler_1.asyncHandler)(async (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
    });
}));
exports.default = router;
//# sourceMappingURL=health.js.map