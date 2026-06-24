import { useState, useRef, useEffect } from "react";
import { CHAT_HISTORIES } from "../data/clients";
import { Send, Search, MoreVertical, Phone, Video, Paperclip, Smile } from "lucide-react";

const C = {
  bg: "#f5f7fb", card: "#ffffff", border: "#e8edf5",
  primary: "#6366f1", primaryLight: "#eff0fe",
  textPrimary: "#1e293b", textSecondary: "#64748b", textMuted: "#94a3b8",
  success: "#22c55e",
};

type Message = { id: number; from: "client" | "agent"; text: string; time: string };
type Chat = typeof CHAT_HISTORIES[number];

export function ChatPage() {
  const [activeChat, setActiveChat] = useState<Chat>(CHAT_HISTORIES[0]);
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    const map: Record<string, Message[]> = {};
    CHAT_HISTORIES.forEach(ch => { map[ch.id] = ch.messages as Message[]; });
    return map;
  });
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat.id, messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const newMsg: Message = {
      id: Date.now(), from: "agent", text,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => ({ ...prev, [activeChat.id]: [...(prev[activeChat.id] ?? []), newMsg] }));
    setInput("");
  };

  const filteredChats = CHAT_HISTORIES.filter(ch => {
    const q = search.toLowerCase();
    return !q || ch.clientName.toLowerCase().includes(q) || ch.perusahaan.toLowerCase().includes(q);
  });

  return (
    <div style={{ flex: 1, minWidth: 0, display: "flex", height: "100vh", overflow: "hidden" }}>

      {/* ── Left: Chat list ── */}
      <div style={{ width: 308, minWidth: 308, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", background: C.card }}>
        <div style={{ padding: "1.25rem 1rem 0.875rem", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem" }}>
            <div>
              <h2 style={{ fontFamily: "Inter, sans-serif", fontSize: "1.05rem", fontWeight: 700, color: C.textPrimary }}>All chats</h2>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: C.textMuted }}>
                {CHAT_HISTORIES.reduce((s, c) => s + c.unread, 0)} pesan belum dibaca
              </span>
            </div>
            <div style={{ display: "flex", gap: "0.3rem" }}>
              {["Semua", "Belum Dibaca"].map((tab, i) => (
                <button key={tab} style={{
                  padding: "0.22rem 0.55rem", borderRadius: 7, border: "none",
                  background: i === 0 ? C.primaryLight : "transparent",
                  color: i === 0 ? C.primary : C.textMuted,
                  fontFamily: "Inter, sans-serif", fontSize: "0.7rem",
                  fontWeight: i === 0 ? 600 : 400, cursor: "pointer",
                }}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.textMuted }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari percakapan..."
              style={{
                width: "100%", paddingLeft: 30, paddingRight: 10, paddingTop: 8, paddingBottom: 8,
                border: `1px solid ${C.border}`, borderRadius: 9,
                fontFamily: "Inter, sans-serif", fontSize: "0.82rem",
                outline: "none", background: C.bg, color: C.textPrimary, boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {filteredChats.map(ch => {
            const isActive = ch.id === activeChat.id;
            const msgs = messages[ch.id] ?? [];
            const lastMsg = msgs[msgs.length - 1];
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChat(ch)}
                style={{
                  width: "100%", display: "flex", gap: "0.75rem",
                  padding: "0.9rem 1rem", border: "none",
                  background: isActive ? C.primaryLight : "transparent",
                  cursor: "pointer", textAlign: "left",
                  borderLeft: isActive ? `3px solid ${C.primary}` : "3px solid transparent",
                  transition: "all 0.12s",
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = C.bg; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
              >
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1, #a78bfa)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ color: "#fff", fontSize: "0.75rem", fontWeight: 700, fontFamily: "Inter, sans-serif" }}>{ch.avatar}</span>
                  </div>
                  {ch.isOnline && (
                    <div style={{ position: "absolute", bottom: 1, right: 1, width: 10, height: 10, borderRadius: "50%", background: C.success, border: "2px solid #fff" }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.3rem" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", fontWeight: 600, color: C.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {ch.clientName}
                    </span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: C.textMuted, flexShrink: 0 }}>{ch.lastTime}</span>
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: C.textMuted, marginBottom: "0.2rem" }}>{ch.perusahaan}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: C.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 165 }}>
                      {lastMsg?.text ?? ch.lastMessage}
                    </span>
                    {ch.unread > 0 && (
                      <span style={{ background: C.primary, color: "#fff", borderRadius: "99px", fontSize: "0.62rem", padding: "0.1rem 0.48rem", fontWeight: 700, fontFamily: "Inter, sans-serif", flexShrink: 0 }}>
                        {ch.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right: Chat window ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg, minWidth: 0 }}>
        {/* Header */}
        <div style={{ padding: "0.9rem 1.5rem", background: C.card, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ position: "relative" }}>
            <div style={{
              width: 42, height: 42, borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #a78bfa)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#fff", fontSize: "0.75rem", fontWeight: 700, fontFamily: "Inter, sans-serif" }}>{activeChat.avatar}</span>
            </div>
            {activeChat.isOnline && (
              <div style={{ position: "absolute", bottom: 1, right: 1, width: 10, height: 10, borderRadius: "50%", background: C.success, border: "2px solid #fff" }} />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", fontWeight: 700, color: C.textPrimary }}>{activeChat.clientName}</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: activeChat.isOnline ? C.success : C.textMuted }}>
              {activeChat.isOnline ? "Online" : "Offline"} · {activeChat.perusahaan}
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[Phone, Video, MoreVertical].map((Icon, i) => (
              <button key={i} style={{
                width: 36, height: 36, borderRadius: 9, border: `1px solid ${C.border}`,
                background: "#fff", cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", color: C.textSecondary, transition: "all 0.1s",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = C.bg}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#fff"}
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          {(messages[activeChat.id] ?? []).map(msg => {
            const isAgent = msg.from === "agent";
            return (
              <div key={msg.id} style={{ display: "flex", justifyContent: isAgent ? "flex-end" : "flex-start" }}>
                {!isAgent && (
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1, #a78bfa)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginRight: "0.5rem", alignSelf: "flex-end",
                  }}>
                    <span style={{ color: "#fff", fontSize: "0.58rem", fontWeight: 700, fontFamily: "Inter, sans-serif" }}>{activeChat.avatar}</span>
                  </div>
                )}
                <div style={{ maxWidth: "65%" }}>
                  <div style={{
                    background: isAgent ? C.primary : C.card,
                    color: isAgent ? "#fff" : C.textPrimary,
                    padding: "0.7rem 1rem",
                    borderRadius: isAgent ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    fontFamily: "Inter, sans-serif", fontSize: "0.88rem", lineHeight: 1.6,
                    border: isAgent ? "none" : `1px solid ${C.border}`,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  }}>
                    {msg.text}
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.68rem", color: C.textMuted, marginTop: "0.28rem", textAlign: isAgent ? "right" : "left" }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "0.9rem 1.5rem", background: C.card, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "0.6rem" }}>
          {[Paperclip, Smile].map((Icon, i) => (
            <button key={i} style={{ width: 36, height: 36, borderRadius: 9, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.textMuted }}>
              <Icon size={17} />
            </button>
          ))}
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={`Pesan ke ${activeChat.clientName}...`}
            style={{
              flex: 1, padding: "0.65rem 1rem",
              border: `1px solid ${C.border}`, borderRadius: 12,
              fontFamily: "Inter, sans-serif", fontSize: "0.88rem",
              outline: "none", background: C.bg, color: C.textPrimary,
            }}
          />
          <button
            onClick={send}
            style={{
              width: 40, height: 40, borderRadius: 12, border: "none",
              background: input.trim() ? C.primary : C.border,
              cursor: input.trim() ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s", flexShrink: 0,
            }}
          >
            <Send size={16} color={input.trim() ? "#fff" : C.textMuted} />
          </button>
        </div>
      </div>
    </div>
  );
}
