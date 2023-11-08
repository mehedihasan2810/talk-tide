"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ExclamationTriangleIcon,
  LockClosedIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { signIn, useSession } from "next-auth/react";
import { RegisterSchema } from "@/utils/zod-schema/registerSchema";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

interface Props {
  updateIsLogin(): void;
}

export default function Register({ updateIsLogin }: Props) {
  const [error, setError] = useState<string | null | undefined>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const session = useSession();
  console.log(session);

  // useForm starts ------------
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });
  // useForm ends ----------

  async function onSubmit(values: z.infer<typeof RegisterSchema>) {
    console.log(values);

    if (session.data) {
      setError(
        "You are already logged in! If you want to create new account then logout first"
      );
      return;
    }
    setIsLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      // redirect: true,
      // callbackUrl: "/",
      authType: "register",
      ...values,
    });
    setIsLoading(false);

    if (!res?.ok || res.error) {
      setError(res?.error);
    } else {
      form.reset();
      router.replace("/chat");
    }
    console.log(res);
  }
  return (
    <div className="w-screen h-screen grid place-items-center">
      <Form {...form}>
        <form
          data-testid="register-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 w-80"
        >
          {/* header starts */}
          <div className="flex justify-center items-center gap-1 text-emerald-700 mb-8">
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
              Register
            </h2>
            <LockClosedIcon className="w-8 h-8" />
          </div>
          {/* header ends */}

          {/* Alert starts */}
          {error && (
            <Alert variant="destructive" className="relative">
              <button
                onClick={() => setError(null)}
                className="absolute top-1 right-2 rounded-full p-1 bg-rose-50"
                type="button"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {/* Alert ends */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter your email..."
                    {...field}
                    className="h-11 text-base focus-visible:ring-emerald-500 border-gray-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter your username..."
                    {...field}
                    className="h-11 text-base focus-visible:ring-emerald-500 border-gray-300"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password..."
                    {...field}
                    className="h-11 text-base focus-visible:ring-emerald-500 border-gray-300"
                  />
                </FormControl>

                <FormMessage />
                <FormDescription className="text-center">
                  Already have an account?{" "}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={updateIsLogin}
                    className="text-emerald-500 hover:text-emerald-400 underline"
                  >
                    Login
                  </button>
                </FormDescription>
              </FormItem>
            )}
          />
          <Button
            disabled={isLoading || session.status === "loading"}
            type="submit"
            className="w-full h-11 text-base bg-emerald-700 hover:bg-emerald-800"
          >
            {isLoading ? "Register..." : "Register"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
