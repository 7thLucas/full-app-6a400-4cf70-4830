import { useConfigurables } from "~/modules/configurables";
import { appointments } from "~/care/data";
import { todaysAppointments, formatTime, mapsUrl } from "~/care/utils";
import { CATEGORY_META } from "~/care/types";
import { PageHeader, Card, EmptyState, StatusChip } from "~/care/components/ui";
import { Navigation, Route, Clock3, MapPin, Coffee } from "lucide-react";

export default function RunScreen() {
  const { config } = useConfigurables();
  const stops = todaysAppointments(appointments);
  const personName = config?.personInCareName || "Maya";

  // Multi-stop deep link: chain all stop addresses for sequential navigation.
  const multiStopUrl = (() => {
    if (stops.length === 0) return "";
    const points = stops.map((s) => `${s.location}, ${s.address}`);
    if (typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
      // Apple Maps supports daddr with "to:" chaining
      const [first, ...rest] = points;
      const daddr = [first, ...rest].map(encodeURIComponent).join("+to:");
      return `https://maps.apple.com/?daddr=${daddr}&dirflg=d`;
    }
    const destination = encodeURIComponent(points[points.length - 1]);
    const waypoints = points
      .slice(0, -1)
      .map(encodeURIComponent)
      .join("|");
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}${
      waypoints ? `&waypoints=${waypoints}` : ""
    }&travelmode=driving`;
  })();

  const totalTravel = stops.reduce((s, a) => s + (a.travelMinutes ?? 0), 0);

  return (
    <div>
      <PageHeader
        title="Today's run"
        subtitle={`The driving plan for ${personName} — stops in order, one tap to navigate all of them.`}
      />

      {stops.length === 0 ? (
        <div className="px-5">
          <Card>
            <EmptyState
              icon={<Coffee className="h-5 w-5" />}
              message="No runs today. Enjoy the quiet — nothing to drive to."
            />
          </Card>
        </div>
      ) : (
        <div className="px-5 space-y-5">
          {/* Run summary */}
          <Card className="bg-primary text-primary-foreground border-0 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <Route className="h-4 w-4" /> {stops.length} stops
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm opacity-90">
                  <Clock3 className="h-4 w-4" /> ~{totalTravel} min driving total
                </div>
              </div>
            </div>
            {multiStopUrl && (
              <a
                href={multiStopUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary-foreground px-4 py-3 text-sm font-bold text-primary active:scale-[0.98] transition-transform"
              >
                <Navigation className="h-4 w-4" /> Navigate all stops
              </a>
            )}
          </Card>

          {/* Sequential stops */}
          <ol className="relative space-y-3">
            {stops.map((s, idx) => {
              const meta = CATEGORY_META[s.category];
              return (
                <li key={s.id} className="relative">
                  <Card className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-primary-foreground shrink-0"
                          style={{ backgroundColor: meta.chartVar }}
                        >
                          {idx + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {formatTime(s.start)}
                          </span>
                          {s.travelMinutes != null && (
                            <StatusChip tone="neutral">
                              ~{s.travelMinutes} min
                            </StatusChip>
                          )}
                        </div>
                        <h3 className="mt-0.5 text-base font-semibold text-foreground">
                          {s.title}
                        </h3>
                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {s.location}
                        </p>
                        {s.status === "changed" && s.changeNote && (
                          <div className="mt-2 rounded-lg bg-accent/20 px-2.5 py-1.5 text-xs text-accent-foreground">
                            {s.changeNote}
                          </div>
                        )}
                        <a
                          href={mapsUrl(`${s.location}, ${s.address}`)}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-2 text-sm font-semibold text-secondary-foreground active:scale-95 transition-transform min-h-[40px]"
                        >
                          <Navigation className="h-4 w-4" /> Navigate to stop
                        </a>
                      </div>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
