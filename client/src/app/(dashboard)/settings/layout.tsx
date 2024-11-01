"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { styles } from "@/lib/style";

const settingsLinks = [
  { name: "Profile", path: "/settings/profile" },
  { name: "Account", path: "/settings/account" },
  { name: "Notifications", path: "/settings/notifications" },
  { name: "Appearance", path: "/settings/appearance" },
];
export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col lg:flex-row">
      <div className="w-full lg:max-w-[280px] xl:max-w-[340px]">
        <ul className="mt-5 lg:mt-24 px-3 space-y-2 font-medium">
          {settingsLinks.map((item, index) => (
            <li key={index}>
              <Link
                href={item.path}
                className={`flex items-center space-x-4 p-3 rounded-[6px] cursor-pointer ${
                  pathname === item.path
                    ? `${styles.activeLink}`
                    : `${styles.hoverLink}`
                }`}
              >
                <span className="text-lg">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full h-screen px-4">{children}</div>
    </div>
  );
}
