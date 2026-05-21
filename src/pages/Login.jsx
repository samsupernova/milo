import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Mail, AlertCircle } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { signIn } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";
import authImage from "../assets/auth.jpg";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.success) {
        setUser(result.user);
        setIsLoading(false);
        navigate("/dashboard");
      } else {
        setError(result.error || "Invalid email or password");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/onboarding");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src={authImage}
          alt="auth-img"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-primary-foreground">
          <p className="font-display text-4xl leading-tight">
            "The best parts of my week now happen on a MILO."
          </p>
          <p className="mt-4 text-sm opacity-80">— BUILD YOUR CIRCLE</p>
        </div>
        <Link
          to="/"
          className="absolute left-10 top-10 font-display text-2xl text-primary-foreground text-white"
        >
          milo<span className="text-[var(--coral)]">.</span>
        </Link>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm animate-fade-up">
          <Link
            to="/"
            className="mb-12 inline-block font-display text-2xl lg:hidden"
          >
            milo<span className="text-[var(--coral)]">.</span>
          </Link>
          <h1 className="font-display text-4xl">Welcome to MILO</h1>
          <p className="mt-2 text-muted-foreground">
            Your curated social circle awaits.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive animate-fade-up">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={submit} className="space-y-3 mt-3">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field mt-2"
              disabled={isLoading}
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              disabled={isLoading}
            />
            <div className="flex justify-end">
              <a
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Mail className="h-4 w-4" />{" "}
              {isLoading ? "Logging in..." : "Log in"}{" "}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or{" "}
            <div className="h-px flex-1 bg-border" />
          </div>
          <button
            type="button"
            onClick={handleRegister}
            className="btn-secondary-accent w-full inline-flex items-center justify-center gap-2"
          >
            Create Account
          </button>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            By continuing you agree to our{" "}
            <a
              href="#"
              className="underline hover:opacity-70 transition-opacity"
            >
              Terms
            </a>{" "}
            &{" "}
            <a
              href="#"
              className="underline hover:opacity-70 transition-opacity"
            >
              Privacy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
