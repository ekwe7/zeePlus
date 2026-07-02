import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOTP } from "@/hooks/useOTP";

export function GenerateOTPForMedication() {
  const { otp, expiresAt, issue, clear } = useOTP();
  const [issuedAt, setIssuedAt] = useState<Date | null>(null);

  return (
    <div>
      <PageHeader
        title="Generate OTP"
        subtitle="Get a one-time code to collect your medication."
      />
      <Card className="max-w-xl">
        <CardContent className="grid gap-4 p-6">
          {!otp ? (
            <Button
              className="w-fit"
              onClick={() => {
                issue();
                setIssuedAt(new Date());
              }}
            >
              Generate OTP
            </Button>
          ) : (
            <div className="grid gap-3">
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Your OTP
                </div>
                <div className="mt-2 text-5xl font-bold tracking-[0.4em] text-primary">
                  {otp}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Expires at{" "}
                  {expiresAt && new Date(expiresAt).toLocaleTimeString()} ·
                  issued {issuedAt?.toLocaleTimeString()}
                </div>
              </div>
              <Button
                variant="outline"
                onClick={clear}
                className="w-fit mx-auto"
              >
                Clear
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
