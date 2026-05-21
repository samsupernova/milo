import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, ArrowRight, MapPin, Plus, Minus, Cloud, CloudRain, Sun, Wind } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { createEvent } from "../services/events";
import { getCurrentUser } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";

function Host() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categories: [],
    date: "",
    time: "",
    location: "",
    spots: 10,
    image: null,
    imagePreview: null,
  });

  const [errors, setErrors] = useState({});
  const [zoom, setZoom] = useState(1);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  const interests = [
    "Sports",
    "Fitness",
    "Wellness",
    "Art",
    "Music",
    "Networking",
    "Travel",
    "Food",
    "Brunches",
    "Running",
    "Startups",
    "Photography",
  ];

  // Jaipur locations with coordinates
  const jaipurLocations = [
    { name: "C-Scheme, Jaipur", x: 38, y: 52, lat: 26.9124, lon: 75.7873 },
    { name: "Jhalana Sports Ground, Jaipur", x: 68, y: 58, lat: 26.9260, lon: 75.8235 },
    { name: "Central Park, Jaipur", x: 46, y: 44, lat: 26.9176, lon: 75.8083 },
    { name: "Bani Park, Jaipur", x: 30, y: 36, lat: 26.9239, lon: 75.7849 },
    { name: "Civil Lines, Jaipur", x: 60, y: 70, lat: 26.9050, lon: 75.8150 },
    { name: "Hawa Mahal Studios, Jaipur", x: 54, y: 30, lat: 26.9239, lon: 75.8267 },
    { name: "MI Road, Jaipur", x: 42, y: 60, lat: 26.9124, lon: 75.7873 },
    { name: "Vaishali Nagar, Jaipur", x: 25, y: 55, lat: 26.9000, lon: 75.7500 },
  ];

  // Fetch weather data when date is selected
  useEffect(() => {
    if (formData.date) {
      fetchWeather();
    }
  }, [formData.date]);

  const fetchWeather = async () => {
    setLoadingWeather(true);
    try {
      // Jaipur coordinates
      const lat = 26.9124;
      const lon = 75.7873;
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max,weathercode&timezone=Asia/Kolkata`
      );
      
      const data = await response.json();
      
      if (data.daily && formData.date) {
        const dateIndex = data.daily.time.indexOf(formData.date);
        if (dateIndex !== -1) {
          setWeather({
            tempMax: Math.round(data.daily.temperature_2m_max[dateIndex]),
            tempMin: Math.round(data.daily.temperature_2m_min[dateIndex]),
            precipitation: data.daily.precipitation_probability_max[dateIndex],
            windSpeed: Math.round(data.daily.windspeed_10m_max[dateIndex]),
            weatherCode: data.daily.weathercode[dateIndex],
          });
        }
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoadingWeather(false);
    }
  };

  const getWeatherIcon = (code) => {
    if (code === 0) return <Sun className="h-5 w-5 text-yellow-500" />;
    if (code <= 3) return <Cloud className="h-5 w-5 text-gray-400" />;
    if (code <= 67) return <CloudRain className="h-5 w-5 text-blue-500" />;
    return <Cloud className="h-5 w-5 text-gray-400" />;
  };

  const getWeatherDescription = (code) => {
    if (code === 0) return "Clear sky";
    if (code <= 3) return "Partly cloudy";
    if (code <= 67) return "Rainy";
    if (code <= 77) return "Snowy";
    return "Cloudy";
  };

  const handleLocationClick = (location) => {
    setFormData((prev) => ({ ...prev, location: location.name }));
  };

  const toggleCategory = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imagePreview: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const generateEventId = (title) => {
    const kebabTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const randomChars = Math.random().toString(36).substring(2, 6);
    return `${kebabTitle}-${randomChars}`;
  };

  const formatDateForDisplay = (isoDate) => {
    const date = new Date(isoDate);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();

    return `${dayName}, ${monthName} ${day}`;
  };

  const formatTimeForDisplay = (time24) => {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title || formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description || formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (formData.categories.length === 0) {
      newErrors.categories = "Please select at least one category";
    }

    if (!formData.date) {
      newErrors.date = "Please select a date";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Event date must be today or in the future";
      }
    }

    if (!formData.time) {
      newErrors.time = "Please select a time";
    }

    if (!formData.location || formData.location.length < 3) {
      newErrors.location = "Location must be at least 3 characters";
    }

    if (!formData.spots || formData.spots < 2) {
      newErrors.spots = "Minimum 2 participants required";
    }

    if (!formData.image) {
      newErrors.image = "Please upload a cover image";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to host an event");
      navigate("/login");
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const imageUrl = formData.imagePreview;

      const eventData = {
        title: formData.title,
        date: formatDateForDisplay(formData.date),
        time: formatTimeForDisplay(formData.time),
        location: formData.location,
        image: imageUrl,
        tags: formData.categories,
        description: formData.description,
        spots: parseInt(formData.spots),
      };

      const result = await createEvent(eventData, user.id, user.name);
      
      if (result.success) {
        // Refresh user context to show new hosted event
        const updatedUser = await getCurrentUser();
        setUser(updatedUser);
        navigate(`/event/${result.event.id}`);
      } else {
        alert(result.error || "Failed to create event. Please try again.");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar variant="app" />
      <div className="mx-auto max-w-3xl px-6 py-12 md:px-10">
        <div className="animate-fade-up text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Hosting
          </p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">
            Host a Milo
          </h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Share something you'd actually want to do. We'll surface it to the
            right people in Jaipur.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card-soft mt-12 p-8 md:p-12 space-y-6"
        >
          <Field label="Title" error={errors.title}>
            <input
              className="input-field"
              placeholder="e.g. Sunday morning brunch club"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </Field>

          <Field label="Description" error={errors.description}>
            <textarea
              rows={5}
              className="input-field resize-none"
              placeholder="Tell people what to expect, who it's for, what makes it special…"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </Field>

          <Field label="Category" error={errors.categories}>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleCategory(interest)}
                  className={`chip ${
                    formData.categories.includes(interest) ? "chip-active" : ""
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Date" error={errors.date}>
              <input
                type="date"
                className="input-field"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </Field>
            <Field label="Time" error={errors.time}>
              <input
                type="time"
                className="input-field"
                value={formData.time}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, time: e.target.value }))
                }
              />
            </Field>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Location" error={errors.location}>
              <input
                className="input-field"
                placeholder="Neighborhood, Jaipur"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
              />
            </Field>
            <Field label="Max participants" error={errors.spots}>
              <input
                type="number"
                min="2"
                className="input-field"
                placeholder="10"
                value={formData.spots}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    spots: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </Field>
          </div>

          {/* Interactive Map Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Select Location on Map
            </label>
            <div className="card-soft relative overflow-hidden">
              <div
                className="relative h-[360px] w-full"
                style={{
                  background:
                    "radial-gradient(120% 80% at 50% 40%, oklch(0.97 0.015 75) 0%, oklch(0.93 0.018 70) 55%, oklch(0.88 0.02 65) 100%)",
                }}
              >
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-0 h-full w-full transition-transform duration-500 ease-out"
                  style={{ transform: `scale(${zoom})` }}
                >
                  <ellipse
                    cx="44"
                    cy="44"
                    rx="10"
                    ry="7"
                    fill="oklch(0.86 0.05 145)"
                    opacity="0.55"
                  />
                  <ellipse
                    cx="72"
                    cy="72"
                    rx="8"
                    ry="6"
                    fill="oklch(0.86 0.05 145)"
                    opacity="0.45"
                  />
                  <ellipse
                    cx="22"
                    cy="74"
                    rx="9"
                    ry="5"
                    fill="oklch(0.86 0.05 145)"
                    opacity="0.4"
                  />
                  <path
                    d="M0,18 Q25,10 50,20 T100,16 L100,8 L0,8 Z"
                    fill="oklch(0.85 0.05 230)"
                    opacity="0.5"
                  />
                  <g
                    stroke="oklch(0.78 0.012 70)"
                    strokeWidth="0.35"
                    fill="none"
                    opacity="0.7"
                  >
                    <path d="M0,30 Q35,28 60,40 T100,42" />
                    <path d="M0,55 Q30,60 55,55 T100,60" />
                    <path d="M0,80 Q40,75 70,82 T100,78" />
                    <path d="M20,0 Q24,30 30,55 T40,100" />
                    <path d="M55,0 Q58,25 60,50 T68,100" />
                    <path d="M82,0 Q80,30 78,60 T82,100" />
                  </g>
                  <g fill="oklch(0.92 0.012 70)" opacity="0.55">
                    <rect x="10" y="34" width="6" height="4" rx="0.6" />
                    <rect x="62" y="22" width="5" height="4" rx="0.6" />
                    <rect x="78" y="48" width="6" height="3" rx="0.6" />
                    <rect x="32" y="64" width="5" height="3" rx="0.6" />
                    <rect x="50" y="82" width="6" height="3" rx="0.6" />
                  </g>
                </svg>

                {jaipurLocations.map((location) => {
                  const isSelected = formData.location === location.name;
                  return (
                    <button
                      key={location.name}
                      type="button"
                      onClick={() => handleLocationClick(location)}
                      className="group absolute -translate-x-1/2 -translate-y-full transition-all duration-300 ease-out animate-fade-up"
                      style={{ left: `${location.x}%`, top: `${location.y}%` }}
                      aria-label={location.name}
                    >
                      <span
                        className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-card text-card shadow-elevated transition-all duration-300 ${
                          isSelected
                            ? "scale-125 bg-[var(--coral)]"
                            : "bg-foreground group-hover:scale-110 group-hover:bg-[var(--coral)]"
                        }`}
                      >
                        <MapPin className="h-3.5 w-3.5" strokeWidth={2.5} />
                        {isSelected && (
                          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[var(--coral)] opacity-60" />
                        )}
                      </span>
                    </button>
                  );
                })}

                <div className="absolute right-4 top-4 flex flex-col overflow-hidden rounded-full border border-border bg-card/90 shadow-soft backdrop-blur">
                  <button
                    type="button"
                    onClick={() =>
                      setZoom((value) => Math.min(1.4, +(value + 0.1).toFixed(2)))
                    }
                    className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-secondary"
                    aria-label="Zoom in"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <div className="h-px bg-border" />
                  <button
                    type="button"
                    onClick={() =>
                      setZoom((value) => Math.max(0.9, +(value - 0.1).toFixed(2)))
                    }
                    className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-secondary"
                    aria-label="Zoom out"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs shadow-soft backdrop-blur">
                  <MapPin className="h-3.5 w-3.5" /> Jaipur, India
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Click on a location pin to select it, or type manually above
            </p>
          </div>

          {/* Weather Forecast Section */}
          {formData.date && (
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Weather Forecast
              </label>
              <div className="card-soft p-5">
                {loadingWeather ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--coral)] border-t-transparent" />
                  </div>
                ) : weather ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getWeatherIcon(weather.weatherCode)}
                        <div>
                          <p className="text-sm font-medium">
                            {getWeatherDescription(weather.weatherCode)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(formData.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-display">
                          {weather.tempMax}°C
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Low: {weather.tempMin}°C
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <CloudRain className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Rain</p>
                          <p className="text-sm font-medium">
                            {weather.precipitation}%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Wind</p>
                          <p className="text-sm font-medium">
                            {weather.windSpeed} km/h
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Unable to load weather data
                  </p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Plan your event according to the weather conditions
              </p>
            </div>
          )}

          <Field label="Cover image" error={errors.image}>
            {formData.imagePreview ? (
              <div className="relative">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-2xl"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      image: null,
                      imagePreview: null,
                    }))
                  }
                  className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/40 px-6 py-10 text-sm text-muted-foreground transition hover:border-foreground hover:text-foreground">
                <Upload className="h-4 w-4" /> Upload an image (1200×800
                recommended)
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </Field>

          <div className="flex flex-col-reverse gap-3 pt-4 md:flex-row md:justify-end">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/explore")}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Publish Milo <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default Host;
