import { Leaf } from "lucide-react";

export function MenuHeader() {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-2 opacity-70">
          <Leaf size={14} strokeWidth={1.5} />
          <span style={{ fontFamily: "'Lato', sans-serif", letterSpacing: "0.18em", fontSize: "0.7rem", textTransform: "uppercase" }}>
            Est. 2014 · Seasonal Kitchen
          </span>
          <Leaf size={14} strokeWidth={1.5} />
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 6vw, 4rem)", fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
          The Root & Vine
        </h1>
        <p style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300, letterSpacing: "0.04em", marginTop: "0.5rem", opacity: 0.8, fontSize: "0.95rem" }}>
          Farm-to-table dining · Hudson Valley, New York
        </p>
        <div className="mt-6 flex items-center gap-3">
          <div className="h-px w-12 bg-primary-foreground opacity-30" />
          <span style={{ fontFamily: "'Roboto Slab', serif", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.65 }}>
            Summer Menu 2026
          </span>
          <div className="h-px w-12 bg-primary-foreground opacity-30" />
        </div>
      </div>
    </header>
  );
}
