"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface SignUpInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignUpInputs>();

  const submitHandler = async ({ name, email, password }: SignUpInputs) => {
    try {
      await axios.post("/api/auth/signup", { name, email, password });

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
        <p className="text-lg font-medium">Create an account</p>

        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>

          <div className="relative mt-1">
            <input
              {...register("name", {
                required: "Please enter your name",
              })}
              type="name"
              id="name"
              className="w-full rounded-lg border border-gray-200 p-3 sm:p-4 pr-12 text-sm focus:outline-indigo-500"
              placeholder="Enter name"
            />
            {errors.name && (
              <span className="text-red-500 pt-1 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
        </div>

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
              <span className="text-red-500 pt-1 text-sm">
                {errors.email.message}
              </span>
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
                required: "Please enter password",
                minLength: {
                  value: 6,
                  message: "Password should be at least six characters",
                },
              })}
              type="password"
              id="password"
              className="w-full rounded-lg border border-gray-200 p-3 sm:p-4 pr-12 text-sm focus:outline-indigo-500"
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
          <label htmlFor="confirmPassword" className="text-sm font-medium">
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
              className="w-full rounded-lg border border-gray-200 p-3 sm:p-4 pr-12 text-sm focus:outline-indigo-500"
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
          className="block w-full rounded-lg bg-indigo-500 px-5 py-3 text-sm font-medium text-white"
        >
          Sign up
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?
          <Link className="pl-0.5 underline text-indigo-500" href="/login">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
