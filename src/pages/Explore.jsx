import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { EventCard } from "../components/EventCard";
import { getAllEvents } from "../services/events";
import { interests } from "../data/events";

function Explore() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const data = await getAllEvents();
      setEvents(data);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const filtered = useMemo(
    () =>
      events.filter((event) => {
        const matchesQ =
          !q ||
          event.title.toLowerCase().includes(q.toLowerCase()) ||
          event.description.toLowerCase().includes(q.toLowerCase());
        const matchesC = cat === "All" || event.tags.includes(cat);
        return matchesQ && matchesC;
      }),
    [q, cat, events],
  );

  return (
    <div className="min-h-screen">
      <Navbar variant="app" />
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="animate-fade-up">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Jaipur, India
          </p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">Explore</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Every Milo happening this week and beyond — pick your moment.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Milos, hosts, vibes…"
              className="input-field pl-11 py-4 text-base"
            />
          </div>
          <button className="btn-secondary inline-flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {["All", ...interests].map((option) => (
            <button
              key={option}
              onClick={() => setCat(option)}
              className={`chip ${cat === option ? "chip-active" : ""}`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full flex justify-center py-24">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--coral)] border-t-transparent" />
            </div>
          ) : (
            filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="py-24 text-center text-muted-foreground">
            No Milos match yet — try a different vibe.
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Explore;
