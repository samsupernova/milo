import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md rounded-3xl bg-card p-10 text-center shadow-elevated">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="btn-primary mt-6 inline-flex items-center justify-center gap-2"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
