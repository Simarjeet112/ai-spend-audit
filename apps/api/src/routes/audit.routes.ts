import { Router } from "express";
import { createAudit, getReport } from "../controllers/audit.controller";
import { captureLead } from "../controllers/leads.controller";
import { createSummary } from "../controllers/summary.controller";

const router = Router();

router.post("/audit", createAudit);
router.get("/report/:slug", getReport);
router.post("/leads", captureLead);
router.post("/summary", createSummary);

export default router;
