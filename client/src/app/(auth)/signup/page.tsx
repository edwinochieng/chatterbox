"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

interface SignUpInputs {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface UserData {
  fullName: string;
  email: string;
  password: string;
}

export default function SignUpPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignUpInputs>();
  const { login, setCurrentUser } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (newUser: UserData) => {
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/signup`,
        newUser
      );
      return result.data;
    },
    onSuccess: (response) => {
      const tokens = response?.tokens;
      const user = response?.user;
      if (tokens && user) {
        login(tokens);
        setCurrentUser(user);
        toast.success("Account created successfully!");
        router.push("/chats");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.msg || "Something went wrong!");
    },
  });

  const submitHandler = ({ fullName, email, password }: UserData) => {
    mutate({
      fullName,
      email,
      password,
    });
  };

  return (
    <div className="max-w-[700px] mx-auto">
      <form
        className="space-y-4 rounded-xl py-8 px-3 sm:px-8 shadow-2xl dark:bg-[#282828] dark:shadow-transparent"
        onSubmit={handleSubmit(submitHandler)}
      >
        <p className="text-xl font-medium">Create an account</p>

        <div>
          <label htmlFor="name" className="text-base font-medium">
            Name
          </label>

          <div className="relative mt-1">
            <input
              {...register("fullName", {
                required: "Please enter your name",
              })}
              type="name"
              id="fullName"
              className="w-full rounded-[6px] border border-gray-200 dark:border-gray-500 p-3 sm:p-4 pr-12 text-base focus:outline-indigo-500 bg-transparent "
              placeholder="Enter name"
            />
            {errors.fullName && (
              <span className="text-red-500 pt-1 text-sm">
                {errors.fullName.message}
              </span>
            )}
          </div>
        </div>

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
              className="w-full rounded-[6px] bg-transparent border border-gray-200 dark:border-gray-500 p-3 sm:p-4 pr-12 text-base focus:outline-indigo-500"
              placeholder="Enter email"
            />
            {errors.email && (
              <span className="text-red-500 pt-1 text-sm">
                {errors.email.message}
              </span>
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
                required: "Please enter password",
                minLength: {
                  value: 6,
                  message: "Password should be at least six characters",
                },
              })}
              type="password"
              id="password"
              className="w-full rounded-[6px] bg-transparent border border-gray-200 dark:border-gray-500 p-3 sm:p-4 pr-12 text-base focus:outline-indigo-500"
              placeholder="Enter password"
            />
            {errors.password && (
              <span className="text-red-500 pt-1">
                {errors.password.message}
              </span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="text-base font-medium">
            Confirm Password
          </label>

          <div className="relative mt-1">
            <input
              {...register("confirmPassword", {
                required: "Please confirm password",
                validate: (value) => value === getValues("password"),
              })}
              type="password"
              id="confirmPassword"
              className="w-full rounded-[6px] bg-transparent border border-gray-200 dark:border-gray-500 p-3 sm:p-4 pr-12 text-base focus:outline-indigo-500"
              placeholder="Confirm password"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 pt-1">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="block w-full rounded-[6px] bg-accentBg px-5 py-3 text-base font-medium text-white"
          disabled={isPending}
        >
          {isPending ? "Signing up..." : "Sign up"}
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-200">
          Already have an account?
          <Link className="pl-1 underline text-indigo-500" href="/login">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
