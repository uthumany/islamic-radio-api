import { Router } from "express";
import { healthStore } from "../store/healthStore.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json(healthStore.getAllStatuses());
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const status = healthStore.getStatus(id);
  if (status) {
    res.json(status);
  } else {
    res.status(404).json({ error: "Station health data not found" });
  }
});

export default router;
