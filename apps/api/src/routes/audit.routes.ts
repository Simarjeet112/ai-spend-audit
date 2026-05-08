import { Router } from "express";
import { createAudit, getReport } from "../controllers/audit.controller";

const router = Router();

router.post("/audit", createAudit);
router.get("/report/:slug", getReport);

export default router;
