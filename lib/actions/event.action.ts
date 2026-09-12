"use server";

import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectDB();

    const event = await Event.findOne({ slug });

    if (!event) return [];

    // 1. Handle both clean string arrays AND stringified JSON tags stored in older documents
    let parsedTags: string[] = [];

    if (Array.isArray(event.tags) && event.tags.length > 0) {
      if (typeof event.tags[0] === "string" && event.tags[0].startsWith("[")) {
        try {
          parsedTags = JSON.parse(event.tags[0]);
        } catch {
          parsedTags = event.tags;
        }
      } else {
        parsedTags = event.tags;
      }
    }

    // 2. Query similar events using the normalized tags array
    const similarEvents = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: parsedTags }, // 👈 Uses clean parsed array!
    }).lean();

    return JSON.parse(JSON.stringify(similarEvents));
  } catch (e) {
    console.error("Error fetching similar events:", e);
    return [];
  }
};
