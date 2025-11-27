import { Router } from "express";
import { asyncHandler } from "@/helpers/async-handler";

const router = Router();

router.get(
  "/linkbase",
  asyncHandler(async (req, res) => {
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
  })
);


router.get(
  "/linkbase",
  asyncHandler(async (req, res) => {
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
  })
);

export default router;
