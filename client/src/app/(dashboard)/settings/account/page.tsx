"use client";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "react-hot-toast";
import React from "react";
import MainNavbar from "@/components/MainNavbar";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const FormSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export default function AccountSettings() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof FormSchema>) => {
      return axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/account-settings`,
        data
      );
    },
    onSuccess: () => {
      toast.success("Account details updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.msg || "Something went wrong!");
    },
  });
  const submitHandler = async (data: z.infer<typeof FormSchema>) => {
    mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div>
      <MainNavbar title="Account" description="Update your account settings." />
      <div className="pt-12">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Your password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="text-white bg-black rounded-lg hover:bg-black/70"
              disabled={isPending}
            >
              {isPending ? "Updating.." : "Update Account Details"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
