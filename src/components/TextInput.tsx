import React, { useState } from "react";

export default function TextInput() {
  const [message, setMessage] = useState("");
  return (
    <div>
      <textarea
        value={message}
        placeholder="Type a message..."
        className="w-full p-2 border rounded"
        onChange={(e) => setMessage(e.target.value)}
      />
    </div>
  );
}
