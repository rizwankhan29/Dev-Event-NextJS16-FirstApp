"use server";

import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

// 1. Fetch all events for homepage
export const getEvents = async () => {
  try {
    await connectDB();
    const events = await Event.find({}).sort({ createdAt: -1 }).lean();
    return { events: JSON.parse(JSON.stringify(events)) };
  } catch (e) {
    console.error("Error fetching all events:", e);
    return { events: [] };
  }
};

// 2. Fetch single event by slug for event details page
export const getEventBySlug = async (slug: string) => {
  try {
    await connectDB();
    const event = await Event.findOne({ slug }).lean();
    if (!event) return null;
    return JSON.parse(JSON.stringify(event));
  } catch (e) {
    console.error("Error fetching event by slug:", e);
    return null;
  }
};

// 3. Existing function
export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectDB();

    const event = await Event.findOne({ slug });

    if (!event) return [];

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

    const similarEvents = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: parsedTags },
    }).lean();

    return JSON.parse(JSON.stringify(similarEvents));
  } catch (e) {
    console.error("Error fetching similar events:", e);
    return [];
  }
};
