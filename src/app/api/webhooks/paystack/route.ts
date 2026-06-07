import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { query } from "@/lib/db/client";

export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text();
    const signature = request.headers.get("x-paystack-signature");
    const secret = process.env.PAYSTACK_SECRET_KEY || "";

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // Verify Paystack Signature
    const hash = crypto.createHmac("sha512", secret).update(bodyText).digest("hex");
    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(bodyText);

    if (event.event === "charge.success") {
      const data = event.data;
      const customFields = data.metadata?.custom_fields || [];
      
      const getField = (name: string) => customFields.find((f: any) => f.variable_name === name)?.value;
      
      const workspaceId = getField("workspaceId");
      const userId = getField("userId");
      const credits = getField("credits");
      
      if (workspaceId && credits) {
        // Prevent duplicate processing by checking transaction reference
        const { rows: existingTx } = await query(
          "SELECT id FROM credit_transactions WHERE paystack_reference = $1",
          [data.reference]
        );

        if (existingTx.length === 0) {
          // 1. Add credits to workspace
          await query(
            "UPDATE workspaces SET credits_pool = credits_pool + $1, paystack_customer_id = $2 WHERE id = $3",
            [parseInt(credits), data.customer.customer_code, workspaceId]
          );

          // 2. Log transaction
          await query(
            `INSERT INTO credit_transactions (workspace_id, user_id, amount, reason, paystack_reference)
             VALUES ($1, $2, $3, 'topup', $4)`,
            [workspaceId, userId, parseInt(credits), data.reference]
          );
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
