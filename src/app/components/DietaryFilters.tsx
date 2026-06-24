import { X } from "lucide-react";

export type DietaryTag =
  | "vegan"
  | "vegetarian"
  | "gluten-free"
  | "dairy-free"
  | "nut-free"
  | "seasonal";

const TAG_CONFIG: Record<DietaryTag, { label: string; color: string; bg: string; dot: string }> = {
  vegan: { label: "Vegan", color: "#2C4A2E", bg: "#D4E8D0", dot: "#2C4A2E" },
  vegetarian: { label: "Vegetarian", color: "#3A5C1A", bg: "#DFF0C8", dot: "#5A8A2E" },
  "gluten-free": { label: "Gluten-Free", color: "#6B3A1F", bg: "#F0DDD0", dot: "#C4622D" },
  "dairy-free": { label: "Dairy-Free", color: "#1A3D5C", bg: "#C8DCEE", dot: "#2E6EA0" },
  "nut-free": { label: "Nut-Free", color: "#5C4A1A", bg: "#EEE2C0", dot: "#A08030" },
  seasonal: { label: "✦ Seasonal", color: "#7A2C0A", bg: "#F5D9C0", dot: "#C4622D" },
};

interface DietaryFiltersProps {
  active: DietaryTag[];
  onChange: (tags: DietaryTag[]) => void;
}

export function DietaryFilters({ active, onChange }: DietaryFiltersProps) {
  const toggle = (tag: DietaryTag) => {
    if (active.includes(tag)) {
      onChange(active.filter((t) => t !== tag));
    } else {
      onChange([...active, tag]);
    }
  };

  const clearAll = () => onChange([]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {(Object.keys(TAG_CONFIG) as DietaryTag[]).map((tag) => {
        const cfg = TAG_CONFIG[tag];
        const isActive = active.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: "0.75rem",
              letterSpacing: "0.06em",
              padding: "0.35rem 0.8rem",
              borderRadius: "2rem",
              border: `1.5px solid ${isActive ? cfg.dot : "rgba(44,74,46,0.22)"}`,
              background: isActive ? cfg.bg : "transparent",
              color: isActive ? cfg.color : "#6B5E44",
              cursor: "pointer",
              transition: "all 0.15s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontWeight: isActive ? 700 : 400,
            }}
          >
            {isActive && (
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: cfg.dot,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
            )}
            {cfg.label}
          </button>
        );
      })}
      {active.length > 0 && (
        <button
          onClick={clearAll}
          style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "0.08em",
            padding: "0.3rem 0.65rem",
            borderRadius: "2rem",
            border: "1.5px solid rgba(196,98,45,0.4)",
            background: "transparent",
            color: "#C4622D",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            transition: "all 0.15s ease",
          }}
        >
          <X size={11} />
          Clear
        </button>
      )}
    </div>
  );
}

export { TAG_CONFIG };
