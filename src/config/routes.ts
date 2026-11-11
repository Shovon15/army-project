const routes = {
  home: "/",
  about: "/about",
  collection: "/collection",
  events: "/events",
  gallery: "/gallery",
  faq: "/faq",
  blog: "/blog",
  blogDetails: (blog_slug: string) => `/blog/${blog_slug}`,
  contact: "/contact",
  termsAndConditions: "/terms-and-conditions",
  privacyPolicy: "/privacy-policy",
};

export default routes;
