import ContentContainer from "@/components/layout/container/contentContainer";
import { cn } from "@/utils/helpers/cn";

/**
 * White section with main content and a sticky sidebar (right on desktop,
 * below the content on mobile). Used by the FAQ and Privacy Policy pages.
 */
const SidebarLayout = ({
  children,
  sidebar,
  className,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  className?: string;
}) => (
  <section className={cn("relative bg-white py-16 text-ink md:py-24", className)}>
    <ContentContainer
      size="narrow"
      className="grid h-auto items-start gap-12 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]"
    >
      <div className="min-w-0">{children}</div>
      <aside className="space-y-7 lg:sticky lg:top-28">{sidebar}</aside>
    </ContentContainer>
  </section>
);

export default SidebarLayout;
