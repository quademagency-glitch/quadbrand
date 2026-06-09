import crypto from "crypto";
import { query } from "@/lib/db/client";

export type WebhookEvent = "generation.completed" | "generation.failed";

export async function dispatchWebhook(workspaceId: string, event: WebhookEvent, payload: any) {
  try {
    const { rows: webhooks } = await query(
      "SELECT url, secret, is_active FROM webhooks WHERE workspace_id = $1 AND is_active = true",
      [workspaceId]
    );

    if (webhooks.length === 0) return; // No active webhooks

    const webhook = webhooks[0];
    const timestamp = Date.now().toString();
    const body = JSON.stringify({
      id: `evt_${crypto.randomBytes(16).toString("hex")}`,
      event,
      timestamp,
      data: payload,
    });

    // Create HMAC signature
    const signature = crypto
      .createHmac("sha256", webhook.secret)
      .update(`${timestamp}.${body}`)
      .digest("hex");

    // We don't await the fetch so we don't block the API response
    fetch(webhook.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "bf-signature": `t=${timestamp},v1=${signature}`,
      },
      body,
    }).catch(err => {
      console.error(`Failed to deliver webhook to ${webhook.url}:`, err);
    });

    console.log(`Dispatched webhook ${event} to ${webhook.url}`);
  } catch (error) {
    console.error("Webhook dispatch error:", error);
  }
}
