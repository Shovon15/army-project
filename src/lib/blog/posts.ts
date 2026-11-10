import type { StaticImageData } from "next/image";
import api from "@/config/api/apiList";
import { get } from "@/lib/metadata/fetch";

import post1 from "@/assets/images/post-1.jpg";
import post2 from "@/assets/images/post-2.jpg";
import post3 from "@/assets/images/post-3.jpg";
import post4 from "@/assets/images/collection-item-image-1.jpg";
import post5 from "@/assets/images/exhibition-item-image-1.jpg";
import post6 from "@/assets/images/collection-item-image-3.jpg";

/** One shape for posts from the CMS and the local samples. */
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: StaticImageData | string;
  /** ISO date. */
  published: string;
  category: string | null;
  tags: string[];
  readTime: string | null;
};

export type BlogPostDetail = BlogPost & {
  /** Trusted HTML (CMS body or the local sample below). */
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeyword?: string;
};

// ---------------------------------------------------------------------------
// Local sample posts. Used while NEXT_PUBLIC_BACKEND_URL is empty or the CMS
// is unreachable, so the blog never renders empty.
// TODO: remove once the CMS serves real posts.
// ---------------------------------------------------------------------------

const sampleBody = (topic: string) => `
<p>Every painting has a story. Behind each brushstroke lies a moment in history, a personal struggle, or a bold new idea about how the world could be seen. ${topic} invites us to slow down and look closer.</p>
<p>Great artists rarely paint without purpose. Their choices of colour, light and composition often reflect the beliefs, politics and everyday life of the society around them.</p>
<blockquote>The next time you visit an art museum, spend a few extra moments with a painting that catches your attention. Look closely at the details, read its story, and imagine the world in which it was created.</blockquote>
<p>Many famous works reveal how societies changed over time. Portraits show shifting ideas of status and beauty, while landscapes record cities, fields and coastlines as they once were, seen from the perspective of those who lived there.</p>
<h2>Hidden Symbols in Great Paintings</h2>
<p>Artists throughout history have used symbolism to communicate ideas that could not always be expressed openly. A single flower, a skull or a half-open window can carry a meaning that viewers of the time understood at once.</p>
<ul>
<li>Explore world-famous paintings and their fascinating stories.</li>
<li>Learn how artists used colour and light to guide the eye.</li>
<li>Discover the symbols hidden in everyday objects.</li>
<li>See how history and politics shaped what was painted.</li>
<li>Find new favourites on your next museum visit.</li>
</ul>
<p>Explore the fascinating stories behind history's most celebrated paintings, and you will never look at a gallery wall the same way again.</p>
`;

const SAMPLE_POSTS: BlogPostDetail[] = [
  {
    slug: "the-evolution-of-classical-art-through-centuries",
    title: "The Evolution of Classical Art Through Centuries",
    excerpt: "How classical ideals of balance and beauty changed from ancient Greece to the Renaissance and beyond.",
    image: post1,
    published: "2026-07-28",
    category: "Art History",
    tags: ["History", "Masterpiece", "Museum"],
    readTime: "5 min read",
    content: sampleBody("Classical art"),
  },
  {
    slug: "behind-the-canvas-stories-of-famous-artists",
    title: "Behind the Canvas: Stories of Famous Artists",
    excerpt: "The lives, rivalries and turning points of the painters whose work fills our galleries.",
    image: post2,
    published: "2026-07-21",
    category: "Artists",
    tags: ["Artists", "Painting", "Stories"],
    readTime: "6 min read",
    content: sampleBody("The life of an artist"),
  },
  {
    slug: "understanding-modern-art-and-its-creative-impact",
    title: "Understanding Modern Art and Its Creative Impact",
    excerpt: "A friendly guide to the movements that broke the rules and changed how we see art today.",
    image: post3,
    published: "2026-07-14",
    category: "Modern Art",
    tags: ["Modern", "Movements", "Creativity"],
    readTime: "4 min read",
    content: sampleBody("Modern art"),
  },
  {
    slug: "discover-the-stories-behind-famous-paintings",
    title: "Discover the Stories Behind Famous Paintings",
    excerpt: "Secrets, scandals and surprising details hidden in some of the world's best-known paintings.",
    image: post4,
    published: "2026-07-07",
    category: "Art History",
    tags: ["Paintings", "History", "Symbols"],
    readTime: "5 min read",
    content: sampleBody("A famous painting"),
  },
  {
    slug: "masterpieces-every-art-lover-should-see",
    title: "Masterpieces Every Art Lover Should See",
    excerpt: "Our curators pick the works that are worth planning a whole trip around.",
    image: post5,
    published: "2026-06-30",
    category: "Guides",
    tags: ["Masterpiece", "Guide", "Museum"],
    readTime: "7 min read",
    content: sampleBody("A true masterpiece"),
  },
  {
    slug: "how-museums-preserve-cultural-heritage",
    title: "How Museums Preserve Cultural Heritage",
    excerpt: "Inside the conservation studio: how fragile objects are protected for future generations.",
    image: post6,
    published: "2026-06-23",
    category: "Conservation",
    tags: ["Heritage", "Conservation", "Museum"],
    readTime: "5 min read",
    content: sampleBody("Preserving heritage"),
  },
];

const stripDetail = ({ content, metaTitle, metaDescription, metaKeyword, ...post }: BlogPostDetail): BlogPost => {
  void content; void metaTitle; void metaDescription; void metaKeyword;
  return post;
};

// ---------------------------------------------------------------------------
// CMS mapping
// ---------------------------------------------------------------------------

const fromApiItem = (item: IBlogItem | IBlogPost): BlogPost => ({
  slug: item.slug,
  title: item.title,
  excerpt: item.excerpt ?? "",
  image: item.thumbSd || item.thumb,
  published: item.published,
  category: null,
  tags: item.tags ?? [],
  readTime: "read_time" in item ? item.read_time : null,
});

const hasBackend = () => /^https?:\/\//i.test(api.page.blog);
const FAST = { retries: 1, delay: 0, timeout: 8000 };

/** All posts for the listing page (CMS first, samples as fallback). */
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (hasBackend()) {
    const { data, error } = await get<IBlogResponse>(api.page.blog, undefined, FAST);
    const items = data?.data?.items?.data;
    if (!error && items?.length) return items.map(fromApiItem);
  }
  return SAMPLE_POSTS.map(stripDetail);
}

/** One post plus a few others to show under it. null = not found. */
export async function getBlogPost(
  slug: string,
): Promise<{ post: BlogPostDetail; related: BlogPost[] } | null> {
  if (hasBackend()) {
    const { data, error, status } = await get<IBlogDetailResponse>(
      api.blogDetail(encodeURIComponent(slug)),
      undefined,
      FAST,
    );
    const blog = data?.data?.blog;
    if (!error && blog) {
      const related = [...(data.data.related ?? []), ...(data.data.latest ?? [])]
        .filter((p, i, all) => p.slug !== blog.slug && all.findIndex((q) => q.slug === p.slug) === i)
        .slice(0, 3)
        .map(fromApiItem);
      return {
        post: {
          ...fromApiItem(blog),
          category: blog.category?.title ?? null,
          content: blog.content,
          metaTitle: blog.meta_title,
          metaDescription: blog.meta_description,
          metaKeyword: blog.meta_keyword,
        },
        related,
      };
    }
    // A real 404 from the CMS means the post does not exist.
    if (status === 404) return null;
  }

  const post = SAMPLE_POSTS.find((p) => p.slug === slug);
  if (!post) return null;
  const related = SAMPLE_POSTS.filter((p) => p.slug !== slug).slice(0, 3).map(stripDetail);
  return { post, related };
}

/** Slugs to prerender at build time (samples only; CMS posts render on demand). */
export const getSampleSlugs = () => SAMPLE_POSTS.map((p) => ({ slug: p.slug }));

/** Plain image URL for metadata / JSON-LD. */
export const imageUrl = (image: StaticImageData | string) =>
  typeof image === "string" ? image : image.src;
