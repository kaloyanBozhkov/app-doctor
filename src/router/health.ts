import { Router } from "express";
import { asyncHandler } from "@/helpers/async-handler";
import { sendErrorLog } from "@/helpers/sendErrorLog";
import { env } from "@/helpers/env";

const PROJECTS: Record<string, [string, Record<string, string>]> = {
  "projects-alert": [
    "https://project-alert-flame.vercel.app/api/health",
    { "X-API-KEY": env.TG_BOT_KEY },
  ],
  linkbase: ["https://linkbase.kaloyanbozhkov.com/health", {}],
  "linkbase-db": ["https://linkbase.kaloyanbozhkov.com/healthz", {}],
};

type HealthCheckResult = {
  success: boolean;
  message?: string;
  timestamp: string;
};

// Core health check logic - decoupled from express req/res
async function checkProjectHealth(
  projectKey: string,
  url: string,
  headers: Record<string, string>
): Promise<HealthCheckResult> {
  const timestamp = new Date().toISOString();
  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      const msg = {
        message: `${projectKey} is not healthy`,
        timestamp,
      };
      await sendErrorLog(projectKey, msg);
      return {
        success: false,
        message: msg.message,
        timestamp,
      };
    }
    console.log(projectKey, "is healthy");
    return {
      success: true,
      timestamp,
    };
  } catch (error) {
    const msg = {
      message: `${projectKey} health check failed: ${error}`,
      timestamp,
    };
    await sendErrorLog(projectKey, msg);
    return {
      success: false,
      message: msg.message,
      timestamp,
    };
  }
}

// Build handlers hash upfront
const handlersHash: Record<string, () => Promise<HealthCheckResult>> = {};
Object.entries(PROJECTS).forEach(([key, args]) => {
  const [url, headers] = args;
  handlersHash[key] = () => checkProjectHealth(key, url, headers);
});

const router = Router();

// Individual project health endpoints
Object.entries(PROJECTS).forEach(([key, args]) => {
  const [url, headers] = args;
  router.get(
    "/" + key,
    asyncHandler(async (req, res) => {
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
    })
  );
});

// Check all projects
router.get(
  "/check-all",
  asyncHandler(async (req, res) => {
    const results: Record<string, HealthCheckResult> = {};
    for (const [key, checkFn] of Object.entries(handlersHash)) {
      results[key] = await checkFn();
    }

    const allHealthy = Object.values(results).every((r) => r.success);
    res.status(allHealthy ? 200 : 500).json({
      status: allHealthy ? "all-ok" : "some-failed",
      results,
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;
