import { useState } from "react";
import { CLIENTS, Client } from "../data/clients";
import { X, MessageCircle, TrendingUp, TrendingDown, Minus, Bell, Lightbulb, MessageSquare, MapPin } from "lucide-react";

const C = {
  bg: "#f5f7fb", card: "#ffffff", border: "#e8edf5",
  darkPage: "#1e2a3b", darkCard: "#243044", darkCardAlt: "rgba(255,255,255,0.05)",
  textPrimary: "#1e293b", textSecondary: "#64748b", textMuted: "#94a3b8",
  primary: "#6366f1", success: "#22c55e", warning: "#f59e0b", danger: "#f87171",
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Aktif:    { bg: "#dcfce7", color: "#16a34a" },
  Prospect: { bg: "#e0e7ff", color: "#4f46e5" },
  Expired:  { bg: "#fee2e2", color: "#dc2626" },
  Renewal:  { bg: "#fef9c3", color: "#ca8a04" },
};

const LAYANAN_COLORS: Record<string, string> = {
  Security: "#7c3aed", Driver: "#be185d", "Cleaning Service": "#0369a1",
};

function TrendIcon({ tren }: { tren: "Naik" | "Stabil" | "Menurun" }) {
  if (tren === "Naik") return <TrendingUp size={13} color={C.success} />;
  if (tren === "Menurun") return <TrendingDown size={13} color={C.danger} />;
  return <Minus size={13} color={C.warning} />;
}

function InfoRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem", padding: "0.38rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "rgba(255,255,255,0.48)", flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", fontWeight: 600, color: valueColor ?? "rgba(255,255,255,0.9)", textAlign: "right" }}>{value}</span>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: "1.1rem 1.2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
        <Icon size={14} color="rgba(255,255,255,0.42)" />
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.48)", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 600 }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function ClientCard({ client, onClose }: { client: Client; onClose: () => void }) {
  const REC_ICONS = [Bell, Lightbulb, MessageSquare];
  const REC_COLORS = ["#fbbf24", "#60a5fa", "#34d399"];
  const REC_BG = ["rgba(251,191,36,0.12)", "rgba(96,165,250,0.12)", "rgba(52,211,153,0.12)"];

  const scoreColor = client.relationshipScore >= 8 ? C.success : client.relationshipScore >= 6 ? C.warning : C.danger;

  return (
    <div style={{
      background: C.darkPage, borderRadius: 18, width: "100%", maxWidth: 700,
      maxHeight: "90vh", overflowY: "auto", color: "#fff",
      position: "relative", boxShadow: "0 32px 80px rgba(0,0,0,0.55)",
    }}>
      <button onClick={onClose} style={{
        position: "absolute", top: 14, right: 14,
        background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%",
        width: 30, height: 30, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", zIndex: 10,
      }}>
        <X size={14} />
      </button>

      <div style={{ padding: "1.6rem 1.6rem 0" }}>
        {/* Header */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1.25rem" }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #a78bfa)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ color: "#fff", fontSize: "0.95rem", fontWeight: 700, fontFamily: "Inter, sans-serif" }}>{client.avatar}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontFamily: "Inter, sans-serif", fontSize: "1.25rem", fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{client.nama}</h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.48)", marginTop: "0.2rem" }}>
              {client.jabatan} · {client.perusahaan} · {client.kota}
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <span style={{ ...STATUS_COLORS[client.status], padding: "0.22rem 0.75rem", borderRadius: 99, fontSize: "0.75rem", fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
              {client.status === "Aktif" ? "Klien aktif" : client.status}
            </span>
            {client.risikoChurnPct >= 35 && (
              <span style={{ background: "rgba(251,191,36,0.18)", color: "#fbbf24", padding: "0.22rem 0.75rem", borderRadius: 99, fontSize: "0.75rem", fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
                Perlu perhatian
              </span>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.75rem", background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "1.1rem", marginBottom: "1.25rem" }}>
          {[
            { label: "Relationship score", value: `${client.relationshipScore}/10`, color: scoreColor },
            { label: "Terakhir kontak", value: `${client.lastContact} hari`, color: client.lastContact > 20 ? C.danger : C.warning },
            { label: "Klien sejak", value: client.clientSince > 0 ? `${client.clientSince} thn` : "Baru", color: "#60a5fa" },
            { label: "Nilai kontrak", value: `${(client.nominalKontrak / 1_000_000).toFixed(0)} jt`, color: "#a78bfa" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.35rem" }}>{s.label}</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "1.25rem", fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2x2 sections */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", padding: "0 1.6rem" }}>
        <SectionCard title="Gaya komunikasi" icon={MessageCircle}>
          <InfoRow label="Channel favorit" value={client.channelFavorit} />
          <InfoRow label="Nada" value={client.nada} />
          <InfoRow label="Jam aktif" value={client.jamAktif} />
          <InfoRow label="Avg. respons" value={client.avgRespons} />
          <InfoRow label="Inisiator kontak" value={client.inisiator} valueColor={C.success} />
        </SectionCard>

        <SectionCard title="Relationship health" icon={TrendingUp}>
          <InfoRow label="Lifecycle stage" value={client.lifecycleStage} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.38rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "rgba(255,255,255,0.48)" }}>Tren 3 bulan</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontFamily: "Inter, sans-serif", fontSize: "0.82rem", fontWeight: 600, color: client.tren3Bulan === "Naik" ? C.success : client.tren3Bulan === "Menurun" ? C.danger : C.warning }}>
              <TrendIcon tren={client.tren3Bulan} />{client.tren3Bulan}
            </span>
          </div>
          <InfoRow label="Frekuensi ideal" value={client.frekuensiIdeal} />
          <InfoRow label="Risiko churn" value={`${client.risikoChurn} (${client.risikoChurnPct}%)`} valueColor={client.risikoChurnPct >= 50 ? C.danger : client.risikoChurnPct >= 30 ? C.warning : C.success} />
          <InfoRow label="Meeting terakhir" value={client.meetingTerakhir} />
        </SectionCard>

        <SectionCard title="Purchase behavior" icon={TrendingUp}>
          <InfoRow label="Siklus keputusan" value={client.siklusKeputusan} />
          <InfoRow label="Trigger beli" value={client.triggerBeli} valueColor={C.warning} />
          <InfoRow label="Musim beli" value={client.musimBeli} />
          <InfoRow label="Cara deal" value={client.caraDeal} valueColor={C.warning} />
          <InfoRow label="Next renewal est." value={client.nextRenewal} valueColor="#60a5fa" />
        </SectionCard>

        <SectionCard title="Personal touch" icon={MessageSquare}>
          <InfoRow label="Hobby" value={client.hobby} />
          <InfoRow label="Suka ngobrolin" value={client.sukaObrolan} />
          <InfoRow label="Keluarga" value={client.keluarga} />
          <InfoRow label="Ulang tahun" value={client.ulangTahun} valueColor={C.warning} />
          <InfoRow label="Catatan terakhir" value={client.catatanTerakhir} />
        </SectionCard>
      </div>

      {/* Recommendations */}
      <div style={{ padding: "1.25rem 1.6rem 1.6rem" }}>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.1rem 1.2rem" }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.48)", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.8rem" }}>
            Rekomendasi sekarang
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            {client.rekomendasi.map((r, i) => {
              const Icon = REC_ICONS[i % REC_ICONS.length];
              return (
                <div key={i} style={{ background: REC_BG[i % REC_BG.length], borderRadius: 9, padding: "0.8rem 1rem", display: "flex", gap: "0.7rem", alignItems: "flex-start" }}>
                  <Icon size={15} color={REC_COLORS[i % REC_COLORS.length]} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.88)", lineHeight: 1.6 }}>{r}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AIClientCardPage() {
  const [selected, setSelected] = useState<Client | null>(null);
  const [search, setSearch] = useState("");

  const filtered = CLIENTS.filter(c => {
    const q = search.toLowerCase();
    return !q || c.nama.toLowerCase().includes(q) || c.perusahaan.toLowerCase().includes(q);
  });

  return (
    <div style={{ padding: "1.75rem 2rem", flex: 1, minWidth: 0, background: C.bg, minHeight: "100vh" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "Inter, sans-serif", fontSize: "1.45rem", fontWeight: 800, color: C.textPrimary, lineHeight: 1.2 }}>AI Client Card</h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: C.textMuted, marginTop: "0.3rem" }}>
          Profil lengkap klien bertenaga AI — klik klien untuk melihat kartu
        </p>
      </div>

      <div style={{ marginBottom: "1.25rem", maxWidth: 340 }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cari klien..."
          style={{
            width: "100%", padding: "0.6rem 1rem",
            border: `1px solid ${C.border}`, borderRadius: 9,
            fontFamily: "Inter, sans-serif", fontSize: "0.88rem",
            outline: "none", background: "#fff", color: C.textPrimary, boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "1rem" }}>
        {filtered.map(c => (
          <button
            key={c.id}
            onClick={() => setSelected(c)}
            style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
              padding: "1.1rem 1.25rem", cursor: "pointer", textAlign: "left",
              transition: "all 0.15s ease", display: "flex", flexDirection: "column", gap: "0.8rem",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#6366f1"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(99,102,241,0.14)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.border; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1, #a78bfa)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ color: "#fff", fontSize: "0.8rem", fontWeight: 700, fontFamily: "Inter, sans-serif" }}>{c.avatar}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", fontWeight: 700, color: C.textPrimary }}>{c.nama}</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: C.textMuted }}>{c.jabatan}</div>
              </div>
              <span style={{ ...STATUS_COLORS[c.status], padding: "0.18rem 0.6rem", borderRadius: 99, fontSize: "0.68rem", fontWeight: 700, fontFamily: "Inter, sans-serif", flexShrink: 0 }}>
                {c.status}
              </span>
            </div>

            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: C.textMuted, display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <MapPin size={11} />{c.perusahaan} · {c.kota}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <div style={{ background: "#f1f5f9", borderRadius: 99, height: 6, width: 80, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${c.relationshipScore * 10}%`, borderRadius: 99,
                    background: c.relationshipScore >= 8 ? C.success : c.relationshipScore >= 6 ? C.warning : C.danger,
                  }} />
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: C.textSecondary }}>{c.relationshipScore}/10</span>
              </div>
              <span style={{
                background: LAYANAN_COLORS[c.layanan] + "18",
                color: LAYANAN_COLORS[c.layanan],
                padding: "0.18rem 0.6rem", borderRadius: 99, fontSize: "0.68rem", fontWeight: 600, fontFamily: "Inter, sans-serif",
              }}>
                {c.layanan}
              </span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(15,20,40,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1.5rem" }}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          <ClientCard client={selected} onClose={() => setSelected(null)} />
        </div>
      )}
    </div>
  );
}
