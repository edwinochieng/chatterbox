import SettingsNavbar from "@/components/SettingsNavbar";
import React from "react";

export default function AppearanceSettings() {
  return (
    <div>
      <SettingsNavbar
        title="Appearance"
        description="Customize the appearance of the app. Automatically switch between day and night themes."
      />
      <div></div>
    </div>
  );
}
