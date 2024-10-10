"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
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
import React, { useRef } from "react";
import MainNavbar from "@/components/MainNavbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const FormSchema = z.object({
  fullName: z.string(),
  bio: z.string().optional(),
});

export default function ProfileSettings() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { authTokens, currentUser, setCurrentUser } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: currentUser?.fullName,
      bio: currentUser?.bio,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      const result = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/profile-settings`,
        data,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.accessToken}`,
          },
        }
      );
      return result.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      setCurrentUser(response?.user);
      toast.success("Profile details updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.msg || "Something went wrong!");
    },
  });
  const submitHandler = async (data: z.infer<typeof FormSchema>) => {
    mutate({
      fullName: data.fullName,
      bio: data.bio,
    });
  };

  const handleButtonClick = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: any): void => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle the file upload or preview logic here
      console.log("Selected file:", file);
    }
  };
  return (
    <div>
      <MainNavbar
        title="Profile"
        description="This is how others will see you on the site"
      />
      <div className="pt-12 flex flex-col-reverse lg:flex-row ">
        <div className="flex-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitHandler)}
              className="w-2/3 space-y-6"
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
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
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us more about yourself"
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
                {isPending ? "Updating..." : "Update profile"}
              </Button>
            </form>
          </Form>
        </div>
        <div className="flex-1">
          <div className="flex flex-col justify-center">
            <div>
              <Avatar className="h-[170px] w-[170px]">
                <AvatarImage src="/profile.jpg" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="mt-4">
              <button
                onClick={handleButtonClick}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Edit Profile Pic
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
