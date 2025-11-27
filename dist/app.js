"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const api_key_1 = require("./middleware/api-key");
const error_handler_1 = require("./middleware/error-handler");
const router_1 = __importDefault(require("./router"));
const env_1 = require("./helpers/env");
const app = (0, express_1.default)();
// Built-in middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// CORS
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
}));
// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});
// API key middleware - applies to all routes except health check
app.use((req, res, next) => {
    if (req.path === "/api/health") {
        return next();
    }
    (0, api_key_1.apiKeyMiddleware)(req, res, next);
});
// Routes
app.use("/api", router_1.default);
// Root route
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "App Doctor API",
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: "Not Found",
        message: `Route ${req.method} ${req.url} not found`,
    });
});
// Error handler (must be last)
app.use(error_handler_1.errorHandler);
app.listen(env_1.env.PORT, () => {
    console.log(`Server running on port ${env_1.env.PORT} in ${env_1.env.NODE_ENV} mode`);
});
exports.default = app;
//# sourceMappingURL=app.js.map