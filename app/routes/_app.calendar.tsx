import { useState } from "react";
import { appointments } from "~/care/data";
import {
  upcomingAppointments,
  relativeDay,
  formatWeekday,
} from "~/care/utils";
import { CATEGORY_META, type Category } from "~/care/types";
import { AppointmentCard } from "~/care/components/appointment-card";
import { PageHeader, EmptyState, Card } from "~/care/components/ui";
import { CalendarDays } from "lucide-react";
import { cn } from "~/lib/utils";

const CATEGORIES: Category[] = ["medical", "pharmacy", "wheelchair", "vehicle"];

export default function CalendarScreen() {
  const [active, setActive] = useState<Category | "all">("all");

  const upcoming = upcomingAppointments(appointments).filter(
    (a) => active === "all" || a.category === active,
  );

  // Group by calendar day
  const groups = new Map<string, typeof upcoming>();
  for (const a of upcoming) {
    const key = new Date(a.start).toDateString();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(a);
  }

  return (
    <div>
      <PageHeader
        title="Calendar"
        subtitle="Every appointment — medical, pharmacy, wheelchair and vehicle — in one timeline."
      />

      {/* Category filter pills */}
      <div className="px-5 pb-4">
        <div className="flex flex-wrap gap-2">
          <FilterPill
            label="All"
            active={active === "all"}
            onClick={() => setActive("all")}
          />
          {CATEGORIES.map((c) => (
            <FilterPill
              key={c}
              label={CATEGORY_META[c].label}
              color={CATEGORY_META[c].chartVar}
              active={active === c}
              onClick={() => setActive(c)}
            />
          ))}
        </div>
      </div>

      <div className="px-5 space-y-6">
        {upcoming.length === 0 ? (
          <Card>
            <EmptyState
              icon={<CalendarDays className="h-5 w-5" />}
              message="Nothing scheduled in this view. A calm stretch ahead."
            />
          </Card>
        ) : (
          Array.from(groups.entries()).map(([dayKey, items]) => (
            <section key={dayKey}>
              <div className="mb-2 flex items-baseline gap-2">
                <h2 className="text-sm font-bold text-foreground">
                  {relativeDay(items[0].start)}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {formatWeekday(items[0].start)}
                </span>
              </div>
              <div className="space-y-3">
                {items.map((a) => (
                  <AppointmentCard key={a.id} appointment={a} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors min-h-[40px]",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-card border border-border text-muted-foreground",
      )}
    >
      {color && (
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: active ? "currentColor" : color }}
        />
      )}
      {label}
    </button>
  );
}
