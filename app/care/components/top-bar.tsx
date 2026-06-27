import { useConfigurables } from "~/modules/configurables";
import { usePersona } from "../persona-context";
import { cn } from "~/lib/utils";
import { Compass, User, Car } from "lucide-react";

export function TopBar() {
  const { config } = useConfigurables();
  const { persona, setPersona } = usePersona();

  const appName = config?.appName || "CareCompass";
  const logoUrl = config?.logoUrl;
  const personName = config?.personInCareName || "Maya";
  const assistantName = config?.assistantName || "Daniel";

  return (
    <header
      className="sticky top-0 z-30 bg-navbar/95 backdrop-blur-md border-b border-border"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={appName}
              className="h-8 w-8 rounded-xl object-cover shrink-0"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shrink-0">
              <Compass className="h-5 w-5" />
            </span>
          )}
          <span className="truncate text-base font-bold text-foreground">
            {appName}
          </span>
        </div>

        <PersonaSwitch
          persona={persona}
          onChange={setPersona}
          personName={personName}
          assistantName={assistantName}
        />
      </div>
    </header>
  );
}

function PersonaSwitch({
  persona,
  onChange,
  personName,
  assistantName,
}: {
  persona: "person" | "assistant";
  onChange: (p: "person" | "assistant") => void;
  personName: string;
  assistantName: string;
}) {
  return (
    <div className="flex items-center rounded-full bg-muted p-0.5 shrink-0">
      <button
        type="button"
        onClick={() => onChange("person")}
        aria-pressed={persona === "person"}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors min-h-[36px]",
          persona === "person"
            ? "bg-card text-primary shadow-sm"
            : "text-muted-foreground",
        )}
      >
        <User className="h-3.5 w-3.5" />
        <span className="max-w-[64px] truncate">{personName}</span>
      </button>
      <button
        type="button"
        onClick={() => onChange("assistant")}
        aria-pressed={persona === "assistant"}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors min-h-[36px]",
          persona === "assistant"
            ? "bg-card text-primary shadow-sm"
            : "text-muted-foreground",
        )}
      >
        <Car className="h-3.5 w-3.5" />
        <span className="max-w-[64px] truncate">{assistantName}</span>
      </button>
    </div>
  );
}
