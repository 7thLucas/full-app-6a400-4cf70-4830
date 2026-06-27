import type { Appointment } from "./types";

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

export function formatWeekday(iso: string): string {
  return new Date(iso).toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function isSameDay(iso: string, ref: Date): boolean {
  const d = new Date(iso);
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  );
}

export function daysUntil(iso: string): number {
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export function relativeDay(iso: string): string {
  const diff = daysUntil(iso);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 1 && diff < 7) return `In ${diff} days`;
  if (diff < -1 && diff > -7) return `${Math.abs(diff)} days ago`;
  return formatDateShort(iso);
}

export function sortByStart(a: Appointment, b: Appointment): number {
  return new Date(a.start).getTime() - new Date(b.start).getTime();
}

export function todaysAppointments(list: Appointment[]): Appointment[] {
  const now = new Date();
  return list.filter((a) => isSameDay(a.start, now)).sort(sortByStart);
}

export function upcomingAppointments(list: Appointment[]): Appointment[] {
  const now = new Date();
  return list
    .filter((a) => new Date(a.start).getTime() >= now.getTime() - 3600000)
    .sort(sortByStart);
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
}

/**
 * Build a maps deep link. On iOS we prefer Apple Maps; elsewhere we use a
 * universal geo/maps URL that resolves to the device's best maps app.
 */
export function mapsUrl(query: string): string {
  const q = encodeURIComponent(query);
  if (typeof navigator !== "undefined") {
    const ua = navigator.userAgent || "";
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    if (isIOS) return `https://maps.apple.com/?q=${q}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}
