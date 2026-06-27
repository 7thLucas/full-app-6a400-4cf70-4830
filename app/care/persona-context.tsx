import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Persona } from "./types";

interface PersonaState {
  persona: Persona;
  setPersona: (p: Persona) => void;
}

const PersonaContext = createContext<PersonaState | null>(null);

const STORAGE_KEY = "carecompass.persona";

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [persona, setPersonaState] = useState<Persona>("person");

  // Restore the last-used persona on the client only (avoids SSR mismatch).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "person" || saved === "assistant") {
        setPersonaState(saved);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const setPersona = (p: Persona) => {
    setPersonaState(p);
    try {
      window.localStorage.setItem(STORAGE_KEY, p);
    } catch {
      // ignore
    }
  };

  return (
    <PersonaContext.Provider value={{ persona, setPersona }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona(): PersonaState {
  const ctx = useContext(PersonaContext);
  if (!ctx) {
    throw new Error("usePersona must be used within <PersonaProvider>");
  }
  return ctx;
}
