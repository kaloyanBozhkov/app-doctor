"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorLog = void 0;
const env_1 = require("./env");
const sendErrorLog = async (projectName, payload) => {
    return fetch("https://project-alert-flame.vercel.app/api/send-message", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": env_1.env.TG_BOT_KEY,
        },
        body: JSON.stringify({
            type: "error",
            project_name: projectName,
            payload,
        }),
    });
};
exports.sendErrorLog = sendErrorLog;
//# sourceMappingURL=sendErrorLog.js.map