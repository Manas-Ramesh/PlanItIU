"use client";

import { Footer } from "@/components/landing";
import {
  FOOTER_DISCLAIMER,
  FOOTER_LINKS,
} from "@/hooks/constants/useFooterLinks";
import {
  PRIVACYPOLICY,
  PrivacyPolicyTypes,
} from "@/hooks/constants/usePrivacyPolicyTypes";

function PrivacyPolicyTerms({ sections }: { sections: PrivacyPolicyTypes[] }) {
  return (
    <div className="space-y-12 text-(--color-text-primary)  leading-relaxed   ">
      {sections.map((section, index) => (
        <div key={index}>
          <h2 className="text-xl sm:text-2xl font-semibold ">
            {section.title}
          </h2>
          <div className="mt-1 space-y-4  font-display text-md  tracking-wide ">
            {section.content}
          </div>
          <hr className="mt-5" />
        </div>
      ))}
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <main className="flex flex-col   h-screen  overflow-y-auto">
      <section className="max-w-6xl mx-auto px-6 py-16">
        <main id="main-content">
          <h1 className=" font-bold mb-6 font-display text-xl sm:text-4xl text-(--color-text-primary) leading-tight  animate-fade-in-up text-center tracking-wide">
            Privacy Policy for PlanItUni, LLC
          </h1>
          <p className="pb-20  text-xs sm:text-lg text-(--color-text-primary) leading-tight animate-fade-in-up text-center italic">
            This Privacy Policy describes how PlanItUni handles personal
            information that we collect through our website, platform, and any
            other sites or services that link to this Privacy Policy
            (collectively, the “Services”).
          </p>
          <PrivacyPolicyTerms sections={PRIVACYPOLICY} />
        </main>
      </section>
      <Footer
        brandLabel="PlanitUni"
        brandDescription="AI-powered academic planning for college students."
        linkGroups={FOOTER_LINKS}
      >
        {FOOTER_DISCLAIMER}
      </Footer>
    </main>
  );
}
