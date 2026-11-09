import type { MetadataRoute } from "next";
import { featurePages } from "@/content/product";
import { docPages } from "@/content/docs";

const base = "https://scaff.design";

export default function sitemap(): MetadataRoute.Sitemap {
  const top = ["", "/product", "/pricing", "/compare", "/use-cases", "/teams", "/security", "/docs", "/community", "/discover"];
  return [
    ...top.map((p) => ({ url: `${base}${p}`, priority: p === "" ? 1 : 0.8 })),
    ...featurePages.map((f) => ({ url: `${base}/features/${f.slug}`, priority: 0.6 })),
    ...docPages.map((d) => ({ url: `${base}/docs/${d.slug}`, priority: 0.5 })),
  ];
}
