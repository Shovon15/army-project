import { get } from "./fetch";
import { metaDataGenerator } from "./generateMetadata";

type GetMetaDataProps = {
  url?: string;
  siteUrl?: string;
  /** Used when the CMS has no meta for this page (or leaves a field empty). */
  fallback?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};

export const GetMetaData = async ({
  url,
  siteUrl,
  fallback = {},
}: GetMetaDataProps) => {
  const fallbackMeta = () =>
    metaDataGenerator({ ...fallback, canonicalURL: siteUrl });

  try {
    if (!url) return fallbackMeta();

    const response: any = await get(url);

    const meta = response?.data?.data?.meta ?? response?.data?.meta;

    if (!meta) return fallbackMeta();

    const { title, content, meta_image, keyword } = meta;

    const keywordsArray = keyword
      ? keyword.split(",").map((k: string) => k.trim())
      : undefined;

    const openGraphImages = meta_image
      ? [
          {
            url: meta_image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ]
      : undefined;

    return metaDataGenerator({
      title: title || fallback.title,
      description: content || fallback.description,
      canonicalURL: siteUrl,
      keywords: keywordsArray ?? fallback.keywords,
      openGraphImages,
      twitterImages: meta_image ? [meta_image] : undefined,
    });
  } catch (error) {
    console.error("Metadata Error:", error);
    return fallbackMeta();
  }
};
