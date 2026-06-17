export interface EligibilityResult {
  eligible: boolean;
  plan: string;
  coverage: number;
  message: string;
}

export function checkEligibility(planId: string): EligibilityResult {
  const plans: Record<string, EligibilityResult> = {
    BASIC: { eligible: true, plan: "Basic Care", coverage: 60, message: "Covered up to 60%" },
    PREMIUM: { eligible: true, plan: "Premium Care", coverage: 90, message: "Covered up to 90%" },
    EXPIRED: { eligible: false, plan: "Expired", coverage: 0, message: "Subscription expired" },
  };
  return (
    plans[planId.toUpperCase()] ?? {
      eligible: false,
      plan: "Unknown",
      coverage: 0,
      message: "Plan not found",
    }
  );
}
