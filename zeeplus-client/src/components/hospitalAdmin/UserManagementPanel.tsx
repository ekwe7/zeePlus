import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/authStore";
import { useUserAccountsStore } from "@/store/userAccountsStore";
import type { EligibilityPlan } from "@/store/userAccountsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["doctor", "pharmacist"], { required_error: "Select a role" }),
});

type FormValues = z.infer<typeof schema>;

const PLAN_BADGE_VARIANT: Record<EligibilityPlan, "default" | "secondary" | "destructive"> = {
  BASIC: "secondary",
  PREMIUM: "default",
  EXPIRED: "destructive",
};

const STATUS_BADGE_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "secondary",
  ACTIVE: "default",
  SUSPENDED: "destructive",
};

export function UserManagementPanel() {
  const { email: adminEmail } = useAuthStore();
  const { createUser, users, updateEligibilityPlan, updateUserStatus } = useUserAccountsStore();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [planFeedback, setPlanFeedback] = useState<Record<string, string>>({});
  const [statusFeedback, setStatusFeedback] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormValues) => {
    setServerError(null);
    setSuccessMsg(null);
    const result = createUser({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      createdBy: adminEmail ?? "admin",
    });
    if (!result.success) {
      setServerError(result.error ?? "Failed to create user.");
      return;
    }
    setSuccessMsg(
      `${data.role === "doctor" ? "Doctor" : "Pharmacist"} account created for ${data.name}.`,
    );
    reset();
  };

  const staffUsers = users.filter((u) => u.role === "doctor" || u.role === "pharmacist");
  const patientUsers = users.filter((u) => u.role === "patient");
  const hospitalUsers = users.filter((u) => u.role === "admin");

  const handlePlanChange = (patientId: string, newPlan: string) => {
    const result = updateEligibilityPlan(patientId, newPlan);
    if (result.success) {
      setPlanFeedback((prev) => ({ ...prev, [patientId]: `Plan updated to ${newPlan}` }));
      setTimeout(
        () =>
          setPlanFeedback((prev) => {
            const next = { ...prev };
            delete next[patientId];
            return next;
          }),
        3000,
      );
    } else {
      setPlanFeedback((prev) => ({ ...prev, [patientId]: result.error ?? "Update failed" }));
    }
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    const result = updateUserStatus(userId, newStatus as any);
    if (result.success) {
      setStatusFeedback((prev) => ({ ...prev, [userId]: `Status updated to ${newStatus}` }));
      setTimeout(
        () =>
          setStatusFeedback((prev) => {
            const next = { ...prev };
            delete next[userId];
            return next;
          }),
        3000,
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Users" subtitle="Create doctor and pharmacist accounts" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Add a new doctor or pharmacist to the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" type="text" placeholder="Dr. Jane Smith" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="staff@hospital.com"
                  {...register("email")}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Temporary password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label>Role</Label>
                <Select onValueChange={(v) => setValue("role", v as "doctor" | "pharmacist")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="pharmacist">Pharmacist</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
              </div>
              {serverError && (
                <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {serverError}
                </div>
              )}
              {successMsg && (
                <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
                  {successMsg}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Create account
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Staff Accounts</CardTitle>
            <CardDescription>
              {staffUsers.length} doctor/pharmacist account{staffUsers.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {staffUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No staff accounts yet.</p>
            ) : (
              <ul className="space-y-3">
                {staffUsers.map((u) => (
                  <li
                    key={u.id}
                    className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
                  >
                    <div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {u.role}
                      </Badge>
                      <Badge
                        variant={u.status === "ACTIVE" ? "default" : "destructive"}
                        className="text-[10px] h-4"
                      >
                        {u.status}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hospital Accounts (Platform Admin Only)</CardTitle>
          <CardDescription>Verify and activate hospital accounts</CardDescription>
        </CardHeader>
        <CardContent>
          {hospitalUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hospital accounts found.</p>
          ) : (
            <ul className="space-y-3">
              {hospitalUsers.map((h) => (
                <li
                  key={h.id}
                  className="flex flex-col gap-2 rounded-md border border-border px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium flex items-center gap-2">
                      {h.name}
                      {h.id === "admin-seed" && <Badge variant="outline">System Admin</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {h.email} · {h.licenseNumber ?? "No license"}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={STATUS_BADGE_VARIANT[h.status] ?? "outline"}>{h.status}</Badge>
                    <Select
                      defaultValue={h.status}
                      onValueChange={(v) => handleStatusChange(h.id, v)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">PENDING</SelectItem>
                        <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                        <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {statusFeedback[h.id] && (
                    <p className="text-xs text-green-700 dark:text-green-300 sm:col-span-full">
                      {statusFeedback[h.id]}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patient Accounts</CardTitle>
          <CardDescription>
            {patientUsers.length} patient account{patientUsers.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {patientUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No patient accounts yet.</p>
          ) : (
            <ul className="space-y-3">
              {patientUsers.map((patient) => (
                <li
                  key={patient.id}
                  className="flex flex-col gap-2 rounded-md border border-border px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-xs text-muted-foreground">{patient.email}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={PLAN_BADGE_VARIANT[patient.eligibilityPlan ?? "BASIC"]}>
                      {patient.eligibilityPlan ?? "BASIC"}
                    </Badge>
                    <Select
                      defaultValue={patient.eligibilityPlan ?? "BASIC"}
                      onValueChange={(v) => handlePlanChange(patient.id, v)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Change plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BASIC">BASIC</SelectItem>
                        <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                        <SelectItem value="EXPIRED">EXPIRED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {planFeedback[patient.id] && (
                    <p className="text-xs text-green-700 dark:text-green-300 sm:col-span-full">
                      {planFeedback[patient.id]}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
