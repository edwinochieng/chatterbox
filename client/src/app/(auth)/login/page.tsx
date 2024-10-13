"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

interface LoginInputs {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();
  const { login, setCurrentUser } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (userData: LoginInputs) => {
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
        userData
      );
      return result.data;
    },
    onSuccess: (response) => {
      const tokens = response?.tokens;
      const user = response?.user;
      if (tokens && user) {
        login(tokens);
        setCurrentUser(user);
        router.push("/chats");
        toast.success("Logged in successfully!");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.msg || "Something went wrong!");
    },
  });
  const submitHandler = async ({ email, password }: LoginInputs) => {
    mutate({
      email,
      password,
    });
  };
  return (
    <div className="max-w-[700px] mx-auto">
      <form
        className="dark:bg-[#282828] space-y-4 rounded-xl py-8 px-3 sm:px-8 shadow-2xl dark:shadow-transparent"
        onSubmit={handleSubmit(submitHandler)}
      >
        <p className="text-xl font-medium">Log in to your account</p>

        <div>
          <label htmlFor="email" className="text-base font-medium">
            Email
          </label>

          <div className="relative mt-1">
            <input
              {...register("email", {
                required: "Please enter your email",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA_Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                  message: "Please enter valid email",
                },
              })}
              type="email"
              id="email"
              className="w-full rounded-[6px] border border-gray-200 dark:border-gray-500 p-3 sm:p-4 pr-12 text-base focus:outline-accentBg bg-transparent"
              placeholder="Enter email"
            />
            {errors.email && (
              <span className="text-red-500 pt-1">{errors.email.message}</span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="text-base font-medium">
            Password
          </label>

          <div className="relative mt-1">
            <input
              {...register("password", {
                required: "Please enter your password",
              })}
              type="password"
              id="password"
              className="w-full rounded-[6px] border border-gray-200 dark:border-gray-500 p-3 sm:p-4 pr-12 text-base focus:outline-accentBg bg-transparent"
              placeholder="Enter password"
            />
            {errors.password && <span>{errors.password.message}</span>}
          </div>
        </div>

        <button
          type="submit"
          className="block w-full rounded-[6px] bg-accentBg px-5 py-3 text-base font-medium text-white"
          disabled={isPending}
        >
          {isPending ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-200">
          No account?
          <Link className="pl-1 underline text-indigo-500" href="/signup">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
