import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <div className="font-display text-3xl font-semibold tracking-tight">
            milo<span className="text-[var(--coral)]">.</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            A members-only social community for real-life experiences. Currently
            curating moments in Jaipur.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-medium text-foreground">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/explore" className="hover:text-foreground">
                All Milos
              </Link>
            </li>
            <li>
              <Link to="/host" className="hover:text-foreground">
                Host an event
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-foreground">
                Your feed
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-medium text-foreground">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="#" className="hover:text-foreground">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-foreground">
                Community
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-foreground">
                Privacy
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground md:flex-row md:px-10">
          <span>© {new Date().getFullYear()} MILO. Made in Jaipur.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">
              Instagram
            </a>
            <a href="#" className="hover:text-foreground">
              Twitter
            </a>
            <a href="#" className="hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
