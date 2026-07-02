import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/store/authStore";
import { useUserAccountsStore } from "@/store/userAccountsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const registerSchema = z.object({
  name: z.string().min(1, "Hospital name is required"),
  email: z.string().email("Enter a valid email address"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  hospitalType: z.string().min(1, "Hospital type is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

function LoginForm() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginValues) => {
    setServerError(null);
    const result = login({
      email: data.email,
      password: data.password,
      allowAdmin: true,
    });
    if (!result.success) {
      setServerError(result.error ?? "Sign in failed.");
      return;
    }

    navigate({ to: "/admin/dashboard" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="admin@mediflow.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>
      {serverError && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverError}
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        Sign in
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Default: admin@mediflow.com / admin1234
      </p>
    </form>
  );
}

function RegisterForm() {
  const navigate = useNavigate();
  const registerUser = useAuthStore((s) => s.register);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      hospitalType: "general",
    },
  });

  const onSubmit = (data: RegisterValues) => {
    setServerError(null);
    const result = registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
      role: "admin",
      phoneNumber: data.phoneNumber,
      address: data.address,
      licenseNumber: data.licenseNumber,
      hospitalType: data.hospitalType,
    });
    if (!result.success) {
      setServerError(result.error ?? "Registration failed.");
      return;
    }
    toast.success(
      "Hospital registered successfully! Please sign in once verified.",
    );
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="reg-name">Hospital Name</Label>
          <Input
            id="reg-name"
            type="text"
            placeholder="St. Mary's Hospital"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="reg-email">Email</Label>
          <Input
            id="reg-email"
            type="email"
            placeholder="admin@hospital.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="reg-phone">Phone Number</Label>
          <Input
            id="reg-phone"
            type="tel"
            placeholder="+234..."
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <p className="text-xs text-destructive">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="reg-license">License Number</Label>
          <Input
            id="reg-license"
            type="text"
            placeholder="HOS-12345"
            {...register("licenseNumber")}
          />
          {errors.licenseNumber && (
            <p className="text-xs text-destructive">
              {errors.licenseNumber.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="reg-address">Address</Label>
        <Input
          id="reg-address"
          type="text"
          placeholder="123 Health St, Lagos"
          {...register("address")}
        />
        {errors.address && (
          <p className="text-xs text-destructive">{errors.address.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label>Hospital Type</Label>
        <Controller
          name="hospitalType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="specialist">Specialist</SelectItem>
                <SelectItem value="teaching">Teaching</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.hospitalType && (
          <p className="text-xs text-destructive">
            {errors.hospitalType.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="reg-password">Password</Label>
        <Input
          id="reg-password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      {serverError && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverError}
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        Register Hospital
      </Button>
    </form>
  );
}

export function AdminAuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
            Z
          </div>
          <CardTitle className="text-2xl">Hospital Portal</CardTitle>
          <CardDescription>
            Register or sign in to manage your hospital
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="login" className="flex-1">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="flex-1">
                Register
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
