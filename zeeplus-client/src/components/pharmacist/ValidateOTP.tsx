import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OTPInput } from "@/components/common/OTPInput";
import { toast } from "sonner";

export function ValidateOTP() {
  const [code, setCode] = useState("");
  return (
    <div>
      <PageHeader title="Validate OTP" subtitle="Confirm the patient's one-time code." />
      <Card className="max-w-xl">
        <CardContent className="grid gap-4 p-6">
          <OTPInput value={code} onChange={setCode} />
          <Button
            className="w-fit"
            onClick={() => {
              if (code.length === 6) toast.success("OTP validated");
              else toast.error("Enter 6 digits");
            }}
          >
            Validate
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
