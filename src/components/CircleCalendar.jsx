import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  CalendarDays,
  Plus,
  Sun,
  Cloud,
  CloudRain,
} from "lucide-react";
import { toast } from "sonner";
import { getAllEvents } from "../services/events";
import { useAuth } from "../contexts/AuthContext";

function makeEvents(allEvents, activeUser) {
  const joinedEventIds = activeUser?.joined || [];
  const hostedEventIds = activeUser?.hosted || [];
  
  return allEvents
    .filter((event) => 
      joinedEventIds.includes(event.id) || hostedEventIds.includes(event.id)
    )
    .map((event) => {
      // Parse the date string (e.g., "Sun, May 18")
      const dateStr = event.date;
      const currentYear = new Date().getFullYear();
      
      // Extract month and day from the date string
      const parts = dateStr.split(", ")[1]?.split(" ");
      if (!parts || parts.length < 2) {
        return null;
      }
      
      const monthStr = parts[0];
      const day = parseInt(parts[1]);
      
      const monthMap = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
      };
      
      const month = monthMap[monthStr];
      if (month === undefined) return null;
      
      // Create date object
      let eventDate = new Date(currentYear, month, day);
      
      // If the date is in the past, assume it's next year
      const today = new Date();
      if (eventDate < today) {
        eventDate = new Date(currentYear + 1, month, day);
      }
      
      // Determine category from tags
      const category = event.tags[0] || "General";
      
      // Determine role
      const role = hostedEventIds.includes(event.id) ? "Hosting" : "Joined";
      
      return {
        id: event.id,
        title: event.title,
        date: eventDate,
        time: event.time,
        location: event.location,
        category: category,
        role: role,
      };
    })
    .filter(Boolean); // Remove null entries
}

const CATEGORY_DOT = {
  Sports: "bg-emerald-500",
  Food: "bg-[var(--coral)]",
  Brunches: "bg-[var(--coral)]",
  Books: "bg-amber-500",
  Running: "bg-sky-500",
  Fitness: "bg-emerald-500",
  Networking: "bg-violet-500",
  Startups: "bg-violet-500",
  Wellness: "bg-rose-400",
  Yoga: "bg-rose-400",
  Art: "bg-fuchsia-500",
  Photography: "bg-fuchsia-500",
  Music: "bg-purple-500",
  Travel: "bg-cyan-500",
};

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export function CircleCalendar() {
  const { user } = useAuth();
  const [allEvents, setAllEvents] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const today = new Date();
  const [view, setView] = useState("month");
  const [cursor, setCursor] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate()),
  );
  const [selected, setSelected] = useState(today);

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      const events = await getAllEvents();
      setAllEvents(events);
      setCalendarEvents(makeEvents(events, user));
    };
    fetchEvents();
  }, [user]);

  const monthLabel = cursor.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const days = useMemo(() => {
    if (view === "month") {
      const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
      const startWeekday = first.getDay();
      const start = new Date(first);
      start.setDate(first.getDate() - startWeekday);
      return Array.from({ length: 42 }, (_, i) => {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        return day;
      });
    }

    const start = new Date(selected);
    start.setDate(selected.getDate() - selected.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  }, [view, cursor, selected]);

  const eventsOn = (day) => calendarEvents.filter((event) => sameDay(event.date, day));
  const selectedEvents = eventsOn(selected);

  const agenda = calendarEvents
    .filter(
      (event) =>
        event.date >=
        new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    )
    .sort((a, b) => +a.date - +b.date)
    .slice(0, 5);

  const navigateMonth = (dir) => {
    if (view === "month") {
      setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + dir, 1));
    } else {
      const next = new Date(selected);
      next.setDate(selected.getDate() + dir * 7);
      setSelected(next);
      setCursor(next);
    }
  };

  return (
    <section className="mt-16">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-2xl md:text-3xl">
            My Circle Calendar 🗓️
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep track of your upcoming circles and plans.
          </p>
        </div>
        <button
          onClick={() =>
            toast.success("Google Calendar sync coming soon", {
              description: "We'll keep your circles in sync once connected.",
            })
          }
          className="btn-secondary self-start md:self-auto"
        >
          <CalendarDays className="h-4 w-4" />
          Sync with Google Calendar
        </button>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card-soft p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="font-display text-xl">{monthLabel}</div>
              <button
                onClick={() => navigateMonth(1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelected(today);
                  setCursor(today);
                }}
                className="rounded-full border border-border px-3 py-1.5 text-xs transition-colors hover:bg-secondary"
              >
                Today
              </button>
              <div className="flex overflow-hidden rounded-full border border-border bg-card">
                {["month", "week"].map((value) => (
                  <button
                    key={value}
                    onClick={() => setView(value)}
                    className={`px-3 py-1.5 text-xs capitalize transition-colors ${view === value ? "bg-foreground text-primary-foreground" : "hover:bg-secondary"}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wider text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          <div
            className={`grid grid-cols-7 gap-1 transition-all duration-300 ${view === "week" ? "min-h-[140px]" : ""}`}
          >
            {days.map((day, idx) => {
              const inMonth =
                day.getMonth() === cursor.getMonth() || view === "week";
              const isToday = sameDay(day, today);
              const isSelected = sameDay(day, selected);
              const dayEvents = eventsOn(day);
              return (
                <button
                  key={idx}
                  onClick={() => setSelected(day)}
                  className={`group relative aspect-square min-h-[56px] rounded-2xl p-2 text-left transition-all duration-200 ${
                    isSelected
                      ? "bg-foreground text-primary-foreground shadow-elevated"
                      : isToday
                        ? "bg-secondary"
                        : "hover:bg-secondary/60"
                  } ${!inMonth ? "opacity-35" : ""}`}
                >
                  <div
                    className={`text-sm font-medium ${isToday && !isSelected ? "text-[var(--coral)]" : ""}`}
                  >
                    {day.getDate()}
                  </div>
                  {dayEvents.length > 0 && (
                    <div
                      className={`absolute bottom-2 left-2 right-2 flex items-center gap-1 ${isSelected ? "opacity-90" : ""}`}
                    >
                      {dayEvents.slice(0, 3).map((event, index) => (
                        <span
                          key={index}
                          className={`h-1.5 w-1.5 rounded-full ${CATEGORY_DOT[event.category] ?? "bg-foreground"}`}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="ml-0.5 text-[10px] opacity-70">
                          +{dayEvents.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-lg">
                {selected.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <span className="text-xs text-muted-foreground">
                {selectedEvents.length} circle
                {selectedEvents.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {selectedEvents.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No circles on this day.{" "}
                  <Link
                    to="/explore"
                    className="underline underline-offset-4 hover:text-foreground"
                  >
                    Find one to join
                  </Link>
                  .
                </div>
              ) : (
                selectedEvents.map((event) => (
                  <Link
                    key={event.id}
                    to={`/event/${event.id}`}
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:scale-[1.01] hover:shadow-soft"
                  >
                    <div className="flex flex-col items-center">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${CATEGORY_DOT[event.category] ?? "bg-foreground"}`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate font-medium">
                          {event.title}
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${event.role === "Hosting" ? "bg-foreground text-primary-foreground" : "border border-border bg-secondary/60"}`}
                        >
                          {event.role}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {event.time}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {event.location}
                        </span>
                        <span>· {event.category}</span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        <aside className="card-soft p-5 md:p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg">Upcoming</h3>
            <Link
              to="/explore"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {agenda.map((event) => {
              const isSel = sameDay(event.date, selected);
              return (
                <button
                  key={event.id + event.date.toISOString()}
                  onClick={() => {
                    setSelected(event.date);
                    setCursor(event.date);
                  }}
                  className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition-all hover:scale-[1.01] ${isSel ? "border-foreground bg-secondary/40" : "border-border"}`}
                >
                  <div className="flex w-12 shrink-0 flex-col items-center rounded-xl bg-secondary/60 py-1.5">
                    <span className="text-[10px] uppercase text-muted-foreground">
                      {event.date.toLocaleString("en-US", { month: "short" })}
                    </span>
                    <span className="font-display text-lg leading-none">
                      {event.date.getDate()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${CATEGORY_DOT[event.category] ?? "bg-foreground"}`}
                      />
                      <div className="truncate text-sm font-medium">
                        {event.title}
                      </div>
                    </div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">
                      {event.time} · {event.location}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}
