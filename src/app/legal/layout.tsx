"use client";

import { Footer, NavBar, NavLinkItem } from "@/components/landing";
import {
  FOOTER_DISCLAIMER,
  FOOTER_LINKS,
} from "@/hooks/constants/useFooterLinks";

const NAV_LINKS: ReadonlyArray<NavLinkItem> = [
  { href: "/", label: "Home" },
  { href: "/privacy", label: "Privacy Policy" },
] as const;

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <NavBar
        brandLabel="PlanItUni"
        navLinks={NAV_LINKS}
        ctaLabel="Get Started"
        ctaHref="/login"
      />
      <main>{children}</main>

      {/* <Footer
        brandLabel="PlanitUni"
        brandDescription="AI-powered academic planning for college students."
        linkGroups={FOOTER_LINKS}
      >
        {FOOTER_DISCLAIMER}
      </Footer> */}
    </div>
  );
}
