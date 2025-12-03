"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const async_handler_1 = require("../helpers/async-handler");
const sendErrorLog_1 = require("../helpers/sendErrorLog");
const env_1 = require("../helpers/env");
const retry_1 = require("../helpers/retry");
const PROJECTS = {
    "projects-alert": [
        "https://project-alert-flame.vercel.app/api/health",
        { "x-api-key": env_1.env.TG_BOT_KEY },
    ],
    linkbase: ["https://linkbase.kaloyanbozhkov.com/health", {}],
    "linkbase-db": ["https://linkbase.kaloyanbozhkov.com/health/db", {}],
    naslqpo: ["https://naslqpo.com/api/health", {}],
    "naslqpo-db": ["https://naslqpo.com/api/health/db", {}],
    znp: ["https://znp.show/api/health/db", {}],
    "znp-db": ["https://znp.show/api/health/db", {}],
};
// Core health check logic - decoupled from express req/res
async function checkProjectHealth(projectKey, url, headers) {
    const timestamp = new Date().toISOString();
    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            const msg = {
                message: `${projectKey} is not healthy`,
                timestamp,
                response: await response.text(),
            };
            await (0, sendErrorLog_1.sendErrorLog)(projectKey, msg);
            return {
                success: false,
                ...msg,
            };
        }
        console.log(projectKey, "is healthy");
        return {
            success: true,
            timestamp,
        };
    }
    catch (error) {
        const msg = {
            message: `${projectKey} health check failed: ${error}`,
            timestamp,
        };
        await (0, sendErrorLog_1.sendErrorLog)(projectKey, msg);
        return {
            success: false,
            message: msg.message,
            timestamp,
        };
    }
}
// Build handlers hash upfront
const handlersHash = {};
Object.entries(PROJECTS).forEach(([key, args]) => {
    const [url, headers] = args;
    handlersHash[key] = () => checkProjectHealth(key, url, headers);
});
const router = (0, express_1.Router)();
// Individual project health endpoints
Object.entries(PROJECTS).forEach(([key, args]) => {
    const [url, headers] = args;
    router.get("/" + key, (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await checkProjectHealth(key, url, headers);
        if (!result.success) {
            return res.status(500).json({
                status: "error",
                message: result.message,
                timestamp: result.timestamp,
            });
        }
        res.json({
            status: "ok",
            timestamp: result.timestamp,
        });
    }));
});
// Check all projects
router.get("/check-all", (0, async_handler_1.asyncHandler)(async (req, res) => {
    const results = {};
    for (const [key, checkFn] of Object.entries(handlersHash)) {
        results[key] = await (0, retry_1.retry)(checkFn, 2, true);
    }
    const allHealthy = Object.values(results).every((r) => r.success);
    res.status(allHealthy ? 200 : 500).json({
        status: allHealthy ? "all-ok" : "some-failed",
        results,
        timestamp: new Date().toISOString(),
    });
}));
exports.default = router;
//# sourceMappingURL=health.js.map