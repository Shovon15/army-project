import routes from "@/config/routes";

// Fallback navigation (used until / unless the CMS returns header items).
export const headerData = {
  title: "Header",
  slug: "header",
  items: [
    {
      title: "Home",
      slug: "home",
      children: [
        // One entry per home-page section (ids set on each <section>).
        { title: "Quick Access", slug: "#quick-access" },
        { title: "Key Numbers", slug: "#key-numbers" },
        { title: "Evolution of IED", slug: "#evolution" },
        { title: "World IED Incidents", slug: "#world-incidents" },
        { title: "IED Incidents in Bangladesh", slug: "#bangladesh-incidents" },
        { title: "Disposal Statistics", slug: "#statistics" },
        { title: "Gallery", slug: "#gallery" },
      ],
    },
    {
      title: "About Us",
      slug: "about",
    },
    {
      title: "Events",
      slug: "events",
    },

    // {
    //   title: "Pages",
    //   slug: "pages",
    //   // Dropdown only: there is no /pages page (see utils/helpers/navPaths).
    //   group: true,
    //   children: [
    //     { title: "Gallery", slug: "gallery", href: routes.gallery },
    //   ],
    // },
    { title: "Gallery", slug: "gallery", href: routes.gallery },
  ],
};
