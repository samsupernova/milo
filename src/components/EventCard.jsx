import { Link } from "react-router-dom";
import { Bookmark, MapPin } from "lucide-react";

export function EventCard({ event }) {
  return (
    <Link
      to={`/event/${event.id}`}
      className="group card-soft block overflow-hidden hover:-translate-y-1 hover:shadow-elevated"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur transition hover:bg-background"
          aria-label="Save"
        >
          <Bookmark className="h-4 w-4" />
        </button>
        <div className="absolute left-3 top-3 flex gap-1.5">
          {event.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium backdrop-blur"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="space-y-2 p-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {event.date} · {event.time}
          </span>
          <span className="text-[var(--coral)]">
            {event.spots - (event.joined || 0)} spots
          </span>
        </div>
        <h3 className="font-display text-xl leading-tight">{event.title}</h3>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{event.location}</span>
        </div>
        <p className="pt-1 text-xs text-muted-foreground">
          Hosted by {event.host_name || event.host}
        </p>
      </div>
    </Link>
  );
}
