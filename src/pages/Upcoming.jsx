import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Sparkles,
  MessageCircle,
  Crown,
  Sun,
  Cloud,
  CloudRain,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CircleCalendar } from "../components/CircleCalendar";
import { getAllEvents } from "../services/events";
import { useAuth } from "../contexts/AuthContext";
import { getISODate, getWeatherIcon } from "../utils/weather";
const TAG_COLORS = {
  Sports: "bg-emerald-100 text-emerald-700",
  Fitness: "bg-sky-100 text-sky-700",
  Brunches: "bg-amber-100 text-amber-700",
  Food: "bg-orange-100 text-orange-700",
  Networking: "bg-violet-100 text-violet-700",
  Startups: "bg-indigo-100 text-indigo-700",
  Running: "bg-cyan-100 text-cyan-700",
  Wellness: "bg-rose-100 text-rose-700",
  Yoga: "bg-pink-100 text-pink-700",
  Art: "bg-fuchsia-100 text-fuchsia-700",
  Photography: "bg-purple-100 text-purple-700",
};
function Upcoming() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [hostedEvents, setHostedEvents] = useState([]);
  const { user } = useAuth();

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      
      // Refresh user data from localStorage to get latest joined/hosted arrays
      const currentUser = localStorage.getItem('milo_current_user');
      const userData = currentUser ? JSON.parse(currentUser) : user;
      
      const allEvents = await getAllEvents();
      
      // Filter joined and hosted events
      const joined = allEvents.filter((event) =>
        userData.joined?.includes(event.id)
      );
      const hosted = allEvents.filter((event) =>
        userData.hosted?.includes(event.id)
      );
      
      setJoinedEvents(joined);
      setHostedEvents(hosted);
      setLoading(false);
    };

    fetchEvents();
  }, [user]);

  // Fetch weather for all events
  useEffect(() => {
    const fetchWeatherForEvents = async () => {
      const allEvents = [...hostedEvents, ...joinedEvents];
      const uniqueDates = [...new Set(allEvents.map(e => getISODate(e.date)))].filter(Boolean);
      
      if (uniqueDates.length === 0) return;
      
      try {
        const lat = 26.9124;
        const lon = 75.7873;
        
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode&timezone=Asia/Kolkata&forecast_days=16`
        );
        
        const data = await response.json();
        
        if (data.daily) {
          const weatherMap = {};
          data.daily.time.forEach((date, index) => {
            weatherMap[date] = data.daily.weathercode[index];
          });
          setWeatherData(weatherMap);
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };
    
    fetchWeatherForEvents();
  }, [hostedEvents.length, joinedEvents.length]);

  const getWeatherIconComponent = (eventDate) => {
    const isoDate = getISODate(eventDate);
    if (!isoDate || !weatherData[isoDate]) return null;
    
    const iconType = getWeatherIcon(weatherData[isoDate]);
    const iconClass = "h-4 w-4";
    
    if (iconType === "sun") return <Sun className={`${iconClass} text-yellow-500`} />;
    if (iconType === "rain") return <CloudRain className={`${iconClass} text-blue-500`} />;
    return <Cloud className={`${iconClass} text-gray-400`} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar variant="app" />
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--coral)] border-t-transparent" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Navbar variant="app" />
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--coral-soft)]">
              <Calendar className="h-5 w-5 text-[var(--coral)]" />
            </div>
            <div>
              <h1 className="font-display text-4xl md:text-5xl">
                Upcoming Milos
              </h1>
              <p className="mt-1 text-muted-foreground">
                {hostedEvents.length} hosting · {joinedEvents.length} joined
              </p>
            </div>
          </div>
        </div>

        {/* Hosted Events Section */}
        {hostedEvents.length > 0 && (
          <div className="mb-12 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100">
                <Crown className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 className="font-display text-2xl">You are the Host</h2>
                <p className="text-sm text-muted-foreground">
                  {hostedEvents.length} {hostedEvents.length === 1 ? "event" : "events"} you're hosting
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {hostedEvents.map((event) => {
                const isActive = selectedEvent?.id === event.id;
                return (
                  <div
                    key={event.id}
                    className={`card-soft group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated ${
                      isActive ? "ring-2 ring-amber-500 shadow-elevated" : ""
                    }`}
                    onClick={() => setSelectedEvent(isActive ? null : event)}
                  >
                    <div className="flex gap-5 p-5 md:p-6">
                      {/* Event image */}
                      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl md:h-32 md:w-32">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute top-2 right-2 rounded-full bg-amber-500 p-1.5 shadow-lg">
                          <Crown className="h-3.5 w-3.5 text-white" />
                        </div>
                      </div>
                      {/* Event info */}
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            {event.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${TAG_COLORS[tag] || "bg-secondary text-muted-foreground"}`}
                              >
                                {tag}
                              </span>
                            ))}
                            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-medium text-amber-700">
                              👑 Host
                            </span>
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div>
                              <h3 className="font-display text-xl leading-tight group-hover:text-amber-600 transition-colors">
                                {event.title}
                              </h3>
                              <p className="mt-1 text-sm text-muted-foreground">
                                You are hosting this event
                              </p>
                            </div>
                            <Link
                              to={`/discussion/${event.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition hover:border-amber-500 hover:text-amber-600"
                            >
                              <MessageCircle className="h-4 w-4" />
                              Discuss
                            </Link>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {event.date} ·{" "}
                            {event.time}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {event.location}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Users className="h-3 w-3" /> {event.joined}/
                            {event.spots} joined
                          </span>
                          {getWeatherIconComponent(event.date) && (
                            <span className="inline-flex items-center gap-1">
                              {getWeatherIconComponent(event.date)}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Arrow */}
                      <div className="hidden items-center md:flex">
                        <ChevronRight
                          className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isActive ? "rotate-90" : "group-hover:translate-x-1"}`}
                        />
                      </div>
                    </div>
                    {/* Expanded description */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isActive ? "max-h-60" : "max-h-0"
                      }`}
                    >
                      <div className="border-t border-border px-6 py-5">
                        <p className="text-sm leading-relaxed text-foreground/80">
                          {event.description}
                        </p>
                        <div className="mt-4 flex gap-3">
                          <Link
                            to={`/event/${event.id}`}
                            className="btn-primary text-sm bg-amber-500 hover:bg-amber-600"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Manage Event
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Joined Events Section */}
        {joinedEvents.length > 0 && (
          <div className="mb-12 animate-fade-up" style={{ animationDelay: hostedEvents.length > 0 ? "0.2s" : "0.1s" }}>
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--coral-soft)]">
                <Sparkles className="h-5 w-5 text-[var(--coral)]" />
              </div>
              <div>
                <h2 className="font-display text-2xl">Upcoming Milos</h2>
                <p className="text-sm text-muted-foreground">
                  {joinedEvents.length} {joinedEvents.length === 1 ? "circle" : "circles"} you're part of
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Event list */}
        <div className="space-y-4 animate-fade-up" style={{ animationDelay: hostedEvents.length > 0 ? "0.3s" : "0.2s" }}>
          {joinedEvents.length === 0 && hostedEvents.length === 0 ? (
            <div className="card-soft flex flex-col items-center gap-4 p-12 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary">
                <Sparkles className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl">No upcoming Milos yet</h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Explore circles near you and join one that sparks your interest.
              </p>
              <Link to="/explore" className="btn-primary mt-2">
                Explore Milos
              </Link>
            </div>
          ) : (
            joinedEvents.map((event) => {
              const isActive = selectedEvent?.id === event.id;
              return (
                <div
                  key={event.id}
                  className={`card-soft group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated ${
                    isActive ? "ring-2 ring-[var(--coral)] shadow-elevated" : ""
                  }`}
                  onClick={() => setSelectedEvent(isActive ? null : event)}
                >
                  <div className="flex gap-5 p-5 md:p-6">
                    {/* Event image */}
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl md:h-32 md:w-32">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    {/* Event info */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          {event.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${TAG_COLORS[tag] || "bg-secondary text-muted-foreground"}`}
                            >
                              {tag}
                            </span>
                          ))}
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700">
                            ✓ Joined
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div>
                            <h3 className="font-display text-xl leading-tight group-hover:text-[var(--coral)] transition-colors">
                              {event.title}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Hosted by {event.host_name}
                            </p>
                          </div>
                          <Link
                            to={`/discussion/${event.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition hover:border-[var(--coral)] hover:text-[var(--coral)]"
                          >
                            <MessageCircle className="h-4 w-4" />
                            Discuss
                          </Link>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {event.date} ·{" "}
                          {event.time}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {event.location}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3 w-3" /> {event.joined}/
                          {event.spots} joined
                        </span>
                        {getWeatherIconComponent(event.date) && (
                          <span className="inline-flex items-center gap-1">
                            {getWeatherIconComponent(event.date)}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Arrow */}
                    <div className="hidden items-center md:flex">
                      <ChevronRight
                        className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isActive ? "rotate-90" : "group-hover:translate-x-1"}`}
                      />
                    </div>
                  </div>
                  {/* Expanded description */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isActive ? "max-h-60" : "max-h-0"
                    }`}
                  >
                    <div className="border-t border-border px-6 py-5">
                      <p className="text-sm leading-relaxed text-foreground/80">
                        {event.description}
                      </p>
                      <div className="mt-4 flex gap-3">
                        <Link
                          to={`/event/${event.id}`}
                          className="btn-primary text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Details
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {/* Calendar section */}
        <CircleCalendar />
      </div>
      <Footer />
    </div>
  );
}
export default Upcoming;
