import { Metadata } from "next";
import SchemaWrapper from "@/components/layout/schemaWrapper/SchemaWrapper";
import PageHero from "@/components/sections/shared/PageHero";
import SidebarLayout from "@/components/sections/shared/SidebarLayout";
import SidebarLinks from "@/components/sections/shared/SidebarLinks";
import JourneyCard from "@/components/sections/shared/JourneyCard";
import api from "@/config/api/apiList";
import routes from "@/config/routes";
import { CONTACT_INFO } from "@/config/static";
import { pageTitle, SITE_INFORMATION } from "@/config/seo";
import { GetMetaData } from "@/lib/metadata/getMetaData";
import { getWebPageJsonLd } from "@/lib/metadata/jsonLdSchemas/webPageLd";
import { getBreadcrumbJsonLd } from "@/lib/metadata/jsonLdSchemas/breadcrumbLd";

import privacyBanner from "@/assets/images/museum-image-1.jpg";

const BRAND = SITE_INFORMATION.appName;
// TODO: set to the date the policy is approved.
const LAST_UPDATED = "2026-11-10";

export async function generateMetadata(): Promise<Metadata> {
  return await GetMetaData({
    url: api.page.privacyPolicy,
    siteUrl: routes.privacyPolicy,
    fallback: {
      title: pageTitle("Privacy Policy"),
      description: `How the ${SITE_INFORMATION.appName} collects, uses and protects your personal information.`,
    },
  });
}

type PolicySection = { id: string; title: string; body: React.ReactNode };

// TODO: template wording. Have it reviewed by your legal adviser before launch.
const SECTIONS: PolicySection[] = [
  {
    id: "introduction",
    title: "Introduction",
    body: (
      <p>
        {BRAND} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) respects your privacy. This
        policy explains what personal information we collect when you visit our website or museum,
        how we use it, and the choices you have.
      </p>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    body: (
      <>
        <p>We only collect information that helps us serve you better:</p>
        <ul>
          <li><strong>Contact details</strong> you give us, such as your name, email address and phone number when you send a message or subscribe to our newsletter.</li>
          <li><strong>Booking information</strong> when you reserve tickets, tours or workshops.</li>
          <li><strong>Usage data</strong> such as pages visited, browser type and approximate location, collected automatically through cookies and analytics.</li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    body: (
      <ul>
        <li>To respond to your questions and requests.</li>
        <li>To process bookings and send confirmations.</li>
        <li>To send our newsletter, only if you have subscribed.</li>
        <li>To improve our website, exhibitions and visitor experience.</li>
        <li>To meet our legal and security obligations.</li>
      </ul>
    ),
  },
  {
    id: "cookies",
    title: "Cookies & Analytics",
    body: (
      <p>
        Our website uses cookies to remember your preferences and to understand how visitors use
        the site. You can block or delete cookies in your browser settings; some features may not
        work as expected without them.
      </p>
    ),
  },
  {
    id: "sharing",
    title: "Sharing Your Information",
    body: (
      <p>
        We never sell your personal information. We only share it with trusted service providers
        who help us run our website, bookings and newsletter, and only as far as needed for that
        work, or when the law requires it.
      </p>
    ),
  },
  {
    id: "security",
    title: "Data Security & Retention",
    body: (
      <p>
        We use reasonable technical and organisational measures to protect your information. We
        keep personal data only for as long as needed for the purpose it was collected, then delete
        or anonymise it.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your Rights",
    body: (
      <>
        <p>Depending on where you live, you may have the right to:</p>
        <ul>
          <li>Access the personal information we hold about you.</li>
          <li>Ask us to correct or delete it.</li>
          <li>Object to or limit how we use it.</li>
          <li>Unsubscribe from our newsletter at any time using the link in every email.</li>
        </ul>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes To This Policy",
    body: (
      <p>
        We may update this policy from time to time. The &ldquo;last updated&rdquo; date at the top
        of this page shows when it was last changed.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact Us",
    body: (
      <p>
        If you have any questions about this policy or your personal information, email us at{" "}
        <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a> or write to us at{" "}
        {CONTACT_INFO.address}.
      </p>
    ),
  },
];

const BODY = [
  "font-dmSans text-[clamp(15px,1.05vw,17px)] leading-[1.8] text-ink-muted",
  "[&_p+p]:mt-4 [&_p+ul]:mt-4 [&_strong]:text-ink-soft",
  "[&_ul]:space-y-3 [&_ul>li]:relative [&_ul>li]:pl-8",
  "[&_ul>li]:before:absolute [&_ul>li]:before:top-[0.65em] [&_ul>li]:before:left-1 [&_ul>li]:before:h-2.5 [&_ul>li]:before:w-2.5 [&_ul>li]:before:rotate-45 [&_ul>li]:before:bg-primary [&_ul>li]:before:content-['']",
  "[&_a]:font-semibold [&_a]:break-words [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-ink",
].join(" ");

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export default function PrivacyPolicyPage() {
  return (
    <SchemaWrapper
      jsonLd={[
        getWebPageJsonLd({
          path: routes.privacyPolicy,
          name: "Privacy Policy",
          description: `How the ${BRAND} collects, uses and protects your personal information.`,
        }),
        getBreadcrumbJsonLd([
          { name: "Home", path: routes.home },
          { name: "Privacy Policy", path: routes.privacyPolicy },
        ]),
      ]}
    >
      <PageHero
        titleLines={["Privacy Policy"]}
        breadcrumbs={[{ label: "Privacy Policy" }]}
        image={privacyBanner}
      >
        <p className="font-dmSans text-[15px] text-white/80">
          Last updated:{" "}
          <time dateTime={LAST_UPDATED} className="text-white">
            {formatDate(LAST_UPDATED)}
          </time>
        </p>
      </PageHero>

      <SidebarLayout
        sidebar={
          <>
            <SidebarLinks
              title="On This Page"
              links={SECTIONS.map((s) => ({ label: s.title, href: `#${s.id}` }))}
            />
            <JourneyCard title="Questions About Your Privacy?" />
          </>
        }
      >
        <div className="divide-y divide-black/10">
          {SECTIONS.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              aria-labelledby={`${s.id}-title`}
              className="scroll-mt-32 py-9 first:pt-0 last:pb-0"
            >
              <h2
                id={`${s.id}-title`}
                className="flex items-baseline gap-4 font-heading text-[clamp(1.15rem,1.6vw,1.6rem)] leading-title uppercase"
              >
                <span aria-hidden className="text-primary">
                  {String(i + 1).padStart(2, "0")}.
                </span>
                {s.title}
              </h2>
              <div className={`mt-5 ${BODY}`}>{s.body}</div>
            </section>
          ))}
        </div>
      </SidebarLayout>
    </SchemaWrapper>
  );
}
