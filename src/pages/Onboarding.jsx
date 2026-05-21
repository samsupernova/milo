import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Search,
  Mail,
  Lock,
  AlertCircle,
} from "lucide-react";
import { interests } from "../data/events";
import { signUp } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";

const LOCATIONS = {
  India: {
    Rajasthan: ["Jaipur", "Udaipur", "Jodhpur"],
    Maharashtra: ["Mumbai", "Pune"],
    Karnataka: ["Bangalore", "Mysore"],
    Delhi: ["New Delhi"],
  },
  "United States": {
    California: ["Los Angeles", "San Francisco"],
    "New York": ["New York City", "Brooklyn"],
  },
  "United Kingdom": {
    England: ["London", "Manchester"],
  },
};

function Dropdown({ value, options, onChange, placeholder, disabled }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () =>
      options.filter((option) =>
        option.toLowerCase().includes(q.toLowerCase()),
      ),
    [options, q],
  );

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={`input-field flex items-center justify-between text-left ${disabled ? "opacity-50" : ""}`}
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && !disabled && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-elevated animate-fade-up">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                No matches
              </div>
            )}
            {filtered.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                  setQ("");
                }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-muted"
              >
                {option}
                {option === value && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Onboarding() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    dob: "",
    profession: "",
    country: "",
    state: "",
    city: "",
    gender: "",
    relationship: "",
    interests: [],
  });

  const totalSteps = 5;

  const next = async () => {
    setError("");

    // Step 1 (email/password) validation
    if (step === 1) {
      if (!data.email || !data.password) {
        setError("Please fill in all fields");
        return;
      }
      if (data.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      if (data.password !== data.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    if (step < totalSteps - 1) {
      setStep((current) => current + 1);
    } else {
      // Final step — register the user
      setIsSubmitting(true);
      
      console.log('Starting signup process...');
      const result = await signUp({
        email: data.email,
        password: data.password,
        name: data.name,
        dob: data.dob,
        occupation: data.profession,
        country: data.country,
        state: data.state,
        city: data.city,
        gender: data.gender,
        relationship: data.relationship,
        interests: data.interests,
      });

      console.log('Signup result:', result);

      if (result.success) {
        console.log('Signup successful, setting user and navigating...');
        setUser(result.user);
        navigate("/dashboard");
      } else {
        console.error('Signup failed:', result.error);
        // Handle specific error cases
        if (result.error?.includes("rate limit") || result.error?.includes("Email rate limit exceeded")) {
          setError("Too many signup attempts. Please wait a few minutes before trying again.");
        } else if (result.error?.includes("already registered") || result.error?.includes("already exists")) {
          setError("This email is already registered. Please try logging in instead.");
        } else {
          setError(result.error || "Registration failed. Please try again.");
        }
      }
      
      setIsSubmitting(false);
    }
  };

  const back = () => {
    setError("");
    setStep((current) => Math.max(0, current - 1));
  };

  const toggleInterest = (interest) => {
    setData((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest],
    }));
  };

  const states = data.country ? Object.keys(LOCATIONS[data.country] || {}) : [];
  const cities =
    data.country && data.state
      ? LOCATIONS[data.country]?.[data.state] || []
      : [];

  return (
    <div className="min-h-screen px-6 py-12 md:px-10">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="font-display text-xl">
          milo<span className="text-[var(--coral)]">.</span>
        </Link>

        <div className="mt-12 flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-all ${index <= step ? "bg-foreground" : "bg-border"}`}
            />
          ))}
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Step {step + 1} of {totalSteps}
        </div>

        <div key={step} className="card-soft mt-8 animate-fade-up p-8 md:p-12">
          {/* Step 1: Welcome */}
          {step === 0 && (
            <div className="text-center">
              <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-[var(--coral-soft)]">
                <span className="font-display text-2xl">👋</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl">
                Welcome to MILO
              </h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                A few quick questions so we can curate the right experiences for
                you. Two minutes, promise.
              </p>
            </div>
          )}

          {/* Step 2: Email & Password */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-display text-3xl">Create your account</h2>
              <p className="text-sm text-muted-foreground">
                Your credentials — we'll keep them safe.
              </p>
              {error && (
                <div className="flex items-center gap-2 rounded-2xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive animate-fade-up">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <div className="grid gap-4 pt-2">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    className="input-field pl-11"
                    placeholder="     Email address"
                    value={data.email}
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    className="input-field pl-11"
                    placeholder="     Password (min 6 characters)"
                    value={data.password}
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    className="input-field pl-11"
                    placeholder="     Confirm password"
                    value={data.confirmPassword}
                    onChange={(e) =>
                      setData({ ...data, confirmPassword: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Personal Info */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-display text-3xl">Tell us about you</h2>
              <p className="text-sm text-muted-foreground">
                The basics — only your first name will be public.
              </p>
              <div className="grid gap-4 pt-2">
                <input
                  className="input-field"
                  placeholder="Full name"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
                <input
                  type="date"
                  className="input-field"
                  value={data.dob}
                  onChange={(e) => setData({ ...data, dob: e.target.value })}
                />
                <input
                  className="input-field"
                  placeholder="What you do (e.g. Designer)"
                  value={data.profession}
                  onChange={(e) =>
                    setData({ ...data, profession: e.target.value })
                  }
                />
                <div className="grid gap-3 pt-2 md:grid-cols-3">
                  <Dropdown
                    placeholder="Select country"
                    options={Object.keys(LOCATIONS)}
                    value={data.country}
                    onChange={(value) =>
                      setData({ ...data, country: value, state: "", city: "" })
                    }
                  />
                  <Dropdown
                    placeholder="Select state"
                    options={states}
                    value={data.state}
                    onChange={(value) =>
                      setData({ ...data, state: value, city: "" })
                    }
                    disabled={!data.country}
                  />
                  <Dropdown
                    placeholder="Select city"
                    options={cities}
                    value={data.city}
                    onChange={(value) => setData({ ...data, city: value })}
                    disabled={!data.state}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Gender & Relationship (single-select chips) */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-display text-3xl">A little more</h2>
              <div>
                <p className="mb-3 text-sm text-muted-foreground">Gender</p>
                <div className="flex flex-wrap gap-2">
                  {["Male", "Female", "Other"].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => setData({ ...data, gender })}
                      className={`chip ${data.gender === gender ? "chip-active" : ""}`}
                    >
                      {data.gender === gender && (
                        <Check className="mr-1 h-3.5 w-3.5" />
                      )}
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-sm text-muted-foreground">
                  Relationship status
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Single", "In a Relationship", "Married"].map(
                    (relation) => (
                      <button
                        key={relation}
                        type="button"
                        onClick={() =>
                          setData({ ...data, relationship: relation })
                        }
                        className={`chip ${data.relationship === relation ? "chip-active" : ""}`}
                      >
                        {data.relationship === relation && (
                          <Check className="mr-1 h-3.5 w-3.5" />
                        )}
                        {relation}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Interests (multi-select chips) */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="font-display text-3xl">What are you into?</h2>
              <p className="text-sm text-muted-foreground">
                Pick a few — we'll use these to suggest your first Milos.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`chip ${data.interests.includes(interest) ? "chip-active" : ""}`}
                  >
                    {data.interests.includes(interest) && (
                      <Check className="mr-1 h-3.5 w-3.5" />
                    )}
                    {interest}
                  </button>
                ))}
              </div>
              {data.interests.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {data.interests.length} selected
                </p>
              )}
            </div>
          )}

          {/* Error on final step */}
          {step === totalSteps - 1 && error && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive animate-fade-up">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-10 flex items-center justify-between">
            <button
              type="button"
              onClick={back}
              className="btn-ghost disabled:opacity-0"
              disabled={step === 0}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              type="button"
              onClick={next}
              disabled={isSubmitting}
              className="btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {step === totalSteps - 1 
                ? (isSubmitting ? "Creating account..." : "Finish setup")
                : "Continue"}{" "}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
