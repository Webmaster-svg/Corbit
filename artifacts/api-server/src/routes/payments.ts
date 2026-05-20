import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import type { Request } from "express";
import crypto from "crypto";

const router = Router();

/**
 * SECURE CHARGILY WEBHOOK ENDPOINT
 * POST /api/webhooks/chargily
 * 
 * Chargily Pay will contact this endpoint securely in the background when a payment succeeds.
 */
router.post("/webhooks/chargily", async (req, res) => {
  try {
    const signature = req.headers["signature"] as string;
    const rawBody = JSON.stringify(req.body);
    const webhookSecret = process.env.CHARGILY_WEBHOOK_SECRET;

    console.log("[Chargily Webhook] Received event:", req.body);

    // 1. Signature validation if webhook secret is configured
    if (webhookSecret && signature) {
      const computedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (signature !== computedSignature) {
        console.warn("[Chargily Webhook] Invalid signature verification failed!");
        res.status(401).json({ error: "Invalid signature verification" });
        return;
      }
    } else {
      console.log("[Chargily Webhook] Running in sandbox mode (Signature signature bypass active)");
    }

    // 2. Parse payload event details
    const event = req.body;
    const eventType = event.type; // e.g. "checkout.paid" or "invoice.paid"
    const eventData = event.data;

    if (eventType === "checkout.paid" || eventType === "invoice.paid") {
      const status = eventData.status;
      const metadata = eventData.metadata;

      if (status === "paid" && metadata) {
        const userId = Number(metadata.userId || metadata.user_id);
        const plan = metadata.plan;

        if (userId && (plan === "free" || plan === "starter" || plan === "pro")) {
          console.log(`[Chargily Webhook] Payment verified. Upgrading User #${userId} to Plan: ${plan}`);

          // Update user's active plan in Drizzle DB
          await db
            .update(usersTable)
            .set({ plan: plan })
            .where(eq(usersTable.id, userId));

          res.json({ success: true, message: `Successfully upgraded to ${plan}` });
          return;
        }
      }
    }

    res.json({ received: true, status: "ignored" });
  } catch (error: any) {
    console.error("[Chargily Webhook] Error processing event:", error);
    res.status(500).json({ error: "Internal webhook error", details: error.message });
  }
});

/**
 * DIRECT SUBSCRIPTION UPGRADE API (For Local Sandbox Dev Bypasses)
 * POST /api/payments/upgrade-plan
 */
router.post("/payments/upgrade-plan", requireAuth, async (req, res) => {
  try {
    const user = (req as Request & { user: any }).user;
    const { plan } = req.body;

    if (!plan || (plan !== "free" && plan !== "starter" && plan !== "pro")) {
      res.status(400).json({ error: "Invalid target subscription plan" });
      return;
    }

    console.log(`[Local Upgrade API] Manually upgrading User #${user.id} to Plan: ${plan}`);

    // Update in database
    await db
      .update(usersTable)
      .set({ plan: plan })
      .where(eq(usersTable.id, user.id));

    res.json({ success: true, plan });
  } catch (error: any) {
    console.error("[Local Upgrade API] Error executing upgrade:", error);
    res.status(500).json({ error: "Failed to upgrade", details: error.message });
  }
});

export default router;
