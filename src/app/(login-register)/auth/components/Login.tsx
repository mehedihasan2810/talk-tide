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
  ArrowPathIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { signIn, useSession } from "next-auth/react";
import { LoginSchema } from "@/utils/zod-schema/loginSchema";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  updateIsLogin(): void;
}

export default function Login({ updateIsLogin }: Props) {
  const [error, setError] = useState<string | null | undefined>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const session = useSession();

  // useForm
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LoginSchema>) {

    // if user is already logged in then don't proceed. return with a message
    if (session.data) {
      setError("You are already logged in");
      return;
    }

    setIsLoading(true); // track log in loading states

    // log in the user with required credentials
    const res = await signIn("credentials", {
      redirect: false,
      authType: "login",
      ...values,
    });
    setIsLoading(false); 

    // if login is not successful then show a error message
    if (!res?.ok || res.error) {
      setError(res?.error);
    } else {
      //  if the login successful then reset the form and redirect the user to chat page
      form.reset();
      router.replace("/chat");
    }
  }

  return (
    <div className="grid h-screen w-screen place-items-center">
      <Form {...form}>
        <form
          data-testid="login-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-80 space-y-5"
        >
          {/* header starts */}
          <div className="mb-8 flex items-center justify-center gap-1 text-primary">
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
              Login
            </h2>
            <LockClosedIcon className="h-7 w-7" />
          </div>
          {/* header ends */}

          {/* Alert starts */}
          {error && (
            <Alert variant="destructive" className="relative">
              <button
                onClick={() => setError(null)}
                className="absolute right-2 top-1 rounded-full bg-rose-50 p-1"
                type="button"
              >
                <XMarkIcon className="h-5 w-5" />
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
                    className="h-11 border-primary/40 text-base focus-visible:ring-primary"
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
                    className="h-11 border-primary/40 text-base focus-visible:ring-primary"
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
                    className="text-primary underline hover:text-primary/70"
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
            className="h-11 w-full text-base"
          >
            {isLoading && (
              <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
            )}{" "}
            Login
          </Button>
          {/* <button
            type="button"
            onClick={() => {
              signOut();
            }}
          >
            logout
          </button> */}
        </form>
      </Form>
    </div>
  );
}
