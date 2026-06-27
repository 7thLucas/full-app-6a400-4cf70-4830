// CareCompass domain types — the shape of every thread of care.

export type Persona = "person" | "assistant";

export type Category = "medical" | "pharmacy" | "wheelchair" | "vehicle";

export type AppointmentStatus = "confirmed" | "changed" | "tentative";

export interface Appointment {
  id: string;
  title: string;
  category: Category;
  providerName: string;
  /** ISO datetime of the start */
  start: string;
  /** minutes */
  durationMinutes: number;
  location: string;
  address: string;
  status: AppointmentStatus;
  /** populated when status === "changed" */
  changeNote?: string;
  notes?: string;
  /** estimated minutes of travel to reach this appointment */
  travelMinutes?: number;
}

export type ReferralStatus = "active" | "expiring" | "pending" | "used";

export interface Referral {
  id: string;
  fromProvider: string;
  toProvider: string;
  reason: string;
  status: ReferralStatus;
  /** ISO date the referral expires */
  expiryDate: string;
  issuedDate: string;
}

export type TransferStage = "requested" | "sent" | "received" | "confirmed";

export interface RecordTransfer {
  id: string;
  document: string;
  fromProvider: string;
  toProvider: string;
  stage: TransferStage;
  /** ISO date this is needed by (often before an appointment) */
  neededBy?: string;
  linkedAppointmentTitle?: string;
}

export type RefillStatus = "ok" | "due-soon" | "overdue";

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  pharmacy: string;
  refillStatus: RefillStatus;
  /** ISO date of next refill */
  nextRefill: string;
  remainingDays: number;
}

export type ProviderType =
  | "doctor"
  | "pharmacy"
  | "wheelchair"
  | "vehicle";

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  specialty?: string;
  phone: string;
  address: string;
}

export type LogStatus = "scheduled" | "in-progress" | "done";

export interface MaintenanceLog {
  id: string;
  asset: "wheelchair" | "vehicle";
  title: string;
  company: string;
  status: LogStatus;
  /** ISO date */
  date: string;
  notes?: string;
  underWarranty?: boolean;
}

export type ReceiptCategory = "fuel" | "maintenance";

export interface Receipt {
  id: string;
  category: ReceiptCategory;
  vendor: string;
  amount: number;
  /** ISO date */
  date: string;
  /** true once the assistant has submitted it for tax */
  submitted: boolean;
  note?: string;
}

export const CATEGORY_META: Record<
  Category,
  { label: string; chartVar: string }
> = {
  medical: { label: "Medical", chartVar: "var(--chart-1)" },
  pharmacy: { label: "Pharmacy", chartVar: "var(--chart-2)" },
  wheelchair: { label: "Wheelchair", chartVar: "var(--chart-3)" },
  vehicle: { label: "Vehicle", chartVar: "var(--chart-4)" },
};
