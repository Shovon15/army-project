import { Metadata } from "next";
import SchemaWrapper from "@/components/layout/schemaWrapper/SchemaWrapper";
import PageHero from "@/components/sections/shared/PageHero";
import SidebarLayout from "@/components/sections/shared/SidebarLayout";
import SidebarLinks from "@/components/sections/shared/SidebarLinks";
import JourneyCard from "@/components/sections/shared/JourneyCard";
import SectionBadge from "@/components/common/typography/SectionBadge";
import { Accordion } from "@/components/common/accordion/Accordion";
import api from "@/config/api/apiList";
import routes from "@/config/routes";
import { pageTitle } from "@/config/seo";
import { ALL_FAQS, FAQ_GROUPS } from "@/lib/faq/faqs";
import { GetMetaData } from "@/lib/metadata/getMetaData";
import { getWebPageJsonLd } from "@/lib/metadata/jsonLdSchemas/webPageLd";
import { getBreadcrumbJsonLd } from "@/lib/metadata/jsonLdSchemas/breadcrumbLd";
import { getFaqPageJsonLd } from "@/lib/metadata/jsonLdSchemas/faqPageLd";

import faqBanner from "@/assets/images/who-we-are-image-4.jpg";

const PAGE_DESCRIPTION =
  "Answers to common questions about the Bangladesh Army Corps of Engineers: its role, activities, events and how to get in touch.";

export async function generateMetadata(): Promise<Metadata> {
  return await GetMetaData({
    url: api.page.faq,
    siteUrl: routes.faq,
    fallback: {
      title: pageTitle("Frequently Asked Questions"),
      description: PAGE_DESCRIPTION,
    },
  });
}

export default function FaqPage() {
  return (
    <SchemaWrapper
      jsonLd={[
        getWebPageJsonLd({
          path: routes.faq,
          name: "Frequently Asked Questions",
          description:
            PAGE_DESCRIPTION,
        }),
        getBreadcrumbJsonLd([
          { name: "Home", path: routes.home },
          { name: "FAQs", path: routes.faq },
        ]),
        getFaqPageJsonLd({ path: routes.faq, faqs: ALL_FAQS }),
      ]}
    >
      <PageHero
        titleLines={["Frequently Asked", "Questions"]}
        breadcrumbs={[{ label: "FAQs" }]}
        image={faqBanner}
        titleClassName="text-[clamp(2rem,4.4vw,4rem)]"
      />

      <SidebarLayout
        sidebar={
          <>
            <SidebarLinks
              title="Question Categories"
              links={FAQ_GROUPS.map((g) => ({ label: g.title, href: `#${g.id}` }))}
            />
            <JourneyCard />
          </>
        }
      >
        <div className="space-y-14 md:space-y-16">
          {FAQ_GROUPS.map((group, i) => (
            <section
              key={group.id}
              id={group.id}
              aria-labelledby={`${group.id}-title`}
              className="scroll-mt-32"
            >
              <SectionBadge>{String(i + 1).padStart(2, "0")} · FAQs</SectionBadge>
              <h2
                id={`${group.id}-title`}
                className="mt-4 mb-7 font-heading text-[clamp(1.3rem,1.9vw,1.9rem)] leading-title uppercase"
              >
                {group.title}
              </h2>
              {/* Ivory rows so the white accordion cards stand out on the white section. */}
              <div className="rounded-[24px] bg-surface-light p-3 md:p-4">
                <Accordion items={group.items} tag="h3" columns={1} defaultOpenFirst={i === 0} />
              </div>
            </section>
          ))}
        </div>
      </SidebarLayout>
    </SchemaWrapper>
  );
}
