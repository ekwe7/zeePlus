import { useState } from "react";
import { generateOTP } from "@/utils/otpGenerator";

export function useOTP() {
  const [otp, setOtp] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const issue = () => {
    const code = generateOTP();
    const exp = new Date(Date.now() + 5 * 60_000).toISOString();
    setOtp(code);
    setExpiresAt(exp);
    return { code, expiresAt: exp };
  };
  const clear = () => {
    setOtp(null);
    setExpiresAt(null);
  };
  return { otp, expiresAt, issue, clear };
}
