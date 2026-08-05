"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSettings, type SiteSettings } from "@/lib/getSettings";
import { ORDER_WHATSAPP_NUMBER, ORDER_EMAIL } from "@/data/config";

const defaults: SiteSettings = {
  whatsapp: ORDER_WHATSAPP_NUMBER,
  email: ORDER_EMAIL,
};

const SettingsContext = createContext<SiteSettings>(defaults);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaults);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

// Returns the defaults immediately (from data/config.ts) and swaps in the
// real values once they've loaded from the database — components don't
// need to handle a loading state, just a value that may update once.
export function useSettings() {
  return useContext(SettingsContext);
}
