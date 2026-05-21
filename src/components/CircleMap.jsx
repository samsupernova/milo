import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Plus, Minus, X, Calendar, Clock } from "lucide-react";
import brunch from "../assets/event-brunch.jpg";
import football from "../assets/event-football.jpg";
import coffee from "../assets/event-coffee.jpg";
import run from "../assets/event-run.jpg";
import wellness from "../assets/event-wellness.jpg";
import art from "../assets/event-art.jpg";

const CIRCLES = [
  {
    id: "jaipur-football-circle",
    title: "Jaipur Football Circle",
    category: "Sports",
    area: "Jhalana Sports Ground",
    date: "Sat, May 17",
    time: "6:30 AM",
    image: football,
    tags: ["Sports", "Fitness"],
    x: 68,
    y: 58,
  },
  {
    id: "sunrise-run-club",
    title: "Sunrise Running Circle",
    category: "Running",
    area: "Central Park",
    date: "Tue, May 20",
    time: "5:45 AM",
    image: run,
    tags: ["Running", "Fitness"],
    x: 46,
    y: 44,
  },
  {
    id: "sunday-brunch-club",
    title: "Sunday Brunch Circle",
    category: "Food",
    area: "C-Scheme",
    date: "Sun, May 18",
    time: "11:00 AM",
    image: brunch,
    tags: ["Brunches", "Food"],
    x: 38,
    y: 52,
  },
  {
    id: "readers-club-jaipur",
    title: "Readers Club Jaipur",
    category: "Books",
    area: "Bani Park",
    date: "Fri, May 23",
    time: "7:00 PM",
    image: art,
    tags: ["Books", "Quiet"],
    x: 30,
    y: 36,
  },
  {
    id: "creative-coffee-meetup",
    title: "Coffee & Conversations",
    category: "Networking",
    area: "Bani Park",
    date: "Wed, May 21",
    time: "5:00 PM",
    image: coffee,
    tags: ["Networking", "Startups"],
    x: 54,
    y: 30,
  },
  {
    id: "wellness-circle",
    title: "Wellness Yoga Circle",
    category: "Wellness",
    area: "Civil Lines",
    date: "Sun, May 25",
    time: "8:00 AM",
    image: wellness,
    tags: ["Wellness", "Yoga"],
    x: 60,
    y: 70,
  },
];

const FILTERS = [
  "All",
  "Sports",
  "Wellness",
  "Books",
  "Food",
  "Networking",
  "Music",
  "Running",
];

export function CircleMap() {
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState(null);
  const [zoom, setZoom] = useState(1);

  const visible = CIRCLES.filter(
    (circle) => active === "All" || circle.category === active,
  );

  return (
    <section className="mt-16">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-2xl md:text-3xl">
            Circles Around You 📍
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore what's happening near you in Jaipur.
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          {visible.length} circles nearby
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setActive(filter);
              setSelected(null);
            }}
            className={`chip ${active === filter ? "chip-active" : ""}`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="card-soft relative mt-5 overflow-hidden">
        <div
          className="relative h-[460px] w-full md:h-[560px]"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 40%, oklch(0.97 0.015 75) 0%, oklch(0.93 0.018 70) 55%, oklch(0.88 0.02 65) 100%)",
          }}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full transition-transform duration-500 ease-out"
            style={{ transform: `scale(${zoom})` }}
          >
            <ellipse
              cx="44"
              cy="44"
              rx="10"
              ry="7"
              fill="oklch(0.86 0.05 145)"
              opacity="0.55"
            />
            <ellipse
              cx="72"
              cy="72"
              rx="8"
              ry="6"
              fill="oklch(0.86 0.05 145)"
              opacity="0.45"
            />
            <ellipse
              cx="22"
              cy="74"
              rx="9"
              ry="5"
              fill="oklch(0.86 0.05 145)"
              opacity="0.4"
            />
            <path
              d="M0,18 Q25,10 50,20 T100,16 L100,8 L0,8 Z"
              fill="oklch(0.85 0.05 230)"
              opacity="0.5"
            />
            <g
              stroke="oklch(0.78 0.012 70)"
              strokeWidth="0.35"
              fill="none"
              opacity="0.7"
            >
              <path d="M0,30 Q35,28 60,40 T100,42" />
              <path d="M0,55 Q30,60 55,55 T100,60" />
              <path d="M0,80 Q40,75 70,82 T100,78" />
              <path d="M20,0 Q24,30 30,55 T40,100" />
              <path d="M55,0 Q58,25 60,50 T68,100" />
              <path d="M82,0 Q80,30 78,60 T82,100" />
            </g>
            <g fill="oklch(0.92 0.012 70)" opacity="0.55">
              <rect x="10" y="34" width="6" height="4" rx="0.6" />
              <rect x="62" y="22" width="5" height="4" rx="0.6" />
              <rect x="78" y="48" width="6" height="3" rx="0.6" />
              <rect x="32" y="64" width="5" height="3" rx="0.6" />
              <rect x="50" y="82" width="6" height="3" rx="0.6" />
            </g>
          </svg>

          {visible.map((circle) => {
            const isSelected = selected?.id === circle.id;
            return (
              <button
                key={circle.id}
                onClick={() => setSelected(isSelected ? null : circle)}
                className="group absolute -translate-x-1/2 -translate-y-full transition-all duration-300 ease-out animate-fade-up"
                style={{ left: `${circle.x}%`, top: `${circle.y}%` }}
                aria-label={circle.title}
              >
                <span
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-card text-card shadow-elevated transition-all duration-300 ${
                    isSelected
                      ? "scale-125 bg-[var(--coral)]"
                      : "bg-foreground group-hover:scale-110 group-hover:bg-[var(--coral)]"
                  }`}
                >
                  <MapPin className="h-4 w-4" strokeWidth={2.5} />
                  {isSelected && (
                    <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[var(--coral)] opacity-60" />
                  )}
                </span>
              </button>
            );
          })}

          <div className="absolute right-4 top-4 flex flex-col overflow-hidden rounded-full border border-border bg-card/90 shadow-soft backdrop-blur">
            <button
              onClick={() =>
                setZoom((value) => Math.min(1.4, +(value + 0.1).toFixed(2)))
              }
              className="flex h-9 w-9 items-center justify-center transition-colors hover:bg-secondary"
              aria-label="Zoom in"
            >
              <Plus className="h-4 w-4" />
            </button>
            <div className="h-px bg-border" />
            <button
              onClick={() =>
                setZoom((value) => Math.max(0.9, +(value - 0.1).toFixed(2)))
              }
              className="flex h-9 w-9 items-center justify-center transition-colors hover:bg-secondary"
              aria-label="Zoom out"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>

          <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs shadow-soft backdrop-blur">
            <MapPin className="h-3.5 w-3.5" /> Jaipur, India
          </div>

          {selected && (
            <div className="absolute bottom-4 left-1/2 w-[92%] max-w-md -translate-x-1/2 animate-fade-up md:bottom-6 md:left-6 md:translate-x-0">
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={selected.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => setSelected(null)}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-foreground shadow-soft backdrop-blur transition-transform hover:scale-105"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg leading-tight">
                    {selected.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {selected.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {selected.time}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {selected.area}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {selected.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-secondary/60 px-2.5 py-0.5 text-[11px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/event/${selected.id}`}
                    className="btn-primary mt-4 inline-flex w-full items-center justify-center"
                  >
                    View Circle
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
