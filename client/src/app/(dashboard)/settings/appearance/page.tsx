"use client";

import MainNavbar from "@/components/MainNavbar";
import { useEffect, useState } from "react";

export default function AppearanceSettings() {
  const [activeTheme, setActiveTheme] = useState("light");

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleLightMode = () => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  };
  const toggleDarkMode = () => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    setActiveTheme("dark");
  };

  return (
    <div>
      <MainNavbar
        title="Appearance"
        description="Customize the appearance of the app. Automatically switch between day and night themes."
      />
      <div className="pt-12">
        <div>
          <h1 className="font-semibold text-xl">Theme</h1>
          <p>Select the theme for the dashboard.</p>
        </div>

        <div className="mt-8 flex flex-row space-x-3">
          {/**Light mode */}
          <div>
            <div
              onClick={toggleLightMode}
              className={`items-center cursor-pointer rounded-lg border-2  p-1  ${
                activeTheme === "light" ? "border-gray-950" : "border-gray-50"
              }`}
            >
              <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                <div className="space-y-2 rounded-lg bg-white p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
                <div className="flex items-center space-x-2 rounded-lg bg-white p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
                <div className="flex items-center space-x-2 rounded-lg bg-white p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
              </div>
            </div>
            <span className="block w-full p-2 text-center font-normal">
              Light
            </span>
          </div>
          {/**Dark mode */}
          <div>
            <div
              onClick={toggleDarkMode}
              className={`items-center cursor-pointer rounded-lg border-2  p-1  ${
                activeTheme === "dark" ? "border-gray-950 " : "border-gray-50"
              }`}
            >
              <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                <div className="space-y-2 rounded-lg bg-slate-800 p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-lg bg-slate-800 p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-slate-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-lg bg-slate-800 p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-slate-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
              </div>
            </div>
            <span className="block w-full p-2 text-center font-normal">
              Dark
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
