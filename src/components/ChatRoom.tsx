import React from "react";

export default function ChatRoom() {
  return (
    <div>
      <div className="flex flex-col h-screen  ">
        {/* Navbar */}
        <div className="py-4 bg-primary">
          <nav className="text-black p-4">Chat Room</nav>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {/* Example Chat Messages */}
          <div className="mb-2">
            <div className="bg-white p-2 rounded shadow">
              <p>User 1: Hello!</p>
            </div>
          </div>
          <div className="mb-2">
            <div className="bg-white p-2 rounded shadow">
              <p>User 2: Hi there!</p>
            </div>
          </div>
          {/* Add more chat messages here */}
        </div>

        {/* Text Input */}
        <div className="bg-white p-4">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
}
