"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const async_handler_1 = require("../helpers/async-handler");
const router = (0, express_1.Router)();
router.get("/linkbase", (0, async_handler_1.asyncHandler)(async (req, res) => {
    const linkbase = await fetch("https://linkbase.kaloyanbozhkov.com/health");
    if (!linkbase.ok) {
        return res.status(500).json({
            status: "error",
            message: "Linkbase is not healthy",
            timestamp: new Date().toISOString(),
        });
    }
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
    });
}));
router.get("/linkbase-db", (0, async_handler_1.asyncHandler)(async (req, res) => {
    const linkbase = await fetch("https://linkbase.kaloyanbozhkov.com/healthz");
    if (!linkbase.ok) {
        return res.status(500).json({
            status: "error",
            message: "Linkbase DB is not healthy",
            timestamp: new Date().toISOString(),
        });
    }
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
    });
}));
exports.default = router;
//# sourceMappingURL=health.js.map