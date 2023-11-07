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
import Link from "next/link";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { signIn, useSession } from "next-auth/react";
import { RegisterSchema } from "@/utils/zod-schema/registerSchema";

interface Props {
  updateIsLogin(): void;
}

export default function Register({ updateIsLogin }: Props) {
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
    const data = await signIn("credentials", {
      redirect: false,
      // redirect: true,
      // callbackUrl: "/",
      authType: "register",
      ...values,
    });
    console.log(data);
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
                  <Link
                    onClick={updateIsLogin}
                    href="#"
                    className="text-emerald-500 hover:text-emerald-400 underline"
                  >
                    Login
                  </Link>
                </FormDescription>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full h-11 text-base bg-emerald-700 hover:bg-emerald-800"
          >
            Register
          </Button>
        </form>
      </Form>
    </div>
  );
}
