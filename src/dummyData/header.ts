import routes from "@/config/routes";

// Fallback navigation (used until / unless the CMS returns header items).
export const headerData = {
  title: "Header",
  slug: "header",
  items: [
    {
      title: "Home",
      slug: "home",
      // children: [
      //   { title: "Exhibitions", slug: "exhibitions" },
      //   { title: "Events", slug: "events" },
      // ],
    },
    {
      title: "About Us",
      slug: "about",
    },
    {
      title: "Collection",
      slug: "collection",
    },
    {
      title: "Blog",
      slug: "blog",
    },
    {
      title: "Pages",
      slug: "pages",
      // Dropdown only: there is no /pages page (see utils/helpers/navPaths).
      group: true,
      children: [
        { title: "Image Gallery", slug: "image-gallery", href: routes.gallery },
        { title: "FAQ", slug: "faq", href: routes.faq },
        {
          title: "Privacy Policy",
          slug: "privacy-policy",
          href: routes.privacyPolicy,
        },
      ],
    },
    {
      title: "Contact Us",
      slug: "contact",
    },
  ],
};
