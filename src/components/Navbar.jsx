import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Navbar({ variant = "landing" }) {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const { pathname } = useLocation();
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links =
    variant === "landing"
      ? []
      : [
          { to: "/dashboard", label: "Feed" },
          { to: "/explore", label: "Explore" },
          { to: "/upcoming", label: "Upcoming" },
          { to: "/host", label: "Host" },
        ];
  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/70 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link
          to="/"
          className="font-display text-2xl font-semibold tracking-tight"
        >
          milo<span className="text-[var(--coral)]">.</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  active
                    ? "text-foreground"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          {variant === "landing" ? (
            <>
              <Link to="/login" className="btn-ghost hidden sm:inline-flex">
                Log in
              </Link>
              <Link to="/login" className="btn-primary">
                Join MILO
              </Link>
            </>
          ) : (
            <Link to="/profile" className="flex items-center gap-2">
              <div className="h-9 w-9 overflow-hidden rounded-full bg-[var(--coral-soft)] ring-1 ring-border">
                <div className="flex h-full w-full items-center justify-center text-sm font-medium">
                  {user?.name?.[0] ? user.name[0] : "A"}
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
