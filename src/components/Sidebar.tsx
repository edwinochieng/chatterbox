"use client";
import React, { useState } from "react";
import { FaHome, FaUserAlt, FaCog } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Desktop Sidebar */}
      <div
        className={`fixed top-0 bottom-0 left-0 h-screen  bg-gray-800 p-2 text-white shadow-lg z-10 hidden
        md:relative  md:block ${isOpen ? "w-[200px]" : "w-full"}`}
      >
        <button
          onClick={toggleSidebar}
          className="p-2 focus:outline-none focus:bg-gray-700 rounded-[6px]"
        >
          <FiMenu size={24} />
        </button>
        <ul className="mt-10 space-y-4">
          <li className="flex items-center space-x-4 p-2 hover:bg-gray-700 rounded-[6px] cursor-pointer">
            <FaHome size={24} />
            {isOpen && <span className="text-lg">Home</span>}
          </li>
          <li className="flex items-center space-x-4 p-2 hover:bg-gray-700 rounded-[6px] cursor-pointer">
            <FaUserAlt size={24} />
            {isOpen && <span className="text-lg">Profile</span>}
          </li>
          <li className="flex items-center space-x-4 p-2 hover:bg-gray-700 rounded-[6px] cursor-pointer">
            <FaCog size={24} />
            {isOpen && <span className="text-lg">Settings</span>}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
