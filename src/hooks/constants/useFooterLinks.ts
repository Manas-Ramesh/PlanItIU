import { FooterLinkGroup } from "@/components/landing";

export const FOOTER_LINKS: ReadonlyArray<FooterLinkGroup> = [
  {
    title: "Platform",
    links: [
      { label: "Schedule Builder", href: "#features" },
      { label: "Degree Tracker", href: "#features" },
      { label: "Study Portal", href: "#features" },
      { label: "Career Center", href: "#features" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "How It Works", href: "#how-it-works" },
      { label: "Supported Schools", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Privacy Policy", href: "/pages/privacy-policy" },
      { label: "Terms of Service", href: "/pages/terms-service" },
    ],
  },
];
export const FOOTER_DISCLAIMER =
  "PlanitUni is an independent entity and is not affiliated with any university.";
