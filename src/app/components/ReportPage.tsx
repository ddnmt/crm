import { useState, useMemo } from "react";
import { CLIENTS } from "../data/clients";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import { Calendar } from "lucide-react";

const PALETTE = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "1.25rem 1.5rem" }}>
      <div style={{ fontFamily: "sans-serif", fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.5rem" }}>{label}</div>
      <div style={{ fontFamily: "sans-serif", fontSize: "1.75rem", fontWeight: 700, color: color ?? "#0f172a", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: "sans-serif", fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.35rem" }}>{sub}</div>}
    </div>
  );
}

export function ReportPage() {
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");

  const filtered = useMemo(() =>
    CLIENTS.filter(c => c.startKontrak >= startDate && c.startKontrak <= endDate),
    [startDate, endDate]
  );

  // Client per month
  const monthMap: Record<string, number> = {};
  filtered.forEach(c => {
    const m = c.startKontrak.slice(0, 7);
    monthMap[m] = (monthMap[m] ?? 0) + 1;
  });
  const monthData = Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month: month.slice(5) + "/" + month.slice(2, 4), count }));

  // Status distribution
  const statusMap: Record<string, number> = {};
  filtered.forEach(c => { statusMap[c.status] = (statusMap[c.status] ?? 0) + 1; });
  const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

  // Layanan distribution
  const layananMap: Record<string, number> = {};
  filtered.forEach(c => { layananMap[c.layanan] = (layananMap[c.layanan] ?? 0) + 1; });
  const layananData = Object.entries(layananMap).map(([name, count]) => ({ name, count }));

  // Nominal per layanan
  const nominalMap: Record<string, number> = {};
  filtered.forEach(c => { nominalMap[c.layanan] = (nominalMap[c.layanan] ?? 0) + c.nominalKontrak; });
  const nominalData = Object.entries(nominalMap).map(([name, total]) => ({ name, total: total / 1_000_000 }));

  const totalNominal = filtered.reduce((s, c) => s + c.nominalKontrak, 0);

  const inputStyle: React.CSSProperties = {
    padding: "0.45rem 0.75rem", border: "1px solid #e2e8f0", borderRadius: 8,
    fontFamily: "sans-serif", fontSize: "0.82rem", color: "#0f172a", background: "#fff", outline: "none",
  };

  const sectionTitle: React.CSSProperties = {
    fontFamily: "sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem",
  };

  return (
    <div style={{ padding: "1.75rem 2rem", flex: 1, minWidth: 0, background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "sans-serif", fontSize: "1.35rem", fontWeight: 700, color: "#0f172a" }}>Report & Analitik</h1>
        <p style={{ fontFamily: "sans-serif", fontSize: "0.82rem", color: "#64748b", marginTop: "0.25rem" }}>Gambaran umum performa klien dan kontrak</p>
      </div>

      {/* Date filter */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "0.5rem 0.875rem" }}>
          <Calendar size={14} color="#64748b" />
          <span style={{ fontFamily: "sans-serif", fontSize: "0.78rem", color: "#64748b" }}>Periode:</span>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ ...inputStyle, border: "none", padding: 0, background: "transparent" }} />
          <span style={{ color: "#94a3b8", fontFamily: "sans-serif" }}>–</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ ...inputStyle, border: "none", padding: 0, background: "transparent" }} />
        </div>
        <span style={{ fontFamily: "sans-serif", fontSize: "0.78rem", color: "#64748b" }}>
          Menampilkan <strong>{filtered.length}</strong> klien
        </span>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.75rem" }}>
        <StatCard label="Total Klien" value={filtered.length} sub="dalam periode" />
        <StatCard label="Total Kontrak" value={"Rp " + (totalNominal / 1_000_000).toFixed(0) + " jt"} color="#7c3aed" />
        <StatCard label="Klien Aktif" value={filtered.filter(c => c.status === "Aktif").length} color="#16a34a" sub="status aktif" />
        <StatCard label="Perlu Renewal" value={filtered.filter(c => c.status === "Renewal").length} color="#ca8a04" sub="akan habis" />
      </div>

      {/* Row 1: Monthly + Status */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "1.25rem", marginBottom: "1.25rem" }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "1.25rem 1.5rem" }}>
          <div style={sectionTitle}>Jumlah Klien Baru per Bulan</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontFamily: "sans-serif", fontSize: 11, fill: "#94a3b8" }} />
              <YAxis allowDecimals={false} tick={{ fontFamily: "sans-serif", fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip contentStyle={{ fontFamily: "sans-serif", fontSize: 12, borderRadius: 8 }} />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: "#3b82f6" }} name="Klien Baru" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "1.25rem 1.5rem" }}>
          <div style={sectionTitle}>Status Klien</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}
                style={{ fontFamily: "sans-serif", fontSize: 11 }}>
                {statusData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontFamily: "sans-serif", fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
            {statusData.map((d, i) => (
              <span key={d.name} style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontFamily: "sans-serif", fontSize: "0.72rem", color: "#4b5563" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: PALETTE[i % PALETTE.length], display: "inline-block" }} />
                {d.name}: {d.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Layanan count + Nominal */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "1.25rem 1.5rem" }}>
          <div style={sectionTitle}>Jumlah Klien per Layanan</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={layananData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontFamily: "sans-serif", fontSize: 10, fill: "#94a3b8" }} />
              <YAxis allowDecimals={false} tick={{ fontFamily: "sans-serif", fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip contentStyle={{ fontFamily: "sans-serif", fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="count" name="Klien" radius={[6, 6, 0, 0]}>
                {layananData.map((_, i) => <Cell key={i} fill={["#8b5cf6", "#ec4899", "#06b6d4"][i % 3]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "1.25rem 1.5rem" }}>
          <div style={sectionTitle}>Total Nominal Kontrak per Layanan (juta Rp)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={nominalData} margin={{ top: 5, right: 10, left: -5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontFamily: "sans-serif", fontSize: 10, fill: "#94a3b8" }} />
              <YAxis tick={{ fontFamily: "sans-serif", fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip formatter={(v: number) => [`Rp ${v.toFixed(0)} jt`, "Nominal"]} contentStyle={{ fontFamily: "sans-serif", fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="total" name="Nominal (jt)" radius={[6, 6, 0, 0]}>
                {nominalData.map((_, i) => <Cell key={i} fill={["#10b981", "#f59e0b", "#3b82f6"][i % 3]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
