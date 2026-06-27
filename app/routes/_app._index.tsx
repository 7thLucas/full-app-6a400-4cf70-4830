import { Link } from "react-router";
import {
  Sun,
  Clock3,
  TrafficCone,
  Sparkles,
  AlertCircle,
  Pill,
  FileClock,
  ArrowRight,
  Fuel,
} from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { usePersona } from "~/care/persona-context";
import {
  appointments,
  prescriptions,
  referrals,
  recordTransfers,
  receipts,
} from "~/care/data";
import {
  todaysAppointments,
  formatTime,
  daysUntil,
  formatCurrency,
} from "~/care/utils";
import { AppointmentCard } from "~/care/components/appointment-card";
import {
  Card,
  SectionHeader,
  EmptyState,
  StatusChip,
} from "~/care/components/ui";

export default function TodayDashboard() {
  const { config } = useConfigurables();
  const { persona } = usePersona();

  const today = todaysAppointments(appointments);
  const first = today[0];

  const greeting = config?.dashboardGreeting || "Good morning";
  const personName = config?.personInCareName || "Maya";
  const assistantName = config?.assistantName || "Daniel";
  const name = persona === "assistant" ? assistantName : personName;
  const showTravel = config?.showTravelContext ?? true;
  const readyBuffer = config?.readyBufferMinutes ?? 30;
  const emptyMsg =
    config?.emptyDayMessage ||
    "You're all clear today. Take a breath — nothing needs you right now.";

  const readyTime = first
    ? new Date(
        new Date(first.start).getTime() -
          ((first.travelMinutes ?? 0) + readyBuffer) * 60000,
      )
    : null;

  // Things to keep an eye on (person view)
  const overdueRx = prescriptions.filter((p) => p.refillStatus !== "ok");
  const expiringReferrals = referrals.filter(
    (r) =>
      r.status === "expiring" ||
      (r.status === "active" &&
        daysUntil(r.expiryDate) <= (config?.referralExpiryWarningDays ?? 21)),
  );
  const lateRecords = recordTransfers.filter(
    (t) => t.neededBy && t.stage !== "confirmed" && t.stage !== "received",
  );
  const attentionCount =
    overdueRx.length + expiringReferrals.length + lateRecords.length;

  const outstandingReceipts = receipts.filter((r) => !r.submitted);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <header className="px-5 pt-6">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Sun className="h-4 w-4" />
          {new Date().toLocaleDateString([], {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
          {greeting}, {name}.
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {today.length === 0
            ? "Nothing on the calendar today."
            : `You have ${today.length} ${today.length === 1 ? "thing" : "things"} on today.`}
        </p>
      </header>

      {/* Get-ready / travel banner */}
      {first && readyTime && (
        <section className="px-5">
          <Card className="bg-primary text-primary-foreground border-0">
            <div className="p-5">
              <div className="flex items-center gap-2 text-sm font-medium opacity-90">
                <Clock3 className="h-4 w-4" />
                Be ready by
              </div>
              <div className="mt-1 text-3xl font-bold">
                {readyTime.toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
              <p className="mt-1 text-sm opacity-90">
                First stop: {first.title} at {formatTime(first.start)}
              </p>
              {showTravel && first.travelMinutes != null && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-primary-foreground/15 px-3 py-2 text-sm">
                  <TrafficCone className="h-4 w-4" />
                  <span>
                    ~{first.travelMinutes} min drive · light traffic right now
                  </span>
                </div>
              )}
            </div>
          </Card>
        </section>
      )}

      {/* Assistant: outstanding receipts nudge */}
      {persona === "assistant" && outstandingReceipts.length > 0 && (
        <section className="px-5">
          <Link to="/receipts">
            <Card className="p-4 active:scale-[0.99] transition-transform">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/25 text-accent-foreground">
                  <Fuel className="h-5 w-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {outstandingReceipts.length} receipt
                    {outstandingReceipts.length === 1 ? "" : "s"} to submit
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(
                      outstandingReceipts.reduce((s, r) => s + r.amount, 0),
                    )}{" "}
                    in deductible expenses waiting
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
          </Link>
        </section>
      )}

      {/* Person: things to keep an eye on */}
      {persona === "person" && attentionCount > 0 && (
        <section className="px-5">
          <SectionHeader
            title={
              attentionCount === 1
                ? "One thing to keep an eye on"
                : `${attentionCount} things to keep an eye on`
            }
          />
          <div className="space-y-2">
            {expiringReferrals.map((r) => (
              <AttentionRow
                key={r.id}
                icon={<FileClock className="h-4 w-4" />}
                tone="warning"
                title={`Referral to ${r.toProvider}`}
                detail={`Expires in ${daysUntil(r.expiryDate)} days`}
                to="/care"
              />
            ))}
            {overdueRx.map((p) => (
              <AttentionRow
                key={p.id}
                icon={<Pill className="h-4 w-4" />}
                tone={p.refillStatus === "overdue" ? "alert" : "warning"}
                title={`${p.medication} refill`}
                detail={
                  p.refillStatus === "overdue"
                    ? "Overdue — refill now"
                    : `Due in ${p.remainingDays} days`
                }
                to="/care"
              />
            ))}
            {lateRecords.map((t) => (
              <AttentionRow
                key={t.id}
                icon={<AlertCircle className="h-4 w-4" />}
                tone="warning"
                title={t.document}
                detail={`Needed before ${t.linkedAppointmentTitle ?? "an appointment"}`}
                to="/care"
              />
            ))}
          </div>
        </section>
      )}

      {/* Today's timeline */}
      <section className="px-5">
        <SectionHeader
          title="Today's plan"
          action={
            <Link
              to="/calendar"
              className="text-sm font-medium text-primary inline-flex items-center gap-1"
            >
              Full calendar <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        {today.length === 0 ? (
          <Card>
            <EmptyState icon={<Sparkles className="h-5 w-5" />} message={emptyMsg} />
          </Card>
        ) : (
          <div className="space-y-3">
            {today.map((a) => (
              <AppointmentCard key={a.id} appointment={a} />
            ))}
          </div>
        )}
      </section>

      {/* Reassuring footer when all is calm */}
      {persona === "person" && attentionCount === 0 && today.length > 0 && (
        <section className="px-5">
          <Card className="bg-primary/8 border-primary/20">
            <div className="flex items-center gap-3 p-4">
              <Sparkles className="h-5 w-5 text-primary shrink-0" />
              <p className="text-sm text-foreground">
                Everything else is on track. Nothing else needs you right now.
              </p>
            </div>
          </Card>
        </section>
      )}
    </div>
  );
}

function AttentionRow({
  icon,
  title,
  detail,
  tone,
  to,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  tone: "warning" | "alert";
  to: string;
}) {
  return (
    <Link to={to}>
      <Card className="p-3.5 active:scale-[0.99] transition-transform">
        <div className="flex items-center gap-3">
          <span
            className={
              "flex h-9 w-9 items-center justify-center rounded-xl shrink-0 " +
              (tone === "alert"
                ? "bg-destructive/12 text-destructive"
                : "bg-accent/25 text-accent-foreground")
            }
          >
            {icon}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {title}
            </p>
            <p className="text-xs text-muted-foreground">{detail}</p>
          </div>
          <StatusChip tone={tone === "alert" ? "alert" : "warning"}>
            {tone === "alert" ? "Action" : "Soon"}
          </StatusChip>
        </div>
      </Card>
    </Link>
  );
}
