"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retry = void 0;
const deverything_1 = require("deverything");
const retry = async (fn, retries = 3, exponentialBackoff = false) => {
    if (retries <= 0) {
        throw new Error("retries must be greater than 0");
    }
    let lastError;
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (exponentialBackoff) {
                await (0, deverything_1.sleep)(500 * 2 ** attempt - 500);
            }
        }
    }
    throw lastError;
};
exports.retry = retry;
//# sourceMappingURL=retry.js.map