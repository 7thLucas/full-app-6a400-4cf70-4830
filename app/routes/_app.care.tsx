import { useConfigurables } from "~/modules/configurables";
import { referrals, recordTransfers, prescriptions } from "~/care/data";
import { daysUntil, relativeDay, formatDateShort } from "~/care/utils";
import type {
  ReferralStatus,
  TransferStage,
  RefillStatus,
} from "~/care/types";
import {
  PageHeader,
  Card,
  SectionHeader,
  StatusChip,
} from "~/care/components/ui";
import {
  FileClock,
  ArrowLeftRight,
  Pill,
  Check,
} from "lucide-react";
import { cn } from "~/lib/utils";

export default function CareScreen() {
  const { config } = useConfigurables();
  const warnDays = config?.referralExpiryWarningDays ?? 21;

  return (
    <div>
      <PageHeader
        title="Your care"
        subtitle="Referrals, records on the move, and prescriptions — the full picture, held for you."
      />

      <div className="px-5 space-y-8">
        {/* Referrals */}
        <section>
          <SectionHeader title="Referrals" />
          <div className="space-y-3">
            {referrals.map((r) => {
              const days = daysUntil(r.expiryDate);
              const expiringSoon =
                r.status === "expiring" ||
                (r.status === "active" && days <= warnDays);
              return (
                <Card key={r.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground">
                        {r.reason}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {r.fromProvider}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ArrowLeftRight className="h-3 w-3" />
                        {r.toProvider}
                      </div>
                    </div>
                    <ReferralBadge status={r.status} expiringSoon={expiringSoon} />
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <FileClock className="h-3.5 w-3.5" />
                    {days >= 0
                      ? `Expires ${relativeDay(r.expiryDate)} (${formatDateShort(r.expiryDate)})`
                      : `Expired ${formatDateShort(r.expiryDate)}`}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Records transfer tracker */}
        <section>
          <SectionHeader title="Records on the move" />
          <div className="space-y-3">
            {recordTransfers.map((t) => {
              const late =
                t.neededBy != null &&
                t.stage !== "confirmed" &&
                t.stage !== "received";
              return (
                <Card key={t.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground">
                        {t.document}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground truncate">
                        {t.fromProvider} → {t.toProvider}
                      </p>
                    </div>
                    {late && (
                      <StatusChip tone="warning">Needed soon</StatusChip>
                    )}
                  </div>
                  <TransferProgress stage={t.stage} />
                  {t.linkedAppointmentTitle && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      For: {t.linkedAppointmentTitle}
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        </section>

        {/* Prescriptions */}
        <section>
          <SectionHeader title="Prescriptions" />
          <div className="space-y-3">
            {prescriptions.map((p) => (
              <Card key={p.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <Pill className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground">
                        {p.medication}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {p.dosage}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {p.pharmacy}
                      </p>
                    </div>
                  </div>
                  <RefillBadge status={p.refillStatus} days={p.remainingDays} />
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ReferralBadge({
  status,
  expiringSoon,
}: {
  status: ReferralStatus;
  expiringSoon: boolean;
}) {
  if (status === "used")
    return <StatusChip tone="neutral">Used</StatusChip>;
  if (status === "pending")
    return <StatusChip tone="neutral">Pending</StatusChip>;
  if (expiringSoon || status === "expiring")
    return <StatusChip tone="warning">Expiring</StatusChip>;
  return <StatusChip tone="positive">Active</StatusChip>;
}

const STAGES: TransferStage[] = [
  "requested",
  "sent",
  "received",
  "confirmed",
];
const STAGE_LABELS: Record<TransferStage, string> = {
  requested: "Requested",
  sent: "Sent",
  received: "Received",
  confirmed: "Confirmed",
};

function TransferProgress({ stage }: { stage: TransferStage }) {
  const currentIdx = STAGES.indexOf(stage);
  return (
    <div className="mt-3">
      <div className="flex items-center">
        {STAGES.map((s, i) => {
          const done = i <= currentIdx;
          return (
            <div key={s} className="flex flex-1 items-center last:flex-none">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold shrink-0",
                  done
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {done ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              {i < STAGES.length - 1 && (
                <span
                  className={cn(
                    "h-0.5 flex-1 mx-1 rounded-full",
                    i < currentIdx ? "bg-primary" : "bg-muted",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex justify-between">
        {STAGES.map((s, i) => (
          <span
            key={s}
            className={cn(
              "text-[10px] w-[25%]",
              i === 0
                ? "text-left"
                : i === STAGES.length - 1
                  ? "text-right"
                  : "text-center",
              i <= currentIdx
                ? "text-foreground font-medium"
                : "text-muted-foreground",
            )}
          >
            {STAGE_LABELS[s]}
          </span>
        ))}
      </div>
    </div>
  );
}

function RefillBadge({
  status,
  days,
}: {
  status: RefillStatus;
  days: number;
}) {
  if (status === "overdue")
    return <StatusChip tone="alert">Refill now</StatusChip>;
  if (status === "due-soon")
    return <StatusChip tone="warning">{days}d left</StatusChip>;
  return <StatusChip tone="positive">{days}d left</StatusChip>;
}
