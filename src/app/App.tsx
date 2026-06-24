import { useState } from "react";
import { Sidebar, Page } from "./components/Sidebar";
import { DashboardPage } from "./components/DashboardPage";
import { KontakPage } from "./components/KontakPage";
import { AIClientCardPage } from "./components/AIClientCardPage";
import { ChatPage } from "./components/ChatPage";
import { CHAT_HISTORIES } from "./data/clients";

const totalUnread = CHAT_HISTORIES.reduce((s, ch) => s + ch.unread, 0);

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "Inter, sans-serif" }}>
      <Sidebar active={page} onChange={setPage} unreadChat={totalUnread} />
      <main style={{
        flex: 1, minWidth: 0,
        overflowY: page === "chat" ? "hidden" : "auto",
        display: "flex", flexDirection: "column",
      }}>
        {page === "dashboard" && <DashboardPage />}
        {page === "kontak"    && <KontakPage />}
        {page === "ai-card"   && <AIClientCardPage />}
        {page === "chat"      && <ChatPage />}
      </main>
    </div>
  );
}
