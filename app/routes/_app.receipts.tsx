import { useMemo, useState } from "react";
import { useConfigurables } from "~/modules/configurables";
import { receipts as seedReceipts } from "~/care/data";
import { formatCurrency, formatDateShort } from "~/care/utils";
import type { Receipt, ReceiptCategory } from "~/care/types";
import {
  PageHeader,
  Card,
  SectionHeader,
  StatusChip,
} from "~/care/components/ui";
import {
  Fuel,
  Wrench,
  Camera,
  Check,
  Plus,
  Download,
  X,
} from "lucide-react";
import { cn } from "~/lib/utils";

export default function ReceiptsScreen() {
  const { config } = useConfigurables();
  const showValue = config?.showFinancialValue ?? true;
  const [items, setItems] = useState<Receipt[]>(seedReceipts);
  const [adding, setAdding] = useState(false);

  const outstanding = items.filter((r) => !r.submitted);
  const submittedTotal = useMemo(
    () => items.filter((r) => r.submitted).reduce((s, r) => s + r.amount, 0),
    [items],
  );
  const outstandingTotal = outstanding.reduce((s, r) => s + r.amount, 0);
  const yearTotal = items.reduce((s, r) => s + r.amount, 0);

  function submit(id: string) {
    setItems((prev) =>
      prev.map((r) => (r.id === id ? { ...r, submitted: true } : r)),
    );
  }

  function addReceipt(r: Omit<Receipt, "id" | "submitted">) {
    setItems((prev) => [
      { ...r, id: `rc-${Date.now()}`, submitted: false },
      ...prev,
    ]);
    setAdding(false);
  }

  return (
    <div>
      <PageHeader
        title="Receipts"
        subtitle="Capture every fuel and maintenance receipt — categorised and ready for tax time."
      />

      <div className="px-5 space-y-6">
        {/* Tax value card */}
        {showValue && (
          <Card className="bg-primary text-primary-foreground border-0 p-5">
            <p className="text-sm opacity-90">Captured this year</p>
            <p className="mt-1 text-3xl font-bold">
              {formatCurrency(yearTotal)}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-primary-foreground/15 px-3 py-2">
                <p className="opacity-90 text-xs">Submitted</p>
                <p className="font-semibold">{formatCurrency(submittedTotal)}</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/15 px-3 py-2">
                <p className="opacity-90 text-xs">To submit</p>
                <p className="font-semibold">
                  {formatCurrency(outstandingTotal)}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-foreground/15 px-4 py-2.5 text-sm font-semibold"
            >
              <Download className="h-4 w-4" /> Export year-end summary
            </button>
          </Card>
        )}

        {/* Add receipt */}
        {adding ? (
          <ReceiptForm onAdd={addReceipt} onCancel={() => setAdding(false)} />
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 px-4 py-4 text-sm font-semibold text-primary active:scale-[0.99] transition-transform"
          >
            <Camera className="h-5 w-5" /> Capture a receipt
          </button>
        )}

        {/* Outstanding */}
        <section>
          <SectionHeader
            title={
              outstanding.length === 0
                ? "All submitted"
                : `To submit (${outstanding.length})`
            }
          />
          {outstanding.length === 0 ? (
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">
                Lovely — every receipt is logged and submitted.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {outstanding.map((r) => (
                <ReceiptRow key={r.id} receipt={r} onSubmit={() => submit(r.id)} />
              ))}
            </div>
          )}
        </section>

        {/* Submitted history */}
        {items.some((r) => r.submitted) && (
          <section>
            <SectionHeader title="Submitted" />
            <div className="space-y-3">
              {items
                .filter((r) => r.submitted)
                .map((r) => (
                  <ReceiptRow key={r.id} receipt={r} />
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ReceiptRow({
  receipt,
  onSubmit,
}: {
  receipt: Receipt;
  onSubmit?: () => void;
}) {
  const Icon = receipt.category === "fuel" ? Fuel : Wrench;
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground shrink-0">
          <Icon className="h-5 w-5" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground truncate">
              {receipt.vendor}
            </h3>
            <span className="text-sm font-bold text-foreground">
              {formatCurrency(receipt.amount)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground capitalize">
            {receipt.category} · {formatDateShort(receipt.date)}
          </p>
          {receipt.note && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {receipt.note}
            </p>
          )}
          <div className="mt-2">
            {receipt.submitted ? (
              <StatusChip tone="positive">
                <Check className="h-3 w-3" /> Submitted
              </StatusChip>
            ) : (
              <button
                type="button"
                onClick={onSubmit}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground active:scale-95 transition-transform min-h-[36px]"
              >
                <Check className="h-3.5 w-3.5" /> Mark submitted
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function ReceiptForm({
  onAdd,
  onCancel,
}: {
  onAdd: (r: Omit<Receipt, "id" | "submitted">) => void;
  onCancel: () => void;
}) {
  const [category, setCategory] = useState<ReceiptCategory>("fuel");
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const valid = vendor.trim() !== "" && Number(amount) > 0;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">New receipt</h3>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel"
          className="text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-3 flex gap-2">
        {(["fuel", "maintenance"] as ReceiptCategory[]).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold capitalize transition-colors min-h-[44px]",
              category === c
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            {c === "fuel" ? (
              <Fuel className="h-4 w-4" />
            ) : (
              <Wrench className="h-4 w-4" />
            )}
            {c}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/50 px-4 py-3 text-sm font-medium text-muted-foreground"
      >
        <Camera className="h-4 w-4" /> Add photo
      </button>

      <div className="space-y-2.5">
        <input
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
          placeholder="Vendor (e.g. Shell)"
          className="w-full rounded-xl border border-border bg-card px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
        />
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          placeholder="Amount"
          className="w-full rounded-xl border border-border bg-card px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
        />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (optional)"
          className="w-full rounded-xl border border-border bg-card px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
        />
      </div>

      <button
        type="button"
        disabled={!valid}
        onClick={() =>
          onAdd({
            category,
            vendor: vendor.trim(),
            amount: Number(amount),
            date: new Date().toISOString(),
            note: note.trim() || undefined,
          })
        }
        className={cn(
          "mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors min-h-[48px]",
          valid
            ? "bg-primary text-primary-foreground active:scale-[0.98]"
            : "bg-muted text-muted-foreground",
        )}
      >
        <Plus className="h-4 w-4" /> Save receipt
      </button>
    </Card>
  );
}
