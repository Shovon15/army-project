// Fallback navigation (used until / unless the CMS returns header items).
export const headerData = {
  title: "Header",
  slug: "header",
  items: [
    {
      title: "Home",
      slug: "home",
      children: [
        { title: "Exhibitions", slug: "exhibitions" },
        { title: "Events", slug: "events" },
      ],
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
      children: [
        { title: "FAQ", slug: "faq" },
        { title: "Privacy Policy", slug: "privacy-policy" },
      ],
    },
    {
      title: "Contact Us",
      slug: "contact",
    },
  ],
};
