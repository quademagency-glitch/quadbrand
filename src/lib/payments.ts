// Paystack-exclusive billing setup

export const PRICING_PLANS = {
  starter: {
    name: "Starter",
    priceUsd: 10,
    credits: 50,
    paystackPlanId: process.env.PAYSTACK_PLAN_STARTER || "PLN_dummy_starter",
  },
  creator: {
    name: "Creator",
    priceUsd: 25,
    credits: 150,
    paystackPlanId: process.env.PAYSTACK_PLAN_CREATOR || "PLN_dummy_creator",
  },
  agency: {
    name: "Agency",
    priceUsd: 99,
    credits: 1000,
    paystackPlanId: process.env.PAYSTACK_PLAN_AGENCY || "PLN_dummy_agency",
  },
};

export type PlanId = keyof typeof PRICING_PLANS;

// Paystack helper configuration
export const PAYSTACK_API_URL = "https://api.paystack.co";

/**
 * Helper to call Paystack APIs
 */
export async function fetchPaystack(endpoint: string, options: RequestInit = {}) {
  const url = `${PAYSTACK_API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Paystack API Error");
  }

  return data;
}

/**
 * Returns the payment gateway. Currently exclusively Paystack.
 */
export function getPaymentGatewayForCountry(countryCode: string | null): "paystack" | "stripe" {
  return "paystack";
}
