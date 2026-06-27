import { Navigation, Clock, MapPin, AlertCircle } from "lucide-react";
import type { Appointment } from "../types";
import { formatTime, mapsUrl } from "../utils";
import { CATEGORY_META } from "../types";
import { Card, CategoryPill, StatusChip } from "./ui";

export function AppointmentCard({
  appointment,
  showDate,
}: {
  appointment: Appointment;
  showDate?: boolean;
}) {
  const meta = CATEGORY_META[appointment.category];
  const changed = appointment.status === "changed";
  const tentative = appointment.status === "tentative";

  return (
    <Card className="overflow-hidden">
      <div className="flex">
        <div
          className="w-1.5 shrink-0"
          style={{ backgroundColor: meta.chartVar }}
          aria-hidden
        />
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                {formatTime(appointment.start)}
                {showDate && (
                  <span className="text-muted-foreground font-normal">
                    · {new Date(appointment.start).toLocaleDateString([], { month: "short", day: "numeric" })}
                  </span>
                )}
              </div>
              <h3 className="mt-1.5 text-base font-semibold leading-snug text-foreground">
                {appointment.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {appointment.providerName}
              </p>
            </div>
            <CategoryPill category={appointment.category} />
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{appointment.location}</span>
          </div>

          {changed && appointment.changeNote && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-accent/20 px-3 py-2 text-sm text-accent-foreground">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{appointment.changeNote}</span>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {changed && <StatusChip tone="warning">Time changed</StatusChip>}
              {tentative && <StatusChip tone="neutral">Tentative</StatusChip>}
              {appointment.travelMinutes != null && (
                <StatusChip tone="neutral">
                  ~{appointment.travelMinutes} min away
                </StatusChip>
              )}
            </div>
            <a
              href={mapsUrl(`${appointment.location}, ${appointment.address}`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground active:scale-95 transition-transform min-h-[40px]"
            >
              <Navigation className="h-4 w-4" />
              Navigate
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}
