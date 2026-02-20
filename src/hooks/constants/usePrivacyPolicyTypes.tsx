import React from "react";

export type PrivacyPolicyTypes = {
  title: React.ReactNode;
  content: React.ReactNode;
};

export const PRIVACYPOLICY: PrivacyPolicyTypes[] = [
  {
    title: (
      <>
        <p>Personal information we collect</p>
        <p>Information users submit to us:</p>
      </>
    ),
    content: (
      <>
        <ul className="list-disc pl-6 space-y-2 text-(--color-text-primary) ">
          <li>
            Contact and account information, such as your first and last name,
            phone number, mailing address, email address, username, and
            password.
          </li>
          <li>
            Commercial loan application information, including your social
            security number, credit and employment information, financial
            account information, transaction history, and information about your
            business.
          </li>
          <li>
            Feedback or correspondence, such as information you provide when you
            contact us with questions, feedback, or otherwise correspond with us
            online
          </li>
          <li>
            Usage information, such as information about how you use the
            Services and interact with us, including information associated with
            any content you upload to the Services or otherwise submit, and
            information you provide when you use any interactive features of the
            Services.
          </li>
          <li>
            Marketing information, such as your preferences for receiving
            communications about our Services, and details about how you engage
            with our communications.
          </li>
          <li>
            Other information that we may collect, which is not specifically
            listed here, but which we will use in accordance with this Privacy
            Policy or as otherwise disclosed at the time of collection
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Information we obtain from third parties:",
    content: (
      <>
        <ul className="list-disc pl-6 space-y-2 text-(--color-text-primary) ">
          <li>Social media information.</li>
          <li>
            We may maintain pages on social media platforms, such as Facebook,
            LinkedIn, and other third-party platforms. When you visit or
            interact with our pages on those platforms, the platform provider’s
            privacy policy will apply to your interactions and their collection,
            use and processing of your personal information.
          </li>
          <li>Other sources.</li>
          <li>
            We may obtain your personal information from other third parties,
            such as marketing partners, background check providers, credit
            reporting agencies, financial institutions, publicly-available
            sources, and data providers.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Automatic data collection",
    content: (
      <>
        <p>
          We and our service providers may automatically log information about
          you, your computer or mobile device, and your interactions over time
          with our Services, our communications and other online services,
          including:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-(--color-text-primary) ">
          <li>
            Device data: such as your computer’s or mobile device’s operating
            system type and version, manufacturer and model, browser type,
            screen resolution, RAM and disk size, CPU usage, device type (e.g.,
            phone, tablet), IP address, unique identifiers, language settings,
            mobile device carrier, radio/network information (e.g., WiFi, LTE,
            4G), and general location information such as city, state or
            geographic area.
          </li>
          <li>
            Online activity data: such as pages or screens you viewed, how long
            you spent on a page or screen, browsing history, navigation paths
            between pages or screens, information about your activity on a page
            or screen, access times, duration of access, and whether you have
            opened our marketing emails or clicked links within them.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "We use the following tools for automatic data collection:",
    content: (
      <>
        <ul className="list-disc pl-6 space-y-2 text-(--color-text-primary) ">
          <li>
            Cookies, which are text files that websites store on a visitor‘s
            device to uniquely identify the visitor’s browser or to store
            information or settings in the browser for the purpose of helping
            you navigate between pages efficiently, remembering your
            preferences, enabling functionality, and helping us understand user
            activity and patterns.
          </li>
          <li>
            Local storage technologies, like HTML5, that provide
            cookie-equivalent functionality but can store larger amounts of
            data, including on your device outside of your browser in connection
            with specific applications.
          </li>
          <li>
            Web beacons, also known as pixel tags or clear GIFs, which are used
            to demonstrate that a webpage or email was accessed or opened, or
            that certain content was viewed or clicked.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: (
      <>
        <p>How we use your personal information</p>
        <p>To operate our Services:</p>
      </>
    ),
    content: (
      <ul className="list-disc pl-6 space-y-2 text-(--color-text-primary) ">
        <li>Provide, operate, maintain, secure and improve our Services.</li>
        <li>Provide our users with customer service.</li>
        <li>
          Communicate with you about our Services, including by sending you
          announcements, updates, security alerts, and support and
          administrative messages.
        </li>
        <li>
          Understand your needs and interests, and personalize your experience
          with our Services and our communications.
        </li>
        <li>Respond to your requests, questions and feedback</li>
      </ul>
    ),
  },
  {
    title: "For research and development",
    content: (
      <>
        <p className="tracking-wide">
          We may use your personal information for research and development
          purposes, including to analyze and improve our Services and our
          business. As part of these activities, we may create aggregated,
          de-identified, or other anonymous data from personal information we
          collect. We make personal information into anonymous data by removing
          information that makes the data personally identifiable to you. We may
          use this anonymous data and share it with third parties for our lawful
          business purposes, including to analyze and improve our Services and
          promote our business.
        </p>
      </>
    ),
  },
  {
    title: "Direct marketing",
    content: (
      <p className="tracking-wide">
        We may from time-to-time send you direct marketing communications as
        permitted by law, including, but not limited to, notifying you of
        special promotions, offers and events via email and in-app
        notifications. You may opt out of our marketing communications as
        described in the “Opt out of marketing communications” section below.
      </p>
    ),
  },
  {
    title: "Compliance and protection",
    content: (
      <>
        <p>We may use personal information to:</p>
        <ul>
          <li>
            Comply with applicable laws, lawful requests, and legal process,
            such as to respond to subpoenas or requests from government
            authorities.
          </li>
          <li>
            Protect our, your or others’ rights, privacy, safety or property
            (including by making and defending legal claims).
          </li>
          <li>
            Audit our internal processes for compliance with legal and
            contractual requirements and internal policies.
          </li>
          <li>Enforce the terms and conditions that govern our Services.</li>
          <li>
            Prevent, identify, investigate and deter fraudulent, harmful,
            unauthorized, unethical or illegal activity, including cyberattacks
            and identity theft.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: (
      <>
        <p>How we share your personal information</p>
        <p>Service providers</p>
      </>
    ),
    content: (
      <p className="tracking-wide">
        We may share your personal information with third party companies and
        individuals that provide services on our behalf or help us operate our
        Services (such as lawyers, bankers, auditors, insurers, customer
        support, hosting, analytics, email delivery, marketing, and database
        management). These third parties also include entities that assist us in
        the administration, processing, servicing, and sale of your loan, such
        as fraud detection services, underwriting services, title companies, and
        financial institutions.
      </p>
    ),
  },
  {
    title: "Authorities and others.",
    content: (
      <p>
        We may disclose your personal information to law enforcement, government
        authorities, and private parties, that we believe in good faith to be
        necessary or appropriate for the compliance and protection purposes
        described above.
      </p>
    ),
  },
  {
    title: "Business transfers",
    content: (
      <p>
        We may sell, transfer or otherwise share some or all of our business or
        assets, including your personal information, in connection with a
        business transaction (or potential business transaction) such as a
        corporate divestiture, merger, consolidation, acquisition,
        reorganization or sale of assets, or in the event of bankruptcy or
        dissolution. In such a case, we will make reasonable efforts to require
        the recipient to honor this Privacy Policy.
      </p>
    ),
  },
  {
    title: "Access or update your information",
    content: (
      <p>
        You may update your personal information in your account by logging in
        and editing your information or contact us at
        <a
          href="mailto:support@planituni.com"
          target="_blank"
          className="pl-2 underline font-bold"
        >
          support@planituni.com
        </a>
      </p>
    ),
  },
  {
    title: "Opt out of marketing communications",
    content: (
      <p>
        You may opt out of marketing-related emails by following the opt-out or
        unsubscribe instructions at the bottom of the email. However, you may
        continue to receive service-related and other non-marketing emails.
      </p>
    ),
  },
  {
    title: "Online tracking opt-out",
    content: (
      <>
        <p>
          There are a number of ways to limit online tracking, we have
          summarized some of the options below:
        </p>
        <ul>
          <li>
            Blocking cookies in your browser. Most browsers let you remove or
            reject cookies. To do this, follow the instructions in your browser
            settings. Many browsers accept cookies by default until you change
            your settings. For more information about cookies, including how to
            see what cookies have been set on your device and how to manage and
            delete them, visit
            <a
              href="https://allaboutcookies.org/"
              target="_blank"
              className="pl-2 underline font-bold"
            >
              www.allaboutcookies.org.
            </a>
          </li>
          <li>
            Using privacy plug-ins or browsers. You can block our websites from
            setting cookies by using a browser with privacy features, like
            <a
              href="https://brave.com/"
              target="_blank"
              className="pl-2 underline font-bold"
            >
              Brave
            </a>
            , or installing browser plugins like{" "}
            <a
              href="https://privacybadger.org/"
              target="_blank"
              className="pl-2 underline font-bold"
            >
              Privacy Badger
            </a>
            ,{" "}
            <a
              href="https://www.ghostery.com/"
              target="_blank"
              className="pl-2 underline font-bold"
            >
              Ghostery
            </a>
            , or{" "}
            <a
              href="https://ublock.org/en"
              target="_blank"
              className="pl-2 underline font-bold"
            >
              uBlock Origin
            </a>
            , and configuring them to block third party cookies/trackers. You
            can also opt out of Google Analytics by downloading and installing
            the browser available at:{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              className="pl-2 underline font-bold"
            >
              https://tools.google.com/dlpage/gaoptout.
            </a>{" "}
          </li>
        </ul>
        <p>
          Note that because these opt-out mechanisms are specific to the device
          or browser on which they are exercised, you will need to opt out on
          every browser and device that you use.
        </p>
      </>
    ),
  },
  {
    title: "Do Not Track",
    content: (
      <p>
        Some Internet browsers may be configured to send “Do Not Track” signals
        to the online services that you visit. We currently do not respond to
        “Do Not Track” or similar signals. To find out more about “Do Not
        Track,” please visit{" "}
        <a
          href="http://www.allaboutdnt.com"
          target="_blank"
          className="pl-2 underline font-bold"
        >
          http://www.allaboutdnt.com.
        </a>
        .
      </p>
    ),
  },
  {
    title: "Other sites, mobile applications and services",
    content: (
      <p>
        Our Services may contain links to other websites, mobile applications,
        and other online services operated by third parties. These links are not
        an endorsement of, or representation that we are affiliated with, any
        third party. In addition, our content may be included on web pages or in
        mobile applications or online services that are not associated with us.
        We do not control third party websites, mobile applications or online
        services, and we are not responsible for their actions. Other websites
        and services follow different rules regarding the collection, use and
        sharing of your personal information. We encourage you to read the
        privacy policies of the other websites and mobile applications and
        online services you use.
      </p>
    ),
  },
  {
    title: "Security",
    content: (
      <p>
        We employ a number of technical, organizational, and physical safeguards
        designed to protect the personal information we collect. However, no
        security measures are failsafe and we cannot guarantee the security of
        your personal information.
      </p>
    ),
  },
  {
    title: "Changes to this Privacy Policy",
    content: (
      <p>
        We reserve the right to modify this Privacy Policy at any time. If we
        make material changes to this Privacy Policy, we will notify you by
        updating the date of this Privacy Policy and posting it on the website.
      </p>
    ),
  },
];
