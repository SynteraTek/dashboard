import { useState, useRef, useEffect } from "react";
import { Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, Pin, Users, Hash, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  sender: string;
  initials: string;
  content: string;
  time: string;
  isOwn: boolean;
  reactions?: { emoji: string; count: number }[];
}

interface Channel {
  id: string;
  name: string;
  type: "channel" | "dm";
  initials?: string;
  unread: number;
  online?: boolean;
  lastMessage: string;
  lastTime: string;
}

const channels: Channel[] = [
  { id: "1", name: "general", type: "channel", unread: 3, lastMessage: "Deployment completed successfully", lastTime: "2m" },
  { id: "2", name: "integrations", type: "channel", unread: 0, lastMessage: "Salesforce connector updated", lastTime: "15m" },
  { id: "3", name: "incidents", type: "channel", unread: 1, lastMessage: "Queue processor latency spike resolved", lastTime: "32m" },
  { id: "4", name: "deployments", type: "channel", unread: 0, lastMessage: "v2.4.1 rolled out to production", lastTime: "1h" },
  { id: "5", name: "Sarah Chen", type: "dm", initials: "SC", unread: 2, online: true, lastMessage: "Can you check the API logs?", lastTime: "5m" },
  { id: "6", name: "James Rodriguez", type: "dm", initials: "JR", unread: 0, online: true, lastMessage: "PR merged, deploying now", lastTime: "20m" },
  { id: "7", name: "Emily Watson", type: "dm", initials: "EW", unread: 0, online: false, lastMessage: "Will review tomorrow", lastTime: "3h" },
  { id: "8", name: "Michael Park", type: "dm", initials: "MP", unread: 0, online: false, lastMessage: "Thanks for the update", lastTime: "5h" },
];

const initialMessages: Record<string, Message[]> = {
  "1": [
    { id: "m1", sender: "Sarah Chen", initials: "SC", content: "Morning team! Just pushed the new monitoring dashboard update. All services are green ✅", time: "9:15 AM", isOwn: false, reactions: [{ emoji: "👍", count: 4 }] },
    { id: "m2", sender: "James Rodriguez", initials: "JR", content: "Nice work! I noticed the Salesforce sync throughput improved by 23% after the config change", time: "9:22 AM", isOwn: false },
    { id: "m3", sender: "You", initials: "ST", content: "Great improvements all around. Let's keep monitoring the queue processor — it was showing some latency earlier", time: "9:30 AM", isOwn: true },
    { id: "m4", sender: "Emily Watson", initials: "EW", content: "I'll set up an alert for queue latency > 200ms. Should catch any issues early", time: "9:35 AM", isOwn: false, reactions: [{ emoji: "🎯", count: 2 }] },
    { id: "m5", sender: "Sarah Chen", initials: "SC", content: "Perfect. Also, the client onboarding workflow has been running flawlessly — 47 new integrations set up this week with zero failures", time: "9:42 AM", isOwn: false },
    { id: "m6", sender: "James Rodriguez", initials: "JR", content: "Deployment completed successfully. v2.4.1 is now live in production 🚀", time: "10:01 AM", isOwn: false, reactions: [{ emoji: "🚀", count: 6 }, { emoji: "🎉", count: 3 }] },
  ],
  "5": [
    { id: "d1", sender: "Sarah Chen", initials: "SC", content: "Hey, have you seen the error rate on the HubSpot connector? Spiked at 3:45 PM", time: "3:48 PM", isOwn: false },
    { id: "d2", sender: "You", initials: "ST", content: "Looking into it now. Seems like a rate limit issue on their end", time: "3:52 PM", isOwn: true },
    { id: "d3", sender: "Sarah Chen", initials: "SC", content: "Makes sense. We should implement exponential backoff for that connector", time: "3:55 PM", isOwn: false },
    { id: "d4", sender: "You", initials: "ST", content: "Already on it. I'll have a PR up in about 30 minutes", time: "3:57 PM", isOwn: true },
    { id: "d5", sender: "Sarah Chen", initials: "SC", content: "Can you check the API logs? I'm seeing some unusual patterns", time: "4:15 PM", isOwn: false },
  ],
};

export default function ChatPage() {
  const [activeChannel, setActiveChannel] = useState("1");
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeInfo = channels.find((c) => c.id === activeChannel)!;
  const currentMessages = messages[activeChannel] || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages.length, activeChannel]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: `msg-${Date.now()}`,
      sender: "You",
      initials: "ST",
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    };
    setMessages((prev) => ({ ...prev, [activeChannel]: [...(prev[activeChannel] || []), msg] }));
    setNewMessage("");

    // Simulate a reply after 2-4 seconds
    setTimeout(() => {
      const replies = [
        "Got it, I'll look into that right away.",
        "Thanks for the heads up! Updating the status now.",
        "Acknowledged. Running diagnostics on the affected systems.",
        "Interesting — let me pull up the metrics for that timeframe.",
        "Good catch. I'll create a ticket for tracking.",
      ];
      const reply: Message = {
        id: `reply-${Date.now()}`,
        sender: activeInfo.type === "dm" ? activeInfo.name : "Sarah Chen",
        initials: activeInfo.type === "dm" ? (activeInfo.initials || "??") : "SC",
        content: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOwn: false,
      };
      setMessages((prev) => ({ ...prev, [activeChannel]: [...(prev[activeChannel] || []), reply] }));
    }, 2000 + Math.random() * 2000);
  };

  const handleChannelSelect = (id: string) => {
    setActiveChannel(id);
    setShowSidebar(false);
  };

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] -m-6 rounded-none overflow-hidden relative">
      {/* Sidebar - Conversation List */}
      <div className={`
        ${showSidebar ? "flex" : "hidden md:flex"} 
        absolute inset-0 z-20 md:relative md:inset-auto md:z-0
        w-full md:w-72 border-r border-border bg-card/100 md:bg-card/50 flex flex-col shrink-0 transition-all duration-300
      `}>
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-hierarchy-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-9 bg-secondary border-border text-xs text-hierarchy-2 placeholder:text-hierarchy-4"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            <p className="text-[10px] uppercase tracking-widest text-hierarchy-4 font-display px-2 py-2">Channels</p>
            {filteredChannels.filter((c) => c.type === "channel").map((ch) => (
              <button
                key={ch.id}
                onClick={() => handleChannelSelect(ch.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors ${
                  activeChannel === ch.id && !showSidebar ? "bg-primary/15 text-hierarchy-1" : "text-hierarchy-3 hover:bg-secondary hover:text-hierarchy-2"
                }`}
              >
                <Hash className="h-4 w-4 shrink-0 text-hierarchy-4" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate">{ch.name}</span>
                    <span className="text-[10px] text-hierarchy-4">{ch.lastTime}</span>
                  </div>
                  <p className="text-[11px] text-hierarchy-4 truncate">{ch.lastMessage}</p>
                </div>
                {ch.unread > 0 && (
                  <Badge className="bg-primary text-primary-foreground text-[10px] h-5 w-5 flex items-center justify-center p-0 rounded-full">{ch.unread}</Badge>
                )}
              </button>
            ))}
            <p className="text-[10px] uppercase tracking-widest text-hierarchy-4 font-display px-2 py-2 mt-3">Direct Messages</p>
            {filteredChannels.filter((c) => c.type === "dm").map((ch) => (
              <button
                key={ch.id}
                onClick={() => handleChannelSelect(ch.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors ${
                  activeChannel === ch.id && !showSidebar ? "bg-primary/15 text-hierarchy-1" : "text-hierarchy-3 hover:bg-secondary hover:text-hierarchy-2"
                }`}
              >
                <div className="relative">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-secondary text-hierarchy-3 text-[10px]">{ch.initials}</AvatarFallback>
                  </Avatar>
                  {ch.online && <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-primary text-card stroke-[3]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate">{ch.name}</span>
                    <span className="text-[10px] text-hierarchy-4">{ch.lastTime}</span>
                  </div>
                  <p className="text-[11px] text-hierarchy-4 truncate">{ch.lastMessage}</p>
                </div>
                {ch.unread > 0 && (
                  <Badge className="bg-primary text-primary-foreground text-[10px] h-5 w-5 flex items-center justify-center p-0 rounded-full">{ch.unread}</Badge>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="h-14 flex items-center justify-between px-4 sm:px-5 border-b border-border shrink-0 bg-card/30">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Back Button */}
            <button 
              onClick={() => setShowSidebar(true)}
              className="md:hidden p-2 -ml-2 rounded-md hover:bg-secondary text-hierarchy-4 transition-colors"
            >
              <Search className="h-4 w-4 rotate-90" /> {/* Using search icon as back arrow for now or just generic back */}
            </button>
            {activeInfo.type === "channel" ? (
              <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <Hash className="h-4 w-4 text-hierarchy-3" />
              </div>
            ) : (
              <div className="relative shrink-0">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-secondary text-hierarchy-3 text-xs">{activeInfo.initials}</AvatarFallback>
                </Avatar>
                {activeInfo.online && <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-primary text-card stroke-[3]" />}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-hierarchy-1 truncate">{activeInfo.name}</h3>
              <p className="text-[10px] text-hierarchy-4 truncate">
                {activeInfo.type === "channel" ? "12 members" : activeInfo.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button className="p-2 rounded-md hover:bg-secondary text-hierarchy-4 hover:text-hierarchy-2 transition-colors hidden sm:block"><Phone className="h-4 w-4" /></button>
            <button className="p-2 rounded-md hover:bg-secondary text-hierarchy-4 hover:text-hierarchy-2 transition-colors hidden sm:block"><Video className="h-4 w-4" /></button>
            <button className="p-2 rounded-md hover:bg-secondary text-hierarchy-4 hover:text-hierarchy-2 transition-colors"><Users className="h-4 w-4" /></button>
            <button className="p-2 rounded-md hover:bg-secondary text-hierarchy-4 hover:text-hierarchy-2 transition-colors"><MoreVertical className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
          {currentMessages.length === 0 && (
            <div className="flex items-center justify-center h-full text-hierarchy-4 text-sm">
              No messages yet. Start a conversation!
            </div>
          )}
          {currentMessages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.isOwn ? "flex-row-reverse" : ""}`}>
              {!msg.isOwn && (
                <Avatar className="h-8 w-8 shrink-0 mt-1">
                  <AvatarFallback className="bg-secondary text-hierarchy-3 text-[10px]">{msg.initials}</AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-[85%] sm:max-w-[65%] ${msg.isOwn ? "items-end" : "items-start"} flex flex-col`}>
                {!msg.isOwn && <span className="text-[11px] text-hierarchy-4 mb-1 font-medium">{msg.sender}</span>}
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.isOwn
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary text-hierarchy-2 rounded-bl-md"
                }`}>
                  {msg.content}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-hierarchy-4">{msg.time}</span>
                  {msg.reactions?.map((r) => (
                    <button key={r.emoji} className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-secondary text-[10px] hover:bg-secondary/80 transition-colors">
                      {r.emoji} <span className="text-hierarchy-4">{r.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button className="p-2 rounded-md hover:bg-secondary text-hierarchy-4 hover:text-hierarchy-2 transition-colors hidden sm:block">
              <Paperclip className="h-4 w-4" />
            </button>
            <Input
              ref={inputRef}
              placeholder={`Message ${activeInfo.type === "channel" ? "#" : ""}${activeInfo.name}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              className="flex-1 h-10 bg-secondary border-border text-sm text-hierarchy-1 placeholder:text-hierarchy-4"
            />
            <button className="p-2 rounded-md hover:bg-secondary text-hierarchy-4 hover:text-hierarchy-2 transition-colors">
              <Smile className="h-4 w-4" />
            </button>
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-all shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
