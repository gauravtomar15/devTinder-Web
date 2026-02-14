import React, { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();

  const user = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const userId = user?._id;
  const firstName = user?.firstName;

  const fectChatMessages = async () => {
    
    const chat = await axios(BASE_URL + "/chat/"+ targetUserId, {withCredentials: true});

     const chatMessages = chat?.data?.messages.map((msg) => ({
    firstName: msg?.senderId?.firstName,
    text: msg.text
  }));
  
    setMessages(chatMessages);
  
  };


  useEffect(() => { 
    fectChatMessages();
  }, []);

  useEffect(() => {
    if (!userId || !targetUserId) return;
    const socket = createSocketConnection();

    socket.emit("joinChat", { firstName, userId, targetUserId });

    socket.on("receiveMessage", ({firstName, text }) => {
      
      setMessages((messages) => [...messages, { firstName, text }]);
      // setMessages([{firstName, text}])
      
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    const socket = createSocketConnection();

    socket.emit("sendMessage", {
      firstName,
      userId,
      targetUserId,
      text: newMessage
    });
    setNewMessage("");
  };
  return (
    <div className="w-full max-w-4xl h-[80vh] mx-auto border border-gray-700 
                flex flex-col rounded-2xl shadow-lg bg-gray-900">

  {/* Header */}
  <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between bg-gray-800 rounded-t-2xl ">
    <h2 className="text-lg md:text-xl font-semibold text-white">
      Chat 
    </h2>
    
  </div>

  {/* Messages */}
  <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-800 ">
    {messages.map((msg, index) => (
      <div key={index} className={"flex flex-col " + (msg.firstName === user.firstName ? "chat-end" : "chat-start")}>
        <span className="text-xs text-gray-400 mb-1 font-medium ">
          {msg?.firstName}
        </span>
        <div className="bg-gray-700 border border-gray-600 px-4 py-2 
                        rounded-xl shadow-sm text-white text-sm md:text-base">
          {msg?.text}
        </div>
      </div>
    ))}
  </div>

  {/* Input */}
  <div className="p-4 border-t border-gray-700 bg-gray-900 rounded-b-2xl">
    <div className="flex items-center gap-2">
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        type="text"
        placeholder="Type a message..."
        className="flex-1 px-4 py-3 text-sm md:text-base 
                   border border-gray-600 rounded-xl bg-gray-700 text-white
                   focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        onClick={sendMessage}
        className="px-6 py-3 bg-green-500 text-white 
                   rounded-xl hover:bg-green-600 
                   transition font-medium text-sm md:text-base"
      >
        Send
      </button>
    </div>
  </div>

</div>

  );
};

export default Chat;
