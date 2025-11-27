import { Router } from "express";
import { asyncHandler } from "@/helpers/async-handler";
import { sendErrorLog } from "@/helpers/sendErrorLog";

const PROJECTS = {
  linkbase: "https://linkbase.kaloyanbozhkov.com/health",
  "linkbase-db": "https://linkbase.kaloyanbozhkov.com/healthz",
  "projects-alert": "https://project-alert-flame.vercel.app/api/health",
};

const router = Router();

Object.entries(PROJECTS).forEach(([key, value]) => {
  router.get(
    "/" + key,
    asyncHandler(async (req, res) => {
      const response = await fetch(value);
      if (!response.ok) {
        const msg = {
          message: `${key} is not healthy`,
          timestamp: new Date().toISOString(),
        };
        await sendErrorLog(key, msg);
        return res.status(500).json({
          status: "error",
          ...msg,
        });
      }
      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
      });
    })
  );
});

router.get(
  "/ok",
  asyncHandler(async (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;
