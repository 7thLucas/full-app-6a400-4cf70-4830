import { useState } from "react";
import { providers } from "~/care/data";
import { mapsUrl } from "~/care/utils";
import type { ProviderType } from "~/care/types";
import { PageHeader, Card } from "~/care/components/ui";
import {
  Stethoscope,
  Pill,
  Armchair,
  Car,
  Phone,
  MapPin,
  Search,
} from "lucide-react";
import { cn } from "~/lib/utils";

const TYPE_META: Record<
  ProviderType,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  doctor: { label: "Doctors", icon: Stethoscope },
  pharmacy: { label: "Pharmacies", icon: Pill },
  wheelchair: { label: "Wheelchair", icon: Armchair },
  vehicle: { label: "Vehicle", icon: Car },
};

const TYPES: ProviderType[] = ["doctor", "pharmacy", "wheelchair", "vehicle"];

export default function DirectoryScreen() {
  const [type, setType] = useState<ProviderType | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = providers.filter((p) => {
    const matchesType = type === "all" || p.type === type;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      p.name.toLowerCase().includes(q) ||
      (p.specialty ?? "").toLowerCase().includes(q);
    return matchesType && matchesQuery;
  });

  return (
    <div>
      <PageHeader
        title="Contacts"
        subtitle="Every doctor, pharmacy, and mobility company — one tap to call or navigate."
      />

      <div className="px-5 pb-4 space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contacts"
            className="w-full rounded-2xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterPill
            label="All"
            active={type === "all"}
            onClick={() => setType("all")}
          />
          {TYPES.map((t) => (
            <FilterPill
              key={t}
              label={TYPE_META[t].label}
              active={type === t}
              onClick={() => setType(t)}
            />
          ))}
        </div>
      </div>

      <div className="px-5 space-y-3">
        {filtered.map((p) => {
          const Icon = TYPE_META[p.type].icon;
          return (
            <Card key={p.id} className="p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">
                    {p.name}
                  </h3>
                  {p.specialty && (
                    <p className="text-xs text-muted-foreground">
                      {p.specialty}
                    </p>
                  )}
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" /> {p.address}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <a
                  href={`tel:${p.phone.replace(/\s/g, "")}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground active:scale-95 transition-transform min-h-[44px]"
                >
                  <Phone className="h-4 w-4" /> Call
                </a>
                <a
                  href={mapsUrl(`${p.name}, ${p.address}`)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-secondary px-3 py-2.5 text-sm font-semibold text-secondary-foreground active:scale-95 transition-transform min-h-[44px]"
                >
                  <MapPin className="h-4 w-4" /> Directions
                </a>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No contacts match your search.
          </p>
        )}
      </div>
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-2 text-sm font-medium transition-colors min-h-[40px]",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-card border border-border text-muted-foreground",
      )}
    >
      {label}
    </button>
  );
}
