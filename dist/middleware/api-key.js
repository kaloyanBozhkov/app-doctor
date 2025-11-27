"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyMiddleware = void 0;
const env_1 = require("../helpers/env");
const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== env_1.env.X_API_KEY) {
        res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid or missing X-API-KEY header',
        });
        return;
    }
    next();
};
exports.apiKeyMiddleware = apiKeyMiddleware;
//# sourceMappingURL=api-key.js.map