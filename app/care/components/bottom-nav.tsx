import { NavLink } from "react-router";
import {
  Home,
  CalendarDays,
  HeartPulse,
  Wrench,
  Receipt,
  Route,
  type LucideIcon,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { usePersona } from "../persona-context";

interface Tab {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const PERSON_TABS: Tab[] = [
  { to: "/", label: "Today", icon: Home, end: true },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/care", label: "Care", icon: HeartPulse },
  { to: "/mobility", label: "Mobility", icon: Wrench },
  { to: "/directory", label: "Contacts", icon: Receipt },
];

const ASSISTANT_TABS: Tab[] = [
  { to: "/", label: "Today", icon: Home, end: true },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/run", label: "The Run", icon: Route },
  { to: "/receipts", label: "Receipts", icon: Receipt },
  { to: "/mobility", label: "Vehicle", icon: Wrench },
];

export function BottomNav() {
  const { persona } = usePersona();
  const tabs = persona === "assistant" ? ASSISTANT_TABS : PERSON_TABS;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-navbar/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <li key={tab.to} className="flex-1">
              <NavLink
                to={tab.to}
                end={tab.end}
                className="block"
                aria-label={tab.label}
              >
                {({ isActive }) => (
                  <div
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    <Icon
                      className="h-6 w-6"
                      strokeWidth={isActive ? 2.4 : 1.9}
                    />
                    <span
                      className={cn(
                        "text-[11px] leading-none",
                        isActive ? "font-semibold" : "font-medium",
                      )}
                    >
                      {tab.label}
                    </span>
                  </div>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
