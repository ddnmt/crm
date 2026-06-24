import { Users, LayoutDashboard, CreditCard, MessageSquare } from "lucide-react";

export type Page = "dashboard" | "kontak" | "ai-card" | "chat";

interface SidebarProps {
  active: Page;
  onChange: (p: Page) => void;
  unreadChat?: number;
}

const NAV = [
  { id: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard },
  { id: "kontak" as Page, label: "Kontak", icon: Users },
  { id: "ai-card" as Page, label: "AI Client Card", icon: CreditCard },
  { id: "chat" as Page, label: "Chat", icon: MessageSquare },
];

export function Sidebar({ active, onChange, unreadChat }: SidebarProps) {
  return (
    <aside
      style={{
        width: 228,
        minWidth: 228,
        background: "#1a2236",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "1.5rem 1.25rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ color: "#fff", fontSize: "0.82rem", fontWeight: 700, fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>SP</span>
          </div>
          <div>
            <div style={{ color: "#fff", fontSize: "1rem", fontWeight: 700, fontFamily: "Inter, sans-serif", lineHeight: 1.2 }}>ServicePro</div>
            <div style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.72rem", fontFamily: "Inter, sans-serif" }}>CRM Dashboard</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "1.1rem 0.875rem", flex: 1 }}>
        <div style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.65rem", letterSpacing: "0.13em", textTransform: "uppercase", padding: "0 0.5rem", marginBottom: "0.6rem", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
          Menu Utama
        </div>
        {NAV.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.7rem 0.875rem",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                background: isActive ? "rgba(99,102,241,0.2)" : "transparent",
                color: isActive ? "#a5b4fc" : "rgba(255,255,255,0.5)",
                marginBottom: "0.2rem",
                transition: "all 0.15s ease",
                position: "relative",
                textAlign: "left",
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              {isActive && (
                <div style={{
                  position: "absolute", left: 0, top: "22%", bottom: "22%",
                  width: 3, borderRadius: "0 3px 3px 0", background: "#818cf8",
                }} />
              )}
              <Icon size={17} strokeWidth={isActive ? 2 : 1.6} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.92rem", fontWeight: isActive ? 600 : 400 }}>
                {label}
              </span>
              {id === "chat" && (unreadChat ?? 0) > 0 && (
                <span style={{
                  marginLeft: "auto",
                  background: "#f87171",
                  color: "#fff",
                  borderRadius: "99px",
                  fontSize: "0.65rem",
                  padding: "0.1rem 0.5rem",
                  fontWeight: 700,
                  fontFamily: "Inter, sans-serif",
                }}>
                  {unreadChat}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom user */}
      <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: "0.7rem" }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "linear-gradient(135deg, #10b981, #6366f1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ color: "#fff", fontSize: "0.72rem", fontWeight: 700, fontFamily: "Inter, sans-serif" }}>AD</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "#e2e8f0", fontSize: "0.85rem", fontWeight: 600, fontFamily: "Inter, sans-serif", lineHeight: 1.2 }}>Admin</div>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", fontFamily: "Inter, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>admin@servicepro.id</div>
        </div>
      </div>
    </aside>
  );
}
