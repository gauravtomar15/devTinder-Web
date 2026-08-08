import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL, getProfileImageUrl } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [connections, setConnections] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [onlineStatusMap, setOnlineStatusMap] = useState({});
  const [showUserDetailSidebar, setShowUserDetailSidebar] = useState(false);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const userId = user?._id;
  const firstName = user?.firstName;

  // Fetch connections for sidebar
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", { withCredentials: true });
      setConnections(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch connections", err);
    }
  };

  // Fetch active chat messages and target user details
  const fetchChatMessages = async () => {
    if (!targetUserId) return;
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL + "/chat/" + targetUserId, { withCredentials: true });
      setMessages(res?.data?.messages || []);
      setTargetUser(res?.data?.targetUser || null);

      // Mark messages as read on load
      if (socketRef.current && res?.data?.messages) {
        const unreadMessageIds = res.data.messages
          .filter((msg) => !msg.isMine && msg.status !== "read")
          .map((msg) => msg._id || msg.id);

        if (unreadMessageIds.length > 0) {
          socketRef.current.emit("markMessagesAsRead", {
            userId,
            targetUserId,
            messageIds: unreadMessageIds,
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch chat messages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  useEffect(() => {
    fetchChatMessages();
  }, [targetUserId]);

  // Set up socket connection
  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    // Authenticate user in socket map
    socket.emit("authenticate", { userId });

    if (targetUserId) {
      socket.emit("joinChat", { userId, targetUserId });
    }

    // Handlers
    socket.on("receiveMessage", (payload) => {
      // Only append if the message is from/to the current targetUserId
      const senderIdStr = payload.senderId?.toString();
      const targetIdStr = targetUserId?.toString();
      const userIdStr = userId?.toString();

      const isForCurrentChat = targetUserId && 
        (senderIdStr === targetIdStr || senderIdStr === userIdStr);

      if (isForCurrentChat) {
        setMessages((prev) => {
          const alreadyExists = prev.some((m) => (m._id || m.id) === (payload._id || payload.id));
          if (alreadyExists) return prev;
          return [
            ...prev,
            {
              ...payload,
              isMine: senderIdStr === userIdStr,
            },
          ];
        });

        // Mark received message as read if chat is currently open
        if (senderIdStr === targetIdStr) {
          socket.emit("markMessagesAsRead", {
            userId,
            targetUserId,
            messageIds: [payload._id || payload.id],
          });
        }
      }
    });

    socket.on("typing:update", ({ userId: senderId, isTyping }) => {
      if (senderId === targetUserId) {
        setOtherUserTyping(isTyping);
      }
    });

    socket.on("message:status", ({ userId: updaterUserId, status, messageIds }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (!msg.isMine) return msg;
          if (messageIds && messageIds.length) {
            if (messageIds.includes(msg._id || msg.id)) {
              return { ...msg, status };
            }
          } else {
            if (status === "read" && msg.status !== "read") {
              return { ...msg, status, readAt: new Date().toISOString() };
            }
            if (status === "delivered" && msg.status === "sent") {
              return { ...msg, status, deliveredAt: new Date().toISOString() };
            }
          }
          return msg;
        })
      );
    });

    socket.on("presence:update", ({ userId: presenceUserId, online, lastSeen }) => {
      setOnlineStatusMap((prev) => ({
        ...prev,
        [presenceUserId]: { online, lastSeen },
      }));
    });

    socket.on("presence:initial", (onlineIds) => {
      setOnlineStatusMap((prev) => {
        const nextMap = { ...prev };
        onlineIds.forEach((id) => {
          nextMap[id] = { online: true, lastSeen: null };
        });
        return nextMap;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  // Handle typing status emitting
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    if (!socketRef.current || !targetUserId) return;

    if (!isTyping) {
      setIsTyping(true);
      socketRef.current.emit("typing", { userId, targetUserId, isTyping: true });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketRef.current.emit("typing", { userId, targetUserId, isTyping: false });
    }, 2000);
  };

  // Send message
  const sendMessage = () => {
    if (!newMessage.trim() || !socketRef.current || !targetUserId) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      setIsTyping(false);
      socketRef.current.emit("typing", { userId, targetUserId, isTyping: false });
    }

    socketRef.current.emit("sendMessage", {
      firstName,
      userId,
      targetUserId,
      text: newMessage.trim(),
    });
    
    setNewMessage("");
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, otherUserTyping]);

  // Filter connections by search query
  const filteredConnections = useMemo(() => {
    return connections.filter((conn) => {
      const fullName = `${conn.firstName || ""} ${conn.lastName || ""}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });
  }, [connections, searchQuery]);

  // Get recipient online state
  const isRecipientOnline = useMemo(() => {
    if (!targetUserId) return false;
    return onlineStatusMap[targetUserId]?.online || false;
  }, [targetUserId, onlineStatusMap]);

  return (
    <div className={`grid h-full w-full grid-cols-1 overflow-hidden bg-slate-900/40 backdrop-blur-xl transition-all duration-300 ${
      showUserDetailSidebar && targetUser 
        ? "md:grid-cols-[340px_1fr_320px]" 
        : "md:grid-cols-[340px_1fr]"
    }`}>
      {/* Sidebar Panel */}
      <div className={`flex flex-col border-r border-white/10 bg-slate-950/40 ${targetUserId ? "hidden md:flex" : "flex"}`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white mb-3">Chats</h2>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search developers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-400 outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
            />
          </div>
        </div>

        {/* Connections List */}
        <div className="flex-1 overflow-y-auto p-2 pt-2 pb-4 space-y-1">
          {filteredConnections.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              No active connections found.
            </div>
          ) : (
            filteredConnections.map((conn) => {
              const isSelected = conn._id === targetUserId;
              const onlineStatus = onlineStatusMap[conn._id]?.online;
              return (
                <Link
                  key={conn._id}
                  to={`/chat/${conn._id}`}
                  className={`flex items-center gap-3 rounded-2xl p-3 transition-all duration-200 ${
                    isSelected
                      ? "bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-white/10 shadow-lg text-white"
                      : "hover:bg-white/5 text-slate-300"
                  }`}
                >
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <img
                      src={getProfileImageUrl(conn.photoUrl)}
                      alt={conn.firstName}
                      className="h-12 w-12 rounded-full object-cover border border-white/10 aspect-square"
                    />
                    <span
                      className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-slate-900 ${
                        onlineStatus ? "bg-emerald-400" : "bg-slate-500"
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="truncate text-sm font-semibold text-white flex items-center gap-1">
                        {conn.firstName} {conn.lastName}
                        {conn.isPremium && (
                          <svg className="h-4 w-4 text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                    </div>
                    <p className="truncate text-xs text-slate-400 mt-0.5">
                      {conn.about || "Click to start conversation"}
                    </p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area Panel */}
      <div className={`flex flex-col overflow-hidden bg-slate-900/10 ${!targetUserId ? "hidden md:flex items-center justify-center" : "flex"}`}>
        {targetUserId ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/30 px-4 py-3 sm:px-6 min-h-[76px] flex-shrink-0">
              <div className="flex items-center gap-3">
                <Link to="/chat" className="md:hidden text-slate-400 hover:text-white mr-1 flex-shrink-0">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <div 
                  onClick={() => setShowUserDetailSidebar(!showUserDetailSidebar)}
                  className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
                  title="Click to view developer profile info"
                >
                  <div className="relative h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0">
                    <img
                      src={getProfileImageUrl(targetUser?.photoUrl)}
                      alt={targetUser?.firstName || "User"}
                      className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover border border-white/10 aspect-square"
                    />
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-900 ${
                        isRecipientOnline ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                      }`}
                    />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1">
                      {targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : "Loading..."}
                      {targetUser?.isPremium && (
                        <svg className="h-4.5 w-4.5 text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </h2>
                    <p className="text-[11px] sm:text-xs text-slate-400">
                      {isRecipientOnline ? "Active now" : "Offline"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 space-y-3.5 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.06),_transparent_45%)] px-4 py-5 sm:px-6">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="loading loading-spinner text-cyan-400"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <div className="max-w-sm text-center">
                    <p className="text-base font-semibold text-white">Wave hello 👋</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Send a message to start collaboration with {targetUser?.firstName || "developer"}.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMine = msg.isMine;
                  const timeString = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
                  return (
                    <div key={msg._id || msg.id || index} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                      <div className={`max-w-[85%] rounded-[20px] px-4 py-2.5 text-sm shadow-md sm:max-w-[70%] ${
                        isMine 
                          ? "rounded-tr-sm bg-gradient-to-r from-cyan-500 to-violet-500 text-white" 
                          : "rounded-tl-sm border border-white/10 bg-slate-800/80 text-slate-100"
                      }`}>
                        <p className="leading-6 break-words whitespace-pre-wrap">{msg.text}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-slate-500">
                        <span>{timeString}</span>
                        {isMine && (
                          <span className={msg.status === "read" ? "text-cyan-400 font-semibold" : ""}>
                            {msg.status === "read" ? "✓✓" : msg.status === "delivered" ? "✓✓" : "✓"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              {otherUserTyping && (
                <div className="flex flex-col items-start animate-pulse">
                  <div className="rounded-[20px] rounded-tl-sm border border-white/5 bg-slate-800/40 px-4 py-2.5 text-xs text-slate-400">
                    {targetUser?.firstName} is typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="border-t border-white/10 bg-slate-950/20 px-4 py-3 sm:px-6 flex-shrink-0">
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/60 px-2 py-1.5 focus-within:border-cyan-500/30">
                <input
                  value={newMessage}
                  onChange={handleInputChange}
                  type="text"
                  placeholder={`Write a message to ${targetUser?.firstName || "developer"}...`}
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder-slate-400"
                  onKeyDown={(event) => event.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="flex h-9 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 text-xs font-semibold text-white shadow-md shadow-cyan-500/10 transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-md px-6 text-center animate-float-in">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/80 border border-white/10 text-cyan-400">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Your Developer Inbox</h3>
            <p className="mt-2 text-sm text-slate-400">
              Select an active connection from the left sidebar panel to start chatting, coordinate, and review code projects.
            </p>
          </div>
        )}
      </div>

      {/* Right User Detail Sidebar (WhatsApp Web style drawer) */}
      {showUserDetailSidebar && targetUser && (
        <div className="hidden lg:flex flex-col border-l border-white/10 bg-slate-950/50 w-[320px] h-full overflow-hidden animate-float-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/30 px-4 py-4 min-h-[76px] flex-shrink-0">
            <h3 className="text-base font-bold text-white">Developer Details</h3>
            <button 
              onClick={() => setShowUserDetailSidebar(false)}
              className="text-slate-400 hover:text-white transition"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable details */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Big Avatar */}
            <div className="flex flex-col items-center text-center">
              <img 
                src={getProfileImageUrl(targetUser.photoUrl)} 
                alt={targetUser.firstName} 
                className="h-24 w-24 rounded-full object-cover border border-white/15 shadow-xl aspect-square"
              />
              <h4 className="mt-4 text-base font-bold text-white flex items-center gap-1 justify-center">
                {targetUser.firstName} {targetUser.lastName}
                {targetUser.isPremium && (
                  <svg className="h-4.5 w-4.5 text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </h4>
              <p className="text-[10px] text-cyan-300 mt-1 uppercase tracking-widest font-semibold">
                {targetUser.gender || "Developer"} {targetUser.age ? `• ${targetUser.age} yrs` : ""}
              </p>
            </div>

            {/* About Section */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">About</span>
              <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4">
                <p className="text-sm leading-6 text-slate-200 break-words whitespace-pre-wrap">
                  {targetUser.about || "Hey there! I am using DevTinder."}
                </p>
              </div>
            </div>

            {/* Skills Section */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Skills</span>
              <div className="flex flex-wrap gap-2">
                {targetUser.skills && targetUser.skills.length > 0 ? (
                  targetUser.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="rounded-full border border-white/5 bg-white/5 px-3 py-1 text-xs text-slate-200"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  ["React", "Node.js", "MongoDB", "Express"].map((skill) => (
                    <span 
                      key={skill} 
                      className="rounded-full border border-white/5 bg-white/5 px-3 py-1 text-xs text-slate-300/80"
                    >
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
