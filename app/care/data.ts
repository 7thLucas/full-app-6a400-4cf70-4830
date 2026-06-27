import type {
  Appointment,
  Referral,
  RecordTransfer,
  Prescription,
  Provider,
  MaintenanceLog,
  Receipt,
} from "./types";

// ── Date helpers ────────────────────────────────────────────────────────────
// All demo data is generated relative to "now" so the Today view is always live.

function atTime(dayOffset: number, hour: number, minute: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function dayOnly(dayOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export const appointments: Appointment[] = [
  {
    id: "a1",
    title: "Neurology review",
    category: "medical",
    providerName: "Dr. Priya Anand",
    start: atTime(0, 9, 30),
    durationMinutes: 45,
    location: "Riverside Neurology Clinic",
    address: "120 Riverside Dr, Suite 4",
    status: "confirmed",
    notes: "Bring the latest MRI results.",
    travelMinutes: 18,
  },
  {
    id: "a2",
    title: "Prescription pickup",
    category: "pharmacy",
    providerName: "Maple Street Pharmacy",
    start: atTime(0, 12, 15),
    durationMinutes: 15,
    location: "Maple Street Pharmacy",
    address: "88 Maple St",
    status: "changed",
    changeNote: "Moved 30 min earlier — counter closes at 12:45 today.",
    travelMinutes: 9,
  },
  {
    id: "a3",
    title: "Wheelchair seat adjustment",
    category: "wheelchair",
    providerName: "MobilityWorks Service",
    start: atTime(0, 15, 0),
    durationMinutes: 60,
    location: "MobilityWorks Service Centre",
    address: "15 Industrial Way",
    status: "confirmed",
    notes: "Tilt mechanism check + new cushion fitting.",
    travelMinutes: 22,
  },
  {
    id: "a4",
    title: "Physiotherapy",
    category: "medical",
    providerName: "Dr. Lena Cho",
    start: atTime(2, 10, 0),
    durationMinutes: 50,
    location: "Eastgate Physio",
    address: "44 Eastgate Rd",
    status: "confirmed",
    travelMinutes: 14,
  },
  {
    id: "a5",
    title: "Van 6-month service",
    category: "vehicle",
    providerName: "AccessVan Specialists",
    start: atTime(4, 8, 30),
    durationMinutes: 180,
    location: "AccessVan Specialists",
    address: "9 Depot Lane",
    status: "tentative",
    notes: "Includes wheelchair ramp hydraulics inspection.",
    travelMinutes: 25,
  },
  {
    id: "a6",
    title: "Cardiology follow-up",
    category: "medical",
    providerName: "Dr. Omar Reyes",
    start: atTime(6, 13, 30),
    durationMinutes: 40,
    location: "Heart Health Centre",
    address: "200 Wellness Blvd",
    status: "confirmed",
    travelMinutes: 20,
  },
];

export const referrals: Referral[] = [
  {
    id: "r1",
    fromProvider: "Dr. Priya Anand (Neurology)",
    toProvider: "Sleep Disorders Clinic",
    reason: "Sleep study assessment",
    status: "expiring",
    issuedDate: dayOnly(-70),
    expiryDate: dayOnly(12),
  },
  {
    id: "r2",
    fromProvider: "Dr. Omar Reyes (Cardiology)",
    toProvider: "Vascular Imaging Lab",
    reason: "Doppler ultrasound",
    status: "active",
    issuedDate: dayOnly(-20),
    expiryDate: dayOnly(70),
  },
  {
    id: "r3",
    fromProvider: "Dr. Lena Cho (Physio)",
    toProvider: "Orthotics Specialist",
    reason: "Custom seating support",
    status: "pending",
    issuedDate: dayOnly(-5),
    expiryDate: dayOnly(85),
  },
];

export const recordTransfers: RecordTransfer[] = [
  {
    id: "t1",
    document: "MRI imaging + report",
    fromProvider: "Riverside Imaging",
    toProvider: "Dr. Priya Anand",
    stage: "sent",
    neededBy: atTime(0, 9, 30),
    linkedAppointmentTitle: "Neurology review",
  },
  {
    id: "t2",
    document: "Blood panel results",
    fromProvider: "City Pathology",
    toProvider: "Dr. Omar Reyes",
    stage: "received",
    neededBy: atTime(6, 13, 30),
    linkedAppointmentTitle: "Cardiology follow-up",
  },
  {
    id: "t3",
    document: "Referral letter",
    fromProvider: "Dr. Lena Cho",
    toProvider: "Orthotics Specialist",
    stage: "requested",
  },
  {
    id: "t4",
    document: "Discharge summary",
    fromProvider: "General Hospital",
    toProvider: "Dr. Priya Anand",
    stage: "confirmed",
  },
];

export const prescriptions: Prescription[] = [
  {
    id: "p1",
    medication: "Baclofen",
    dosage: "10mg · 3× daily",
    pharmacy: "Maple Street Pharmacy",
    refillStatus: "due-soon",
    nextRefill: dayOnly(4),
    remainingDays: 4,
  },
  {
    id: "p2",
    medication: "Gabapentin",
    dosage: "300mg · 2× daily",
    pharmacy: "Northside Compounding",
    refillStatus: "ok",
    nextRefill: dayOnly(18),
    remainingDays: 18,
  },
  {
    id: "p3",
    medication: "Vitamin D",
    dosage: "1000 IU · daily",
    pharmacy: "Maple Street Pharmacy",
    refillStatus: "overdue",
    nextRefill: dayOnly(-2),
    remainingDays: 0,
  },
];

export const providers: Provider[] = [
  {
    id: "d1",
    name: "Dr. Priya Anand",
    type: "doctor",
    specialty: "Neurology",
    phone: "+1 555 0142",
    address: "120 Riverside Dr, Suite 4",
  },
  {
    id: "d2",
    name: "Dr. Omar Reyes",
    type: "doctor",
    specialty: "Cardiology",
    phone: "+1 555 0188",
    address: "200 Wellness Blvd",
  },
  {
    id: "d3",
    name: "Dr. Lena Cho",
    type: "doctor",
    specialty: "Physiotherapy",
    phone: "+1 555 0210",
    address: "44 Eastgate Rd",
  },
  {
    id: "ph1",
    name: "Maple Street Pharmacy",
    type: "pharmacy",
    phone: "+1 555 0301",
    address: "88 Maple St",
  },
  {
    id: "ph2",
    name: "Northside Compounding",
    type: "pharmacy",
    phone: "+1 555 0322",
    address: "12 Northside Ave",
  },
  {
    id: "w1",
    name: "MobilityWorks Service",
    type: "wheelchair",
    specialty: "Powered chair repairs",
    phone: "+1 555 0410",
    address: "15 Industrial Way",
  },
  {
    id: "v1",
    name: "AccessVan Specialists",
    type: "vehicle",
    specialty: "Accessible van servicing",
    phone: "+1 555 0555",
    address: "9 Depot Lane",
  },
];

export const maintenanceLogs: MaintenanceLog[] = [
  {
    id: "m1",
    asset: "wheelchair",
    title: "Seat tilt motor replacement",
    company: "MobilityWorks Service",
    status: "in-progress",
    date: dayOnly(0),
    notes: "Part ordered, fitting today.",
    underWarranty: true,
  },
  {
    id: "m2",
    asset: "wheelchair",
    title: "New seat cushion fitting",
    company: "MobilityWorks Service",
    status: "scheduled",
    date: dayOnly(0),
  },
  {
    id: "m3",
    asset: "vehicle",
    title: "6-month full service",
    company: "AccessVan Specialists",
    status: "scheduled",
    date: dayOnly(4),
    notes: "Ramp hydraulics + brakes.",
  },
  {
    id: "m4",
    asset: "vehicle",
    title: "Tyre replacement (front pair)",
    company: "AccessVan Specialists",
    status: "done",
    date: dayOnly(-12),
  },
  {
    id: "m5",
    asset: "wheelchair",
    title: "Annual battery check",
    company: "MobilityWorks Service",
    status: "done",
    date: dayOnly(-40),
    underWarranty: true,
  },
];

export const receipts: Receipt[] = [
  {
    id: "rc1",
    category: "fuel",
    vendor: "Shell — Depot Lane",
    amount: 68.4,
    date: dayOnly(-1),
    submitted: false,
    note: "Fill-up before cardiology run.",
  },
  {
    id: "rc2",
    category: "maintenance",
    vendor: "AccessVan Specialists",
    amount: 420.0,
    date: dayOnly(-12),
    submitted: true,
    note: "Front tyre pair.",
  },
  {
    id: "rc3",
    category: "fuel",
    vendor: "BP — Riverside",
    amount: 72.1,
    date: dayOnly(-6),
    submitted: false,
  },
  {
    id: "rc4",
    category: "maintenance",
    vendor: "MobilityWorks Service",
    amount: 145.0,
    date: dayOnly(-3),
    submitted: false,
    note: "Battery check (warranty co-pay).",
  },
];
