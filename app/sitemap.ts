import type { MetadataRoute } from "next";

import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import logger from "@/lib/logger";
import dbConnect from "@/lib/mongoose";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/tags`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/community`,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/jobs`,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  return getDynamicPages(staticPages);
}

async function getDynamicPages(
  staticPages: MetadataRoute.Sitemap
): Promise<MetadataRoute.Sitemap> {
  if (!process.env.MONGODB_URI) return staticPages;

  try {
    await dbConnect();
    const [questions, tags] = await Promise.all([
      Question.find().select("_id").lean().cursor().toArray(),
      Tag.find().select("_id").lean().cursor().toArray(),
    ]);

    return [
      ...staticPages,
      ...questions.map(({ _id }) => ({
        url: `${SITE_URL}/questions/${_id.toString()}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...tags.map(({ _id }) => ({
        url: `${SITE_URL}/tags/${_id.toString()}`,
        changeFrequency: "weekly" as const,
        priority: 0.5,
      })),
    ];
  } catch (error) {
    logger.error({ err: error }, "Unable to load dynamic sitemap entries");
    return staticPages;
  }
}
