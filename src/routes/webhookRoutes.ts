import { Router } from "express";
import { handleWebhook } from "../controllers/webhookController.js";
import { handleUserWebhook } from "../controllers/userWebhookController.js";

const router = Router();

router.post("/asana", handleWebhook);
router.get("/", handleUserWebhook);

export default router;
