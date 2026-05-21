import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Bookmark,
  Calendar,
  MapPin,
  Users,
  Share2,
  ArrowLeft,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { 
  getEventById, 
  deleteEvent, 
  joinEvent as joinEventService, 
  leaveEvent as leaveEventService,
  hasUserJoined,
  isUserHost,
  getEventParticipants
} from "../services/events";
import { useAuth } from "../contexts/AuthContext";
import { getCurrentUser } from "../services/auth";

function EventDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, setUser } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [joinedCount, setJoinedCount] = useState(0);

  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      
      // Fetch event details
      const eventData = await getEventById(id);
      if (!eventData) {
        setLoading(false);
        return;
      }
      
      setEvent(eventData);
      
      // Fetch participants count
      const participants = await getEventParticipants(id);
      setJoinedCount(participants.length);
      
      // Check if user is host or has joined
      if (user) {
        const hostStatus = await isUserHost(id, user.id);
        const joinedStatus = await hasUserJoined(id, user.id);
        setIsHost(hostStatus);
        setIsJoined(joinedStatus);
      }
      
      setLoading(false);
    };

    fetchEventData();
  }, [id, user]);

  const handleJoinLeave = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isJoined) {
      const result = await leaveEventService(id, user.id);
      if (result.success) {
        setIsJoined(false);
        setJoinedCount((count) => Math.max(count - 1, 0));
        
        // Update user context
        const updatedUser = await getCurrentUser();
        setUser(updatedUser);
      }
    } else {
      const result = await joinEventService(id, user.id);
      if (result.success) {
        setIsJoined(true);
        setJoinedCount((count) => count + 1);
        
        // Update user context
        const updatedUser = await getCurrentUser();
        setUser(updatedUser);
      } else {
        alert(result.error || "Failed to join event");
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    const result = await deleteEvent(id, user.id);
    if (result.success) {
      // Update user context
      const updatedUser = await getCurrentUser();
      setUser(updatedUser);
      navigate("/profile");
    } else {
      alert(result.error || "Failed to delete event");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--coral)] border-t-transparent" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <p className="mb-4 text-xl font-medium">Event not found.</p>
          <Link to="/explore" className="btn-primary">
            Back to explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar variant="app" />
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        <Link
          to="/explore"
          className="btn-ghost -ml-2 mb-6 inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to explore
        </Link>

        <div className="overflow-hidden rounded-[2rem] shadow-soft">
          <div className="aspect-[21/9] w-full">
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
          <div className="animate-fade-up">
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--coral-soft)] px-3 py-1 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="mt-4 font-display text-4xl md:text-6xl">
              {event.title}
            </h1>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[var(--coral-soft)]" />
              <div>
                <p className="text-sm">
                  Hosted by <span className="font-medium">{event.host_name}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Member since 2024
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <Detail
                icon={<Calendar className="h-4 w-4" />}
                label="When"
                value={`${event.date} · ${event.time}`}
              />
              <Detail
                icon={<MapPin className="h-4 w-4" />}
                label="Where"
                value={event.location}
              />
              <Detail
                icon={<Users className="h-4 w-4" />}
                label="Going"
                value={`${joinedCount} of ${event.spots}`}
              />
            </div>

            <div className="mt-10">
              <h2 className="font-display text-2xl">About this Milo</h2>
              <p className="mt-3 leading-relaxed text-foreground/80">
                {event.description}
              </p>
              <p className="mt-4 leading-relaxed text-foreground/80">
                The vibe is small, intentional and warm. Members of MILO Jaipur
                only — please RSVP only if you're sure you can make it.
              </p>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card-soft p-6">
              <div className="flex items-baseline justify-between">
                <span className="font-display text-2xl">Free</span>
                <span className="text-xs text-muted-foreground">
                  {event.spots - joinedCount} spots left
                </span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-[var(--coral)]"
                  style={{ width: `${(joinedCount / event.spots) * 100}%` }}
                />
              </div>
              {isHost ? (
                <button
                  type="button"
                  className="btn-primary mt-6 w-full bg-red-600 hover:bg-red-700"
                  onClick={handleDelete}
                >
                  Delete this Milo
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-primary mt-6 w-full"
                  onClick={handleJoinLeave}
                >
                  {isJoined ? "Leave this Milo" : "Join this Milo"}
                </button>
              )}
              <div className="mt-3 flex gap-2">
                <button className="btn-secondary flex-1 inline-flex items-center justify-center gap-2">
                  <Bookmark className="h-4 w-4" /> Save
                </button>
                <button className="btn-secondary flex-1 inline-flex items-center justify-center gap-2">
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                You'll get host details after joining.
              </p>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="card-soft p-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-sm font-medium">{value}</div>
    </div>
  );
}

export default EventDetails;
