import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Calendar, Bell } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { EventCard } from "../components/EventCard";
import { getAllEvents } from "../services/events";
import { useAuth } from "../contexts/AuthContext";

function Dashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const firstName = user?.name ? user.name.split(" ")[0] : "there";

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const data = await getAllEvents();
      setEvents(data);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  // Get user's upcoming events (joined or hosted)
  const userEvents = events.filter(
    (event) => user?.joined?.includes(event.id) || user?.hosted?.includes(event.id)
  ).slice(0, 2);

  return (
    <div className="min-h-screen">
      <Navbar variant="app" />
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="mb-10 animate-fade-up">
          <h1 className="font-display text-4xl md:text-5xl">Hey {firstName} 👋</h1>
          <p className="mt-2 text-muted-foreground">
            Showing Milos near you · Jaipur 📍
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">For you</h2>
              <div className="flex gap-2">
                {["All", "This week", "Free", "New"].map((tag) => (
                  <button key={tag} className="chip text-xs">
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-24">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--coral)] border-t-transparent" />
              </div>
            ) : events.length === 0 ? (
              <div className="card-soft flex flex-col items-center gap-4 p-12 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl">No events yet</h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Be the first to create an event in your community!
                </p>
                <Link to="/host" className="btn-primary mt-2">
                  Host a Milo
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="card-soft p-6">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <h3 className="font-medium">Trending in Jaipur</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Brunches",
                  "Sunrise Runs",
                  "Startups",
                  "Wellness",
                  "Photography",
                ].map((tag) => (
                  <Link key={tag} to="/explore" className="chip text-xs">
                    #{tag.toLowerCase().replace(/\s/g, "")}
                  </Link>
                ))}
              </div>
            </div>

            <div className="card-soft p-6">
              <div className="mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <h3 className="font-medium">Your week</h3>
              </div>
              {userEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No upcoming events. <Link to="/explore" className="text-[var(--coral)] hover:underline">Explore events</Link>
                </p>
              ) : (
                <ul className="space-y-3">
                  {userEvents.map((event) => (
                    <li key={event.id} className="flex items-center gap-3">
                      <img
                        src={event.image}
                        alt=""
                        className="h-12 w-12 rounded-xl object-cover"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {event.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {event.date} · {event.time}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="card-soft bg-foreground p-6 text-primary-foreground">
              <Bell className="h-5 w-5" />
              <h3 className="mt-3 font-display text-xl">Have an idea?</h3>
              <p className="mt-1 text-sm opacity-70">
                Host your own Milo in 2 minutes.
              </p>
              <Link
                to="/host"
                className="mt-4 inline-flex rounded-full bg-[var(--coral)] px-4 py-2 text-sm text-foreground transition hover:scale-[1.03]"
              >
                Host a Milo
              </Link>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
