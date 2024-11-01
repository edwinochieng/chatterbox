import React from "react";

interface Props {
  title: string;
  description: string;
}
export default function MainNavbar({ title, description }: Props) {
  return (
    <div className="border border-t-transparent border-x-transparent pt-8 pb-5">
      <h1 className="font-semibold text-2xl ">{title}</h1>
      <p className="font-normal text-[14px] leading-[18px] text-gray-500 dark:text-gray-300 mt-2">
        {description}
      </p>
    </div>
  );
}
