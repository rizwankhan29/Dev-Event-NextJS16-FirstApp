import BookEvent from "@/app/components/BookEvent";
import EventCard from "@/app/components/EventCard";
import { IEvent } from "@/database";
import {
  getEventBySlug,
  getSimilarEventsBySlug,
} from "@/lib/actions/event.action";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => {
  return (
    <div className="flex-row-gap-2 items-center">
      <Image src={icon} alt={alt} width={17} height={17} />
      <span>{label}</span>
    </div>
  );
};

const EventAgenda = ({ agendaItems }: { agendaItems: string[] | string }) => {
  let items: string[] = [];

  if (Array.isArray(agendaItems)) {
    if (typeof agendaItems[0] === "string" && agendaItems[0].startsWith("[")) {
      try {
        items = JSON.parse(agendaItems[0]);
      } catch {
        items = agendaItems;
      }
    } else {
      items = agendaItems;
    }
  } else if (typeof agendaItems === "string" && agendaItems.startsWith("[")) {
    try {
      items = JSON.parse(agendaItems);
    } catch {
      items = [agendaItems];
    }
  }

  return (
    <div className="agenda">
      <h2>Event Agenda</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item || index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const EventTags = ({ tags }: { tags: string[] | string }) => {
  let tagList: string[] = [];

  if (Array.isArray(tags)) {
    if (typeof tags[0] === "string" && tags[0].startsWith("[")) {
      try {
        tagList = JSON.parse(tags[0]);
      } catch {
        tagList = tags;
      }
    } else {
      tagList = tags;
    }
  } else if (typeof tags === "string" && tags.startsWith("[")) {
    try {
      tagList = JSON.parse(tags);
    } catch {
      tagList = [tags];
    }
  }

  return (
    <div className="flex flex-row gap-1.5 flex-wrap">
      {tagList.map((tag, index) => (
        <div className="pill" key={tag || index}>
          {tag}
        </div>
      ))}
    </div>
  );
};

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  "use cache";
  cacheLife("hours");

  const { slug } = await params;

  // 1. Fetch single event directly
  const event = await getEventBySlug(slug);

  if (!event || !event.title) return notFound();

  const {
    _id,
    id = _id,
    title,
    description,
    image,
    overview,
    date,
    time,
    location,
    mode,
    agenda,
    audience,
    tags,
    organizer,
  } = event;

  // 2. Define bookings and similarEvents
  const bookings = 10;
  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p className="mt-2">{description}</p>
      </div>

      <div className="details">
        {/* Left Side */}
        <div className="content">
          <Image
            src={image || "/placeholder.png"}
            alt="event banner"
            width={800}
            height={800}
            className="banner"
          />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="date"
              label={date}
            />
            <EventDetailItem icon="/icons/clock.svg" alt="time" label={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="audience"
              label={audience}
            />
          </section>

          <EventAgenda agendaItems={agenda} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />
        </div>

        {/* Right Side */}
        <div className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 10 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their spot!
              </p>
            ) : (
              <p className="text-sm">Be the first to book your spot!</p>
            )}

            <BookEvent eventId={String(id)} slug={slug} />
          </div>
        </div>
      </div>

      {/* Similar Events Section */}
      <div className="flex w-full flex-col gap-2 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents &&
            similarEvents.length > 0 &&
            similarEvents.map((similarEvent: IEvent) => (
              <EventCard
                key={similarEvent.slug || similarEvent.title}
                {...similarEvent}
              />
            ))}
        </div>
      </div>
    </section>
  );
};

export default EventDetailsPage;
