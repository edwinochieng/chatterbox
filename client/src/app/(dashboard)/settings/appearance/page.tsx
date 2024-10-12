"use client";

import MainNavbar from "@/components/MainNavbar";
import { useTheme } from "@/context/ThemeContext";
import { styles } from "@/lib/style";

export default function AppearanceSettings() {
  const { activeTheme, toggleDarkMode, toggleLightMode } = useTheme();
  return (
    <div>
      <MainNavbar
        title="Appearance"
        description="Customize the appearance of the app. Automatically switch between day and night themes."
      />
      <div className="pt-12">
        <div>
          <h1 className="font-semibold text-xl">Theme</h1>
          <p className={styles.description}>
            Select the theme for the dashboard.
          </p>
        </div>

        <div className="mt-8 flex flex-row space-x-3">
          {/**Light mode */}
          <div>
            <div
              onClick={toggleLightMode}
              className={`items-center cursor-pointer rounded-xl border-[3px]  p-1  ${
                activeTheme === "light"
                  ? "border-gray-700"
                  : "border-secondaryBg"
              }`}
            >
              <div className="space-y-2 rounded-[8px] bg-[#ecedef] p-2">
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
              className={`items-center cursor-pointer rounded-xl border-[3px]  p-1  ${
                activeTheme === "dark" ? "border-gray-100 " : "border-primaryBg"
              }`}
            >
              <div className="space-y-2 rounded-[8px] bg-slate-950 p-2">
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
