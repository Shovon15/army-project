/**
 * URL rules for header / mobile menu items (CMS or dummyData).
 *
 * - `href` on an item always wins.
 * - "home" is "/".
 * - A group parent (`group: true`, or the "pages" slug the CMS uses) has no
 *   page of its own: it only opens a dropdown, and its children live at the
 *   site root (`/faq`, not `/pages/faq`).
 * - Other children nest under their parent (`/collection/<child>`).
 */

type NavNode = { slug?: string; href?: string; group?: boolean };

const GROUP_SLUGS = new Set(["pages"]);

export const isGroupItem = (item: NavNode) =>
  !!item.group || GROUP_SLUGS.has(item.slug ?? "");

export const getNavPath = (item: NavNode) => {
  if (item.href) return item.href;
  if (!item.slug || item.slug === "home") return "/";
  return `/${item.slug}`;
};

export const getNavChildPath = (parent: NavNode, child: NavNode) => {
  if (child.href) return child.href;
  const parentPath = getNavPath(parent);
  if (isGroupItem(parent) || parentPath === "/") return `/${child.slug}`;
  return `${parentPath}/${child.slug}`;
};
