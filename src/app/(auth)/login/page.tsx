"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

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

  const submitHandler = async ({ email, password }: LoginInputs) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result!.error) {
        toast.error(result!.error);
      } else {
        router.push("/chats");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="max-w-[700px] mx-auto">
      <form
        className="bg-white  mt-24 lg:mt-12 mb-0 space-y-4 rounded-xl py-8 px-3 sm:px-8 shadow-2xl"
        onSubmit={handleSubmit(submitHandler)}
      >
        <p className="text-lg font-medium">Log in to your account</p>

        <div>
          <label htmlFor="email" className="text-sm font-medium">
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
              className="w-full rounded-lg border border-gray-200 p-3 sm:p-4 pr-12 text-sm focus:outline-indigo-500"
              placeholder="Enter email"
            />
            {errors.email && (
              <span className="text-red-500 pt-1">{errors.email.message}</span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>

          <div className="relative mt-1">
            <input
              {...register("password", {
                required: "Please enter your password",
              })}
              type="password"
              id="password"
              className="w-full rounded-lg border border-gray-200 p-3 sm:p-4 pr-12 text-sm focus:outline-indigo-500"
              placeholder="Enter password"
            />
            {errors.password && <span>{errors.password.message}</span>}
          </div>
        </div>

        <button
          type="submit"
          className="block w-full rounded-lg bg-indigo-500 px-5 py-3 text-sm font-medium text-white"
        >
          Sign in
        </button>

        <p className="text-center text-sm text-gray-500">
          No account?
          <Link className="pl-0.5 underline text-indigo-500" href="/signup">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
