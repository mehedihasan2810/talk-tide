"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
import { signIn, signOut, useSession } from "next-auth/react";
import { LoginSchema } from "@/utils/zod-schema/loginSchema";
import { useState } from "react";

interface Props {
  updateIsLogin(): void;
}

export default function Login({ updateIsLogin }: Props) {
  const [error, setError] = useState<string | null | undefined>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const session = useSession();
  console.log(session);

  // useForm starts ------------
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  // useForm ends ----------

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    console.log(values);

    if (session.data) {
      setError("You are already logged in");
      return;
    }

    setIsLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      authType: "login",
      ...values,
    });
    setIsLoading(false);

    if (!res?.ok || res.error) {
      setError(res?.error);
    } else {
      form.reset();
    }

    console.log("returned login result ", res);
  }

  return (
    <div className="w-screen h-screen grid place-items-center">
      <Form {...form}>
        <form
          data-testid="login-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 w-80"
        >
          {/* header starts */}
          <div className="flex justify-center items-center gap-1 text-emerald-700 mb-8">
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
              Login
            </h2>
            <LockClosedIcon className="w-7 h-7" />
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    data-testid="login-username"
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
                    data-testid="login-password"
                    type="password"
                    placeholder="Enter your password..."
                    {...field}
                    className="h-11 text-base focus-visible:ring-emerald-500 border-gray-300"
                  />
                </FormControl>

                <FormMessage />
                <FormDescription className="text-center">
                  Don&#39;t have an account?{" "}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={updateIsLogin}
                    data-testid="login-link"
                    className="text-emerald-500 hover:text-emerald-400 underline"
                  >
                    Register
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
            {isLoading ? "Login..." : "Login"}
          </Button>
          <button type="button" onClick={() => signOut()}>
            logout
          </button>
        </form>
      </Form>
    </div>
  );
}
