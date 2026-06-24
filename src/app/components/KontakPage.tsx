import { useState } from "react";
import { CLIENTS, Client } from "../data/clients";
import { Search, Phone, Mail, ChevronUp, ChevronDown } from "lucide-react";

const C = {
  bg: "#f5f7fb", card: "#ffffff", border: "#e8edf5",
  textPrimary: "#1e293b", textSecondary: "#64748b", textMuted: "#94a3b8",
  primary: "#6366f1",
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Aktif:    { bg: "#dcfce7", color: "#16a34a" },
  Prospect: { bg: "#e0e7ff", color: "#4f46e5" },
  Expired:  { bg: "#fee2e2", color: "#dc2626" },
  Renewal:  { bg: "#fef9c3", color: "#ca8a04" },
};

const LAYANAN_COLORS: Record<string, { bg: string; color: string }> = {
  Security:          { bg: "#ede9fe", color: "#7c3aed" },
  Driver:            { bg: "#fce7f3", color: "#be185d" },
  "Cleaning Service":{ bg: "#e0f2fe", color: "#0369a1" },
};

function fmtRupiah(n: number) { return "Rp " + (n / 1_000_000).toFixed(0) + " jt"; }

type SortKey = keyof Client | null;

export function KontakPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [layananFilter, setLayananFilter] = useState("Semua");
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = CLIENTS
    .filter(c => {
      const q = search.toLowerCase();
      if (q && !c.nama.toLowerCase().includes(q) && !c.perusahaan.toLowerCase().includes(q)) return false;
      if (statusFilter !== "Semua" && c.status !== statusFilter) return false;
      if (layananFilter !== "Semua" && c.layanan !== layananFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (!sortKey) return 0;
      const av = a[sortKey] as string | number;
      const bv = b[sortKey] as string | number;
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
      : <span style={{ opacity: 0.25 }}><ChevronUp size={12} /></span>;

  const th: React.CSSProperties = {
    padding: "0.85rem 1rem", textAlign: "left",
    fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600,
    letterSpacing: "0.06em", textTransform: "uppercase", color: C.textMuted,
    background: "#f8fafc", borderBottom: `1px solid ${C.border}`,
    whiteSpace: "nowrap", cursor: "pointer", userSelect: "none",
  };

  const td: React.CSSProperties = {
    padding: "0.85rem 1rem", fontFamily: "Inter, sans-serif",
    fontSize: "0.88rem", color: C.textPrimary,
    borderBottom: `1px solid ${C.border}`, verticalAlign: "middle",
  };

  const filterBtn = (active: boolean, primary: string, lightBg: string) => ({
    padding: "0.45rem 1rem", borderRadius: 99, border: "1px solid",
    borderColor: active ? primary : C.border,
    background: active ? lightBg : "#fff",
    color: active ? primary : C.textSecondary,
    fontFamily: "Inter, sans-serif", fontSize: "0.82rem", fontWeight: active ? 600 : 400,
    cursor: "pointer", transition: "all 0.12s",
  });

  return (
    <div style={{ padding: "1.75rem 2rem", flex: 1, minWidth: 0, background: C.bg, minHeight: "100vh" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "Inter, sans-serif", fontSize: "1.45rem", fontWeight: 800, color: C.textPrimary, lineHeight: 1.2 }}>Daftar Kontak</h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: C.textMuted, marginTop: "0.3rem" }}>{CLIENTS.length} klien terdaftar</p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap", marginBottom: "1.25rem", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 220px", maxWidth: 320 }}>
          <Search size={15} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: C.textMuted }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama atau perusahaan..."
            style={{
              width: "100%", paddingLeft: 34, paddingRight: 12, paddingTop: 9, paddingBottom: 9,
              border: `1px solid ${C.border}`, borderRadius: 9, fontFamily: "Inter, sans-serif",
              fontSize: "0.88rem", outline: "none", background: "#fff", color: C.textPrimary, boxSizing: "border-box",
            }}
          />
        </div>
        {["Semua","Aktif","Prospect","Renewal","Expired"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={filterBtn(statusFilter === s, "#6366f1", "#eef2ff") as React.CSSProperties}>{s}</button>
        ))}
        <div style={{ width: 1, height: 24, background: C.border }} />
        {["Semua","Security","Driver","Cleaning Service"].map(l => (
          <button key={l} onClick={() => setLayananFilter(l)} style={filterBtn(layananFilter === l, "#7c3aed", "#ede9fe") as React.CSSProperties}>{l}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1020 }}>
            <thead>
              <tr>
                {[
                  { label: "Nama", key: "nama" as SortKey },
                  { label: "Jabatan", key: "jabatan" as SortKey },
                  { label: "Perusahaan", key: "perusahaan" as SortKey },
                  { label: "Kontak", key: null },
                  { label: "Gender", key: "gender" as SortKey },
                  { label: "Status", key: "status" as SortKey },
                  { label: "Mulai", key: "startKontrak" as SortKey },
                  { label: "Selesai", key: "endKontrak" as SortKey },
                  { label: "Nominal", key: "nominalKontrak" as SortKey },
                  { label: "Layanan", key: "layanan" as SortKey },
                ].map(col => (
                  <th key={col.label} style={th} onClick={() => col.key && toggleSort(col.key)}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      {col.label}{col.key && <SortIcon k={col.key} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  style={{ transition: "background 0.1s" }}
                >
                  <td style={td}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: "50%",
                        background: "linear-gradient(135deg, #6366f1, #a78bfa)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <span style={{ color: "#fff", fontSize: "0.65rem", fontWeight: 700, fontFamily: "Inter, sans-serif" }}>{c.avatar}</span>
                      </div>
                      <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{c.nama}</span>
                    </div>
                  </td>
                  <td style={{ ...td, color: C.textSecondary }}>{c.jabatan}</td>
                  <td style={td}>{c.perusahaan}</td>
                  <td style={td}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#16a34a", fontSize: "0.82rem" }}>
                        <Phone size={11} />{c.whatsapp}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#4f46e5", fontSize: "0.78rem" }}>
                        <Mail size={11} />{c.email}
                      </span>
                    </div>
                  </td>
                  <td style={{ ...td, color: C.textSecondary }}>{c.gender}</td>
                  <td style={td}>
                    <span style={{ ...STATUS_COLORS[c.status], padding: "0.22rem 0.7rem", borderRadius: 99, fontSize: "0.75rem", fontWeight: 600 }}>{c.status}</span>
                  </td>
                  <td style={{ ...td, color: C.textMuted, fontSize: "0.82rem" }}>{c.startKontrak}</td>
                  <td style={{ ...td, color: C.textMuted, fontSize: "0.82rem" }}>{c.endKontrak}</td>
                  <td style={{ ...td, fontWeight: 700, color: C.textPrimary }}>{fmtRupiah(c.nominalKontrak)}</td>
                  <td style={td}>
                    <span style={{ ...LAYANAN_COLORS[c.layanan], padding: "0.22rem 0.7rem", borderRadius: 99, fontSize: "0.75rem", fontWeight: 600 }}>{c.layanan}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "3.5rem", color: C.textMuted, fontFamily: "Inter, sans-serif", fontSize: "0.9rem" }}>
            Tidak ada data yang cocok
          </div>
        )}
      </div>
    </div>
  );
}
