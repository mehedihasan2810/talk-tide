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

// form schema starts -----------
export const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});
// form schema ends ------------

export default function Login() {
  // useForm starts ------------
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  // useForm ends ----------

  function onSubmit(_values: z.infer<typeof formSchema>) {
    // console.log(values);

    //reset form
    form.reset();
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
                  <Link 
                  data-testid="login-link"
                    href="register"
                    className="text-emerald-500 hover:text-emerald-400 underline"
                  >
                    Register
                  </Link>
                </FormDescription>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full h-11 text-base bg-emerald-700 hover:bg-emerald-800"
          >
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
}
