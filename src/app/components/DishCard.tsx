import { DietaryTag, TAG_CONFIG } from "./DietaryFilters";
import { MapPin } from "lucide-react";

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: string;
  source: string;
  tags: DietaryTag[];
  highlight?: string;
  image?: string;
}

interface DishCardProps {
  dish: Dish;
  activeTags: DietaryTag[];
}

export function DishCard({ dish, activeTags }: DishCardProps) {
  const isHighlighted = activeTags.length === 0 || dish.tags.some((t) => activeTags.includes(t));

  return (
    <div
      style={{
        opacity: isHighlighted ? 1 : 0.38,
        transition: "opacity 0.25s ease",
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 4,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {dish.image && (
        <div style={{ height: 180, overflow: "hidden", background: "#D4C9A8" }}>
          <img
            src={dish.image}
            alt={dish.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}
      <div style={{ padding: "1.25rem 1.35rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.55rem" }}>
        {dish.highlight && (
          <div style={{
            fontFamily: "'Roboto Slab', serif",
            fontSize: "0.62rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#C4622D",
            fontWeight: 500,
          }}>
            ✦ {dish.highlight}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem" }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.15rem",
            fontWeight: 600,
            color: "var(--foreground)",
            lineHeight: 1.3,
          }}>
            {dish.name}
          </h3>
          <span style={{
            fontFamily: "'Roboto Slab', serif",
            fontSize: "1rem",
            fontWeight: 400,
            color: "var(--primary)",
            flexShrink: 0,
          }}>
            {dish.price}
          </span>
        </div>
        <p style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: "0.88rem",
          fontWeight: 300,
          lineHeight: 1.65,
          color: "var(--muted-foreground)",
        }}>
          {dish.description}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "auto", paddingTop: "0.4rem" }}>
          <MapPin size={10} color="#6B5E44" strokeWidth={1.5} />
          <span style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "0.05em",
            color: "#6B5E44",
            fontStyle: "italic",
          }}>
            {dish.source}
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.3rem" }}>
          {dish.tags.map((tag) => {
            const cfg = TAG_CONFIG[tag];
            return (
              <span
                key={tag}
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.06em",
                  padding: "0.18rem 0.55rem",
                  borderRadius: "2rem",
                  background: cfg.bg,
                  color: cfg.color,
                  fontWeight: 700,
                }}
              >
                {cfg.label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
