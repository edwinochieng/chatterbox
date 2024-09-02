"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FaCog, FaUserFriends } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";
import { RiMessage3Fill } from "react-icons/ri";
import { FiMenu } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const sidebarLinks = [
  {
    name: "Messages",
    path: "/chats",
    icon: <RiMessage3Fill size={24} />,
  },

  {
    name: "Discover",
    path: "/discover",
    icon: <IoPersonAdd size={24} />,
  },
  {
    name: "Friends",
    path: "/friends",
    icon: <FaUserFriends size={24} />,
  },

  {
    name: "Settings",
    path: "/settings/profile",
    icon: <FaCog size={24} />,
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Desktop Sidebar */}
      <div
        className={`fixed top-0 bottom-0 left-0 h-screen bg-primary p-2 text-secondary border border-y-transparent border-l-transparent border-r-gray-200 z-10 hidden
        md:relative  md:block ${isOpen ? "w-[200px]" : "w-full"}`}
      >
        <div className="h-full relative">
          <button
            onClick={toggleSidebar}
            className="p-2 focus:outline-none hover:bg-indigo-100 rounded-[6px]"
          >
            <FiMenu size={24} />
          </button>

          <ul className="mt-24 space-y-2 font-medium">
            {sidebarLinks.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.path}
                  className={`flex items-center space-x-4 py-4 px-2 hover:bg-indigo-100 rounded-[6px] cursor-pointer ${
                    pathname === item.path ||
                    pathname.startsWith(`${item.path}/`)
                      ? "bg-indigo-200"
                      : "bg-transparent"
                  }`}
                >
                  <div>{item.icon}</div>
                  {isOpen && <span className="text-lg">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="absolute bottom-8 w-full">
            <li
              className="flex items-center space-x-4 py-4 px-2 hover:bg-indigo-100 rounded-[6px] font-semibold cursor-pointer"
              onClick={() => signOut()}
            >
              <MdLogout size={24} />
              {isOpen && <span className="text-lg">Log out</span>}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
