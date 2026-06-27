/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  // Base
  background: string;
  foreground: string;
  // Card
  card: string;
  cardForeground: string;
  // Popover
  popover: string;
  popoverForeground: string;
  // Primary
  primary: string;
  primaryForeground: string;
  // Secondary
  secondary: string;
  secondaryForeground: string;
  // Muted
  muted: string;
  mutedForeground: string;
  // Accent
  accent: string;
  accentForeground: string;
  // Destructive
  destructive: string;
  destructiveForeground: string;
  // Border / Input / Ring
  border: string;
  input: string;
  ring: string;
  // Charts
  chart1?: string;
  chart2?: string;
  chart3?: string;
  chart4?: string;
  chart5?: string;
  // Navbar
  navbarBackground: string;
  // Sidebar
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
};

export type TFont = {
  headingFont: string;
  textFont: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  tagline?: string;
  personInCareName?: string;
  assistantName?: string;
  dashboardGreeting?: string;
  emptyDayMessage?: string;
  readyBufferMinutes?: number;
  referralExpiryWarningDays?: number;
  showTravelContext?: boolean;
  showFinancialValue?: boolean;
  brandColor: TBrandColor;
  font: TFont;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "CareCompass",
  logoUrl: "",
  tagline: "Every thread of care, in one calm place.",
  personInCareName: "Maya",
  assistantName: "Daniel",
  dashboardGreeting: "Good morning",
  emptyDayMessage: "You're all clear today. Take a breath — nothing needs you right now.",
  readyBufferMinutes: 30,
  referralExpiryWarningDays: 21,
  showTravelContext: true,
  showFinancialValue: true,
  brandColor: {
    // Base — soft warm neutral surface
    background:        "#FAF8F5",
    foreground:        "#2E2A26",
    // Card
    card:              "#FFFFFF",
    cardForeground:    "#2E2A26",
    // Popover
    popover:           "#FFFFFF",
    popoverForeground: "#2E2A26",
    // Primary — calm teal / sage
    primary:           "#3F8E7C",
    primaryForeground: "#FFFFFF",
    // Secondary — warm coral / amber accent surface
    secondary:           "#FBEDE3",
    secondaryForeground: "#8A4B2A",
    // Muted
    muted:           "#F0EBE4",
    mutedForeground: "#7A726A",
    // Accent — warm coral
    accent:           "#E8A87C",
    accentForeground: "#3A2A1E",
    // Destructive — soft alert coral (avoid aggressive red)
    destructive:           "#D9745E",
    destructiveForeground: "#FFFFFF",
    // Border / Input / Ring
    border: "#E7DFD5",
    input:  "#E7DFD5",
    ring:   "#3F8E7C",
    // Charts — category accents: medical, pharmacy, wheelchair, vehicle, accent
    chart1: "#3F8E7C",
    chart2: "#8B7BB8",
    chart3: "#E0A33E",
    chart4: "#4A7CB5",
    chart5: "#E8A87C",
    // Navbar
    navbarBackground: "#FFFFFF",
    // Sidebar
    sidebarBackground:        "#FFFFFF",
    sidebarForeground:        "#2E2A26",
    sidebarPrimary:           "#3F8E7C",
    sidebarPrimaryForeground: "#FFFFFF",
    sidebarAccent:            "#FBEDE3",
    sidebarAccentForeground:  "#8A4B2A",
    sidebarBorder:            "#E7DFD5",
    sidebarRing:              "#3F8E7C",
  },
  font: {
    headingFont: "Plus Jakarta Sans",
    textFont: "Inter",
  },
};
