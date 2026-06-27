import { maintenanceLogs } from "~/care/data";
import { relativeDay, formatDateShort } from "~/care/utils";
import type { LogStatus } from "~/care/types";
import {
  PageHeader,
  Card,
  SectionHeader,
  StatusChip,
} from "~/care/components/ui";
import { Armchair, Car, ShieldCheck, Wrench } from "lucide-react";

export default function MobilityScreen() {
  const wheelchair = maintenanceLogs.filter((m) => m.asset === "wheelchair");
  const vehicle = maintenanceLogs.filter((m) => m.asset === "vehicle");

  return (
    <div>
      <PageHeader
        title="Mobility"
        subtitle="Your wheelchair and accessible van — every repair, service and warranty, tracked."
      />

      <div className="px-5 space-y-8">
        <AssetSection
          title="Powered wheelchair"
          icon={<Armchair className="h-5 w-5" />}
          logs={wheelchair}
        />
        <AssetSection
          title="Accessible van"
          icon={<Car className="h-5 w-5" />}
          logs={vehicle}
        />
      </div>
    </div>
  );
}

function AssetSection({
  title,
  icon,
  logs,
}: {
  title: string;
  icon: React.ReactNode;
  logs: typeof maintenanceLogs;
}) {
  const open = logs.filter((l) => l.status !== "done");
  return (
    <section>
      <SectionHeader title={title} />
      <Card className="p-4 mb-3 bg-primary/8 border-primary/15">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shrink-0">
            {icon}
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {open.length === 0
                ? "All good — nothing open"
                : `${open.length} job${open.length === 1 ? "" : "s"} in progress`}
            </p>
            <p className="text-xs text-muted-foreground">
              {logs.length} log{logs.length === 1 ? "" : "s"} on record
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {logs.map((log) => (
          <Card key={log.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground shrink-0">
                  <Wrench className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">
                    {log.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{log.company}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {relativeDay(log.date)} · {formatDateShort(log.date)}
                  </p>
                </div>
              </div>
              <LogBadge status={log.status} />
            </div>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              {log.underWarranty && (
                <StatusChip tone="positive">
                  <ShieldCheck className="h-3 w-3" /> Under warranty
                </StatusChip>
              )}
              {log.notes && (
                <span className="text-xs text-muted-foreground">
                  {log.notes}
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function LogBadge({ status }: { status: LogStatus }) {
  if (status === "done")
    return <StatusChip tone="positive">Done</StatusChip>;
  if (status === "in-progress")
    return <StatusChip tone="warning">In progress</StatusChip>;
  return <StatusChip tone="neutral">Scheduled</StatusChip>;
}
