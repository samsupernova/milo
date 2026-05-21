import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Settings, LogOut } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { EventCard } from "../components/EventCard";
import { CircleMap } from "../components/CircleMap";
import { CircleCalendar } from "../components/CircleCalendar";
import { getAllEvents } from "../services/events";
import { signOut } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";
import profileImg from "../assets/profile.jpg";

function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [hosted, setHosted] = useState([]);
  const [joined, setJoined] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const allEvents = await getAllEvents();
      
      const hostedEvents = allEvents.filter((event) =>
        user.hosted?.includes(event.id)
      );
      const joinedEvents = allEvents.filter((event) =>
        user.joined?.includes(event.id)
      );
      
      setHosted(hostedEvents);
      setJoined(joinedEvents);
      setLoading(false);
    };

    fetchEvents();
  }, [user]);

  const handleLogout = async () => {
    const result = await signOut();
    if (result.success) {
      setUser(null);
      navigate("/");
    }
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

  const myInterests = user?.interests?.length
    ? user.interests
    : ["Brunches", "Wellness", "Art", "Networking", "Photography"];
  const profileLocation = `${user?.city || "Jaipur"}, ${user?.country || "India"}`;
  const profileRole = user?.occupation || "Member";
  const profileAvatar = user?.avatar || profileImg;

  return (
    <div className="min-h-screen">
      <Navbar variant="app" />
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-10">
        <div className="card-soft animate-fade-up overflow-hidden">
          <div className="h-32 bg-gradient-to-br from-[var(--coral-soft)] to-secondary md:h-44" />
          <div className="-mt-14 px-6 pb-8 md:-mt-16 md:px-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col items-start gap-4 md:flex-row md:items-end">
                <img
                  src={profileAvatar}
                  alt="Profile"
                  className="h-28 w-28 rounded-full border-4 border-card object-cover shadow-soft md:h-32 md:w-32"
                  loading="lazy"
                />
                <div className="md:pb-2">
                  <h1 className="font-display text-3xl md:text-4xl">
                    {user?.name || "Your Name"}
                  </h1>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {profileLocation} ·{" "}
                    {profileRole}
                  </div>
                  <p className="mt-3 max-w-md text-sm text-foreground/80">
                    {user?.name
                      ? `A ${profileRole.toLowerCase()} who loves ${myInterests.slice(0, 3).join(", ")}.`
                      : "Slow weekends, long brunches, watercolor obsession. Always saving a seat for someone new."}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/"
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" /> Edit profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-secondary inline-flex items-center gap-2 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-medium">Interests</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {myInterests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Section title="Hosted Milos">
          <div className="grid gap-6 md:grid-cols-3">
            {hosted.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </Section>

        <CircleMap />

        <CircleCalendar />

        <Section title="Joined Milos">
          <div className="grid gap-6 md:grid-cols-3">
            {joined.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </Section>
      </div>
      <Footer />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-16">
      <h2 className="mb-6 font-display text-2xl">{title}</h2>
      {children}
    </section>
  );
}

export default Profile;
