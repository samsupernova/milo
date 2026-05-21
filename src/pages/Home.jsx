import { Link } from "react-router-dom";
import { Sparkles, Users, Calendar, ArrowRight, Star } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { EventCard } from "../components/EventCard";
import { events } from "../data/events";
import heroImg from "../assets/hero.jpg";

function Home() {
  return (
    <div className="min-h-screen">
      <Navbar variant="landing" />

      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-12 md:px-10 md:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="animate-fade-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--coral)]" />
              Now curating in Jaipur
            </div>
            <h1 className="font-display text-5xl leading-[1.05] md:text-7xl">
              Find your people.
              <br />
              <span className="italic text-[var(--coral)]">
                Experience
              </span>{" "}
              more.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              MILO is a members-only social circle for real-life experiences —
              brunches, runs, workshops, and the kind of evenings you'll
              actually remember.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/explore" className="btn-primary">
                Explore Milos <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/host" className="btn-secondary">
                Host a Milo
              </Link>
            </div>
            <div className="mt-12 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex -space-x-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-background bg-[var(--coral-soft)]"
                  />
                ))}
              </div>
              <span>500+ members already inside</span>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-elevated">
              <img
                src={heroImg}
                alt="Friends socializing"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden w-56 rounded-3xl bg-card p-4 shadow-elevated md:block">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--coral-soft)]">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">This week</p>
                  <p className="text-sm font-medium">15 new Milos</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 top-10 hidden rounded-2xl bg-card px-4 py-3 shadow-elevated md:block">
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 fill-[var(--coral)] text-[var(--coral)]" />
                <span className="font-medium">Curated weekly</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Why MILO
          </p>
          <h2 className="font-display text-4xl md:text-5xl">
            A softer way to meet people
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "Curated experiences",
              desc: "Every Milo is hand-picked. No noise, no awkward mixers — just the good ones.",
            },
            {
              icon: Users,
              title: "Like-minded people",
              desc: "Members are vetted for warmth and intent. You'll like who you meet.",
            },
            {
              icon: Calendar,
              title: "Host your own",
              desc: "Have an idea? Open it up to the community in two minutes.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="card-soft p-8 hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-[var(--coral-soft)]">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-xl">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              This week in Jaipur
            </p>
            <h2 className="font-display text-4xl md:text-5xl">
              Featured Milos
            </h2>
          </div>
          <Link
            to="/explore"
            className="hidden items-center gap-1 text-sm text-foreground/70 hover:text-foreground md:inline-flex"
          >
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="card-soft overflow-hidden bg-foreground p-12 text-primary-foreground md:p-16">
          <div className="grid gap-12 md:grid-cols-2 md:gap-20">
            <div>
              <h2 className="font-display text-4xl md:text-5xl">
                A community that shows up.
              </h2>
              <p className="mt-4 max-w-md text-sm opacity-70">
                Real numbers from our first months in Jaipur.
              </p>
              <div className="mt-10 grid grid-cols-3 gap-6">
                {[
                  { n: "500+", l: "Members" },
                  { n: "100+", l: "Experiences" },
                  { n: "15+", l: "Weekly events" },
                ].map((stat) => (
                  <div key={stat.l}>
                    <div className="font-display text-3xl text-[var(--coral)] md:text-4xl">
                      {stat.n}
                    </div>
                    <div className="mt-1 text-xs opacity-70">{stat.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              {[
                {
                  q: "I made three real friends in my first month. That hadn't happened in years.",
                  a: "Tanvi, 27",
                },
                {
                  q: "Felt like every event was made for someone like me. The curation is unreal.",
                  a: "Aarav, 24",
                },
              ].map((testimony) => (
                <div
                  key={testimony.a}
                  className="rounded-2xl bg-white/5 p-6 backdrop-blur"
                >
                  <p className="text-base leading-relaxed">"{testimony.q}"</p>
                  <p className="mt-3 text-xs opacity-70">— {testimony.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center md:px-10">
        <h2 className="font-display text-4xl md:text-6xl">
          Your circle is waiting.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Membership is free for now. Two minutes to set up.
        </p>
        <Link
          to="/login"
          className="btn-primary mt-8 inline-flex items-center justify-center gap-2"
        >
          Request your invite <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
