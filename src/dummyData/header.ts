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
        { title: "About us", slug: "#about" },
        { title: "Events", slug: "#events" },
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
