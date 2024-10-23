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
import { MdEdit } from "react-icons/md";
import { toast } from "react-hot-toast";
import React, { useRef } from "react";
import MainNavbar from "@/components/MainNavbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { styles } from "@/lib/style";
import { UploadButton } from "@/lib/uploadthing";

const FormSchema = z.object({
  fullName: z.string(),
  bio: z.string().optional(),
});

export default function ProfileSettings() {
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

  const profilePicMutation = useMutation({
    mutationFn: async (profilePictureUrl: { profilePictureUrl: string }) => {
      const result = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/profile-picture`,
        profilePictureUrl,
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
      toast.success("Profile picture updated successfully!");
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

  console.log(currentUser?.imageUrl);
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
                    <FormLabel className="text-base">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your full name"
                        {...field}
                        className={styles.form}
                      />
                    </FormControl>
                    <FormDescription className={styles.description}>
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
                    <FormLabel className="text-base">Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us more about yourself"
                        {...field}
                        className={styles.form}
                      />
                    </FormControl>
                    <FormDescription className={styles.description}>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className={styles.button}
                disabled={isPending}
              >
                {isPending ? "Updating..." : "Update profile"}
              </Button>
            </form>
          </Form>
        </div>
        <div className="flex-1">
          <div className="flex flex-col items-start mb-6">
            <div>
              <Avatar className="h-[170px] w-[170px]">
                <AvatarImage
                  src={currentUser?.imageUrl || "/default-profile.jpg"}
                />
              </Avatar>
            </div>
            <div>
              <UploadButton
                className="mt-4 ut-button:bg-accentBg ut-button:ut-readying:bg-accentBg/50"
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  const url = res[0].url;
                  profilePicMutation.mutate({ profilePictureUrl: url });
                }}
                onUploadError={(error: Error) => {
                  toast.error("File upload failed");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
