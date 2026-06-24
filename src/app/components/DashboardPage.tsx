import { useState } from "react";
import { CLIENTS } from "../data/clients";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import {
  Users, AlertTriangle, TrendingDown, Heart, ArrowUpRight, ArrowDownRight,
  Bell, Clock, Star, FileText, Calendar, Download,
} from "lucide-react";

// ─── Color tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#f5f7fb",
  card: "#ffffff",
  border: "#e8edf5",
  sidebar: "#1a2236",
  darkCard: "#243044",
  darkCardAlt: "#1e2a3b",
  primary: "#6366f1",
  primaryLight: "rgba(99,102,241,0.12)",
  success: "#22c55e",
  successLight: "rgba(34,197,94,0.12)",
  warning: "#f59e0b",
  warningLight: "rgba(245,158,11,0.12)",
  danger: "#f87171",
  dangerLight: "rgba(248,113,113,0.12)",
  purple: "#a78bfa",
  purpleLight: "rgba(167,139,250,0.12)",
  textPrimary: "#1e293b",
  textSecondary: "#64748b",
  textMuted: "#94a3b8",
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function fmt(n: number) { return "Rp " + (n / 1_000_000).toFixed(0) + " jt"; }

const PRIORITY_CLIENTS = [
  { id: "c1", avatar: "BS", name: "Budi Santoso", company: "PT Maju Bersama", note: "18 hari belum kontak · Ulang tahun 12 hari lagi", score: 6.8, scoreColor: "#f59e0b" },
  { id: "c4", avatar: "SN", name: "Siti Nurhaliza", company: "CV Sinergi Utama", note: "Renewal est. 3 minggu lagi", score: 5.2, scoreColor: "#f87171" },
  { id: "c3", avatar: "DH", name: "Ahmad Fauzi", company: "PT Kreasi Dinamis", note: "Belum ada intimacy card · AM belum input", score: 7.0, scoreColor: "#22c55e" },
  { id: "c8", avatar: "SL", name: "Maya Sari", company: "PT Nusa Karya", note: "Kontak terakhir 9 hari · Siklus normal 10 hari", score: 8.4, scoreColor: "#22c55e" },
];

const ALERTS = [
  { icon: AlertTriangle, color: "#f87171", bg: "rgba(248,113,113,0.12)", title: "Rina Wijaya — churn risk naik ke 68%", desc: "Engagement turun 3 minggu berturut-turut" },
  { icon: Clock, color: "#f59e0b", bg: "rgba(245,158,11,0.12)", title: "Budi Santoso — 18 hari tanpa kontak", desc: "Threshold normal: 10 hari" },
  { icon: Star, color: "#818cf8", bg: "rgba(129,140,248,0.12)", title: "3 klien siap upsell bulan ini", desc: "Berdasarkan siklus beli historis" },
  { icon: FileText, color: "#6366f1", bg: "rgba(99,102,241,0.12)", title: "5 intimacy card belum lengkap", desc: "AM belum input setelah meeting terakhir" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────
function TopStatCard({
  label, value, sub, subUp, icon: Icon, iconColor, iconBg,
}: {
  label: string; value: string | number; sub?: string; subUp?: boolean;
  icon: React.ElementType; iconColor: string; iconBg: string;
}) {
  return (
    <div style={{ background: C.darkCard, borderRadius: 12, padding: "1.1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={16} color={iconColor} strokeWidth={2} />
        </div>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "rgba(255,255,255,0.5)" }}>{label}</span>
      </div>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "2rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{value}</div>
      {sub && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          {subUp !== undefined && (
            subUp
              ? <ArrowUpRight size={13} color={C.success} />
              : <ArrowDownRight size={13} color={C.danger} />
          )}
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: subUp === undefined ? "rgba(255,255,255,0.4)" : subUp ? C.success : C.danger }}>
            {sub}
          </span>
        </div>
      )}
    </div>
  );
}

function BehaviorCard({ label, value, sub, subUp }: { label: string; value: string; sub: string; subUp: boolean }) {
  return (
    <div style={{ background: C.darkCard, borderRadius: 12, padding: "1.1rem 1.25rem" }}>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", marginBottom: "0.45rem" }}>{label}</div>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "1.75rem", fontWeight: 800, color: "#fff", lineHeight: 1, marginBottom: "0.4rem" }}>{value}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
        {subUp ? <ArrowUpRight size={13} color={C.success} /> : <ArrowDownRight size={13} color={C.danger} />}
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: subUp ? C.success : C.danger }}>{sub}</span>
      </div>
    </div>
  );
}

function ChartSection() {
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");

  const filtered = CLIENTS.filter(c => c.startKontrak >= startDate && c.startKontrak <= endDate);

  const monthMap: Record<string, number> = {};
  filtered.forEach(c => {
    const m = c.startKontrak.slice(0, 7);
    monthMap[m] = (monthMap[m] ?? 0) + 1;
  });
  const monthData = Object.entries(monthMap).sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month: month.slice(5) + "/" + month.slice(2, 4), count }));

  const statusMap: Record<string, number> = {};
  filtered.forEach(c => { statusMap[c.status] = (statusMap[c.status] ?? 0) + 1; });
  const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

  const layananMap: Record<string, number> = {};
  filtered.forEach(c => { layananMap[c.layanan] = (layananMap[c.layanan] ?? 0) + 1; });
  const layananData = Object.entries(layananMap).map(([name, count]) => ({ name, count }));

  const nominalMap: Record<string, number> = {};
  filtered.forEach(c => { nominalMap[c.layanan] = (nominalMap[c.layanan] ?? 0) + c.nominalKontrak; });
  const nominalData = Object.entries(nominalMap).map(([name, total]) => ({ name, total: total / 1_000_000 }));

  const PIE_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#f87171"];

  const inputStyle: React.CSSProperties = {
    border: "none", background: "transparent", fontFamily: "Inter, sans-serif",
    fontSize: "0.85rem", color: C.textPrimary, outline: "none", cursor: "pointer",
  };

  const cardStyle: React.CSSProperties = {
    background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.25rem 1.5rem",
  };

  return (
    <div>
      {/* Date filter row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.1rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <h2 style={{ fontFamily: "Inter, sans-serif", fontSize: "1.05rem", fontWeight: 700, color: C.textPrimary }}>
          Analitik Kontrak
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: C.card, border: `1px solid ${C.border}`, borderRadius: 9, padding: "0.5rem 0.9rem" }}>
          <Calendar size={14} color={C.textMuted} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: C.textMuted }}>Periode:</span>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} />
          <span style={{ color: C.textMuted }}>–</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={inputStyle} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1rem", marginBottom: "1rem" }}>
        <div style={cardStyle}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", fontWeight: 600, color: C.textPrimary, marginBottom: "1rem" }}>Klien Baru per Bulan</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthData} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontFamily: "Inter, sans-serif", fontSize: 11, fill: C.textMuted }} />
              <YAxis allowDecimals={false} tick={{ fontFamily: "Inter, sans-serif", fontSize: 11, fill: C.textMuted }} />
              <Tooltip contentStyle={{ fontFamily: "Inter, sans-serif", fontSize: 12, borderRadius: 8, border: `1px solid ${C.border}` }} />
              <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: "#6366f1" }} name="Klien Baru" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={cardStyle}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", fontWeight: 600, color: C.textPrimary, marginBottom: "0.75rem" }}>Status Klien</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={68} innerRadius={30} dataKey="value">
                {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontFamily: "Inter, sans-serif", fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {statusData.map((d, i) => (
              <span key={d.name} style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: C.textSecondary }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: PIE_COLORS[i % PIE_COLORS.length], display: "inline-block", flexShrink: 0 }} />
                {d.name}: {d.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div style={cardStyle}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", fontWeight: 600, color: C.textPrimary, marginBottom: "1rem" }}>Klien per Layanan</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={layananData} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: C.textMuted }} />
              <YAxis allowDecimals={false} tick={{ fontFamily: "Inter, sans-serif", fontSize: 11, fill: C.textMuted }} />
              <Tooltip contentStyle={{ fontFamily: "Inter, sans-serif", fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="count" name="Klien" radius={[6, 6, 0, 0]}>
                {layananData.map((_, i) => <Cell key={i} fill={["#a78bfa", "#34d399", "#60a5fa"][i % 3]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={cardStyle}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", fontWeight: 600, color: C.textPrimary, marginBottom: "1rem" }}>Nominal Kontrak per Layanan (jt Rp)</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={nominalData} margin={{ top: 4, right: 8, left: -5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: C.textMuted }} />
              <YAxis tick={{ fontFamily: "Inter, sans-serif", fontSize: 11, fill: C.textMuted }} />
              <Tooltip formatter={(v: number) => [`Rp ${v.toFixed(0)} jt`]} contentStyle={{ fontFamily: "Inter, sans-serif", fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="total" name="Nominal" radius={[6, 6, 0, 0]}>
                {nominalData.map((_, i) => <Cell key={i} fill={["#22c55e", "#f59e0b", "#6366f1"][i % 3]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export function DashboardPage() {
  const aktif = CLIENTS.filter(c => c.status === "Aktif").length;
  const followUp = CLIENTS.filter(c => c.lastContact > 14).length;
  const churnRisk = CLIENTS.filter(c => c.risikoChurnPct >= 50).length;
  const avgHealth = (CLIENTS.reduce((s, c) => s + c.relationshipScore, 0) / CLIENTS.length).toFixed(1);
  const totalNominal = CLIENTS.reduce((s, c) => s + c.nominalKontrak, 0);

  return (
    <div style={{ padding: "1.75rem 2rem", flex: 1, minWidth: 0, background: C.bg, minHeight: "100vh" }}>
      {/* Page header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "Inter, sans-serif", fontSize: "1.45rem", fontWeight: 800, color: C.textPrimary, lineHeight: 1.2 }}>Dashboard</h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: C.textMuted, marginTop: "0.3rem" }}>
          Ringkasan performa klien & kontrak hari ini
        </p>
      </div>

      {/* ── Dark overview section ── */}
      <div style={{ background: C.darkCardAlt, borderRadius: 16, padding: "1.5rem", marginBottom: "1.5rem" }}>

        {/* Top 4 stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.875rem", marginBottom: "1.25rem" }}>
          <TopStatCard label="Total klien aktif" value={aktif} sub="2 bulan ini" subUp icon={Users} iconColor="#818cf8" iconBg="rgba(129,140,248,0.18)" />
          <TopStatCard label="Perlu follow-up" value={followUp} sub="Hari ini" subUp={false} icon={Bell} iconColor="#fbbf24" iconBg="rgba(251,191,36,0.18)" />
          <TopStatCard label="Churn risk" value={churnRisk} sub="naik dari 1" subUp={false} icon={TrendingDown} iconColor="#f87171" iconBg="rgba(248,113,113,0.18)" />
          <TopStatCard label="Avg. health score" value={avgHealth} sub="0.3 bulan ini" subUp={false} icon={Heart} iconColor="#34d399" iconBg="rgba(52,211,153,0.18)" />
        </div>

        {/* Priority clients + Alerts */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
          {/* Priority clients */}
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "1rem 1.1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
              <Users size={14} color="rgba(255,255,255,0.45)" />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>
                Klien prioritas hari ini
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {PRIORITY_CLIENTS.map(cl => (
                <div key={cl.id} style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.55rem 0.75rem", background: "rgba(255,255,255,0.04)", borderRadius: 9 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, #6366f1, #818cf8)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ color: "#fff", fontSize: "0.65rem", fontWeight: 700, fontFamily: "Inter, sans-serif" }}>{cl.avatar}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {cl.name} · <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.45)", fontSize: "0.78rem" }}>{cl.company}</span>
                    </div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.38)", marginTop: "0.1rem" }}>{cl.note}</div>
                  </div>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                    background: cl.scoreColor + "20",
                    border: `1.5px solid ${cl.scoreColor}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 700, color: cl.scoreColor }}>{cl.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "1rem 1.1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
              <Bell size={14} color="rgba(255,255,255,0.45)" />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>
                Alert terbaru
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {ALERTS.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div key={i} style={{ display: "flex", gap: "0.65rem", alignItems: "flex-start", padding: "0.55rem 0.75rem", background: "rgba(255,255,255,0.04)", borderRadius: 9 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <Icon size={14} color={a.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", fontWeight: 600, color: "#fff", lineHeight: 1.3 }}>{a.title}</div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.38)", marginTop: "0.15rem" }}>{a.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Behavior Report (image-3) ── */}
      <div style={{ background: C.darkCardAlt, borderRadius: 16, padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <h2 style={{ fontFamily: "Inter, sans-serif", fontSize: "1rem", fontWeight: 700, color: "#fff" }}>Behavior report</h2>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.45rem 0.85rem", cursor: "pointer" }}>
              <Calendar size={13} color="rgba(255,255,255,0.55)" />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.65)" }}>30 hari terakhir</span>
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.35)", borderRadius: 8, padding: "0.45rem 0.85rem", cursor: "pointer", color: "#a5b4fc" }}>
              <Download size={13} color="#a5b4fc" />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", fontWeight: 600 }}>Export</span>
            </button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.875rem" }}>
          <BehaviorCard label="Total Interaksi" value="312" sub="↑ 8% vs bulan lalu" subUp />
          <BehaviorCard label="Avg. respons time" value="1.4 jam" sub="lebih lambat 0.3 jam" subUp={false} />
          <BehaviorCard label="Inisiator klien" value="39%" sub="↑ 4% vs bulan lalu" subUp />
          <BehaviorCard label="Avg. health score" value={String(avgHealth)} sub="↓ 0.3 bulan ini" subUp={false} />
        </div>
      </div>

      {/* ── Light chart section ── */}
      <ChartSection />
    </div>
  );
}
