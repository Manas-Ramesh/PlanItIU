"use client";

import { Footer } from "@/components/landing";
import {
  FOOTER_DISCLAIMER,
  FOOTER_LINKS,
} from "@/hooks/constants/useFooterLinks";
import { TERMS, TermSection } from "@/hooks/constants/useTermsAndServiceTypes";

function TermsContent({ sections }: { sections: TermSection[] }) {
  return (
    <div className="space-y-12 text-(--color-text-primary)  leading-relaxed   ">
      {sections.map((section, index) => (
        <div key={section.title}>
          <h2 className="text-xl sm:text-2xl font-semibold ">
            {index + 1}. {section.title}
          </h2>
          <div className="mt-1 space-y-4 font-display text-md  tracking-wide sm:text-xl">
            {section.content}
          </div>
          <hr className="mt-5" />
        </div>
      ))}
    </div>
  );
}

export default function TermsAndService() {
  return (
    <main className="flex flex-col   h-screen  overflow-y-auto">
      <section className="max-w-6xl mx-auto px-6 py-16">
        <main id="main-content">
          <h1 className=" font-bold mb-6 font-display text-xl sm:text-4xl text-(--color-text-primary) leading-tight  animate-fade-in-up text-center tracking-wide">
            PlanItUni, LLC (“PlanItUni”, “WE” OR “US”) TERMS OF SERVICE
          </h1>
          <p className="pb-20 text-xs sm:text-sm text-(--color-text-primary) leading-tight animate-fade-in-up text-center italic">
            THESE TERMS AND CONDITIONS (THE &quot;TERMS&quot;) ARE A LEGAL
            CONTRACT BETWEEN YOU AND PlanItUni. THE TERMS EXPLAIN HOW YOU ARE
            PERMITTED TO USE THE WEBSITE LOCATED AT THE URL: WWW.PlanItUni.com
            AS WELL AS ALL ASSOCIATED SITES LINKED TO WWW.PlanItUni.Com BY
            PlanItUni, ITS SUBSIDIARIES AND AFFILIATED COMPANIES (COLLECTIVELY,
            THE &quot;SITE&quot;). BY USING THIS SITE, YOU ARE AGREEING TO ALL
            THE TERMS; IF YOU DO NOT AGREE WITH ANY OF THESE TERMS, DO NOT
            ACCESS OR OTHERWISE USE THIS SITE OR ANY INFORMATION CONTAINED ON
            THIS SITE.
          </p>
          <TermsContent sections={TERMS} />
          <p className="text-center mt-10 text-md  tracking-wide sm:text-md">
            If you have any questions about these Terms or otherwise need to
            contact PlanItUni for any reason, you can reach us at
            <a
              href="mailto:support@planituni.com"
              target="_blank"
              className="pl-2 underline font-bold"
            >
              support@planituni.com
            </a>
          </p>
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
