"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FaCog, FaUserFriends } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";
import { RiMessage3Fill } from "react-icons/ri";
import { FiMenu } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useSocket } from "@/context/SocketContext";
import { Socket } from "socket.io-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { styles } from "@/lib/style";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { setActiveChat } from "@/store/chatSlice";

const sidebarLinks = [
  {
    name: "Messages",
    path: "/chats",
    route: "/chats",
    icon: <RiMessage3Fill size={24} />,
  },

  {
    name: "Discover",
    path: "/discover",
    route: "/discover",
    icon: <IoPersonAdd size={24} />,
  },
  {
    name: "Friends",
    path: "/friends",
    route: "/friends",
    icon: <FaUserFriends size={24} />,
  },

  {
    name: "Settings",
    path: "/settings",
    route: "/settings/profile",
    icon: <FaCog size={24} />,
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();
  const dispatch: AppDispatch = useDispatch();
  const socket = useSocket() as Socket & {
    handshake: { query: { userId: string } };
  };
  const router = useRouter();

  const handleLogOut = () => {
    if (socket) {
      socket.emit("userOffline", { userId: socket.handshake?.query.userId });
      socket.disconnect();
    }
    logout();
    dispatch(setActiveChat(null));
    router.push("/login");
  };
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
            className="p-2 focus:outline-none hover:bg-accentBg rounded-[6px]"
          >
            <FiMenu size={24} />
          </button>

          <ul className="mt-24 space-y-2 font-medium">
            {sidebarLinks.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.route}
                  className={`flex items-center space-x-4 py-4 px-2 rounded-[6px] cursor-pointer ${
                    pathname === item.path ||
                    pathname.startsWith(`${item.path}/`)
                      ? `${styles.activeLink}`
                      : `${styles.hoverLink}`
                  }`}
                >
                  <div>{item.icon}</div>
                  {isOpen && <span className="text-lg">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
          <div className="absolute bottom-8 w-full">
            <Dialog>
              <DialogTrigger className="w-full">
                <div className="flex items-center space-x-4 py-4 px-2 hover:bg-accentBg rounded-[6px] font-semibold cursor-pointer">
                  <MdLogout size={24} />
                  {isOpen && <span className="text-lg">Log out</span>}
                </div>
              </DialogTrigger>
              <DialogContent className={styles.card}>
                <DialogHeader>
                  <DialogTitle onClick={handleLogOut} className="text-xl">
                    Are you absolutely sure?
                  </DialogTitle>
                  <DialogDescription className="text-sm dark:text-gray-300">
                    Logging out will temporarily hide chat history. To see it
                    again, log back in.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-base"
                    >
                      Close
                    </Button>
                  </DialogClose>
                  <Button
                    type="button"
                    onClick={handleLogOut}
                    className="text-base"
                  >
                    Log out
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
