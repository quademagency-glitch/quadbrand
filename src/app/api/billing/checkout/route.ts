import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PRICING_PLANS, PlanId, fetchPaystack } from "@/lib/payments";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const session = user ? { uid: user.id, email: user.email, name: user.user_metadata?.full_name } : null;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planId, workspaceId, clientCountryCode } = body;

    if (!planId || !workspaceId) {
      return NextResponse.json({ error: "Missing planId or workspaceId" }, { status: 400 });
    }

    const plan = PRICING_PLANS[planId as PlanId];
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create Paystack Transaction
    const amountInCents = plan.priceUsd * 100;
    
    const payload = {
      email: session.email || "user@quadbrand.com",
      amount: amountInCents, 
      currency: "USD",
      callback_url: `${appUrl}/dashboard?payment=success`,
      metadata: {
        custom_fields: [
          { display_name: "Workspace ID", variable_name: "workspaceId", value: workspaceId },
          { display_name: "Plan ID", variable_name: "planId", value: planId },
          { display_name: "User ID", variable_name: "userId", value: session.uid },
          { display_name: "Credits", variable_name: "credits", value: plan.credits.toString() }
        ]
      }
    };

    const response = await fetchPaystack("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    return NextResponse.json({ 
      gateway: "paystack",
      url: response.data.authorization_url 
    });
  } catch (error: any) {
    console.error("Checkout API error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
