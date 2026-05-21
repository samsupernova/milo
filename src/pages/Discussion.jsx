import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Users,
  MessageCircle,
  Send,
  Trash2,
  Bot,
  Sparkles,
  Sun,
  Cloud,
  CloudRain,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { getISODate, getWeatherIcon } from "../utils/weather";
import { getEventById } from "../services/events";

function Discussion() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const { user: activeUser } = useAuth();
  
  // Fetch event from localStorage
  useEffect(() => {
    const fetchEvent = async () => {
      const eventData = await getEventById(eventId);
      setEvent(eventData);
    };
    fetchEvent();
  }, [eventId]);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingBot, setIsLoadingBot] = useState(false);
  const [weatherIcon, setWeatherIcon] = useState(null);

  // Fetch weather for event date
  useEffect(() => {
    const fetchWeather = async () => {
      if (!event) return;
      
      const isoDate = getISODate(event.date);
      if (!isoDate) return;
      
      try {
        const lat = 26.9124;
        const lon = 75.7873;
        
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode&timezone=Asia/Kolkata&forecast_days=16`
        );
        
        const data = await response.json();
        
        if (data.daily) {
          const dateIndex = data.daily.time.indexOf(isoDate);
          if (dateIndex !== -1) {
            const iconType = getWeatherIcon(data.daily.weathercode[dateIndex]);
            setWeatherIcon(iconType);
          }
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };
    
    fetchWeather();
  }, [event]);

  // Load messages from localStorage on mount
  useEffect(() => {
    if (eventId && event) {
      const storedMessages = localStorage.getItem(`discussion_${eventId}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        // Initialize with default messages
        const defaultMessages = [
          {
            id: "1",
            user: event?.host_name || event?.host || "Host",
            userId: "host",
            badge: "Host",
            message: `Welcome to the ${event?.title} discussion! Feel free to ask questions or share ideas.`,
            time: new Date().toISOString(),
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=host",
          },
        ];
        setMessages(defaultMessages);
        localStorage.setItem(
          `discussion_${eventId}`,
          JSON.stringify(defaultMessages)
        );
      }
    }
  }, [eventId, event]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (eventId && messages.length > 0) {
      localStorage.setItem(`discussion_${eventId}`, JSON.stringify(messages));
    }
  }, [messages, eventId]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const callMiloBot = async (userMessage) => {
    setIsLoadingBot(true);
    try {
      const groqApiKey = import.meta.env.VITE_GROQ_API_KEY || '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';
      
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: `You are Milo Bot, a friendly and helpful assistant for the Milo social events platform in Jaipur, India. You help users with event planning, answer questions about events, give suggestions for activities, and provide helpful tips. Keep responses concise, warm, and encouraging. The current event is: ${event?.title} - ${event?.description}. Event details: Date: ${event?.date}, Time: ${event?.time}, Location: ${event?.location}.`,
              },
              {
                role: "user",
                content: userMessage.replace("@milo", "").trim(),
              },
            ],
            temperature: 0.7,
            max_tokens: 300,
          }),
        }
      );

      const data = await response.json();
      const botResponse = data.choices[0]?.message?.content || "Sorry, I couldn't process that. Please try again!";

      const botMessage = {
        id: Date.now().toString() + "_bot",
        user: "Milo Bot",
        userId: "milo_bot",
        badge: "AI Assistant",
        message: botResponse,
        time: new Date().toISOString(),
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=milo",
        isBot: true,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error calling Milo Bot:", error);
      const errorMessage = {
        id: Date.now().toString() + "_bot_error",
        user: "Milo Bot",
        userId: "milo_bot",
        badge: "AI Assistant",
        message: "Oops! I'm having trouble connecting right now. Please try again in a moment.",
        time: new Date().toISOString(),
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=milo",
        isBot: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoadingBot(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeUser) return;

    const userMessage = {
      id: Date.now().toString(),
      user: activeUser.name,
      userId: activeUser.id,
      badge: activeUser.hosted?.includes(eventId) ? "Host" : "Joined",
      message: newMessage,
      time: new Date().toISOString(),
      avatar: activeUser.avatar,
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = newMessage;
    setNewMessage("");

    // Check if message mentions @milo
    if (messageText.toLowerCase().includes("@milo")) {
      await callMiloBot(messageText);
    }
  };

  const handleDeleteMessage = (messageId) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <p className="mb-4 text-xl font-medium">Discussion not found.</p>
          <Link to="/upcoming" className="btn-primary">
            Back to Upcoming
          </Link>
        </div>
      </div>
    );
  }

  if (!activeUser) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <p className="mb-4 text-xl font-medium">Please log in to view discussions.</p>
          <Link to="/login" className="btn-primary">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar variant="app" />
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-12">
        <Link
          to="/upcoming"
          className="btn-ghost -ml-2 inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to upcoming
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main Chat Section */}
          <div className="space-y-6">
            {/* Event Header Card */}
            <div className="card-soft overflow-hidden animate-fade-up">
              <div className="relative h-48 overflow-hidden md:h-56">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[var(--coral)]/95 px-3 py-1 text-xs font-medium text-white backdrop-blur"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h1 className="font-display text-3xl text-white md:text-4xl">
                    {event.title}
                  </h1>
                </div>
              </div>

              <div className="grid gap-3 p-6 sm:grid-cols-3">
                <Detail
                  icon={<Clock className="h-4 w-4" />}
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
                  value={`${event.joined} of ${event.spots}`}
                  weather={weatherIcon}
                />
              </div>
            </div>

            {/* Chat Section */}
            <div className="card-soft overflow-hidden animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="border-b border-border bg-gradient-to-r from-[var(--coral-soft)] to-secondary/30 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-[var(--coral)]" />
                      <h2 className="text-xl font-display">Circle Chat</h2>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {messages.length} {messages.length === 1 ? "message" : "messages"}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[var(--coral)] px-4 py-2 text-sm font-medium text-white shadow-soft">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                    </span>
                    Live
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-background/50 to-background">
                {messages.map((message) => {
                  const isOwnMessage = message.userId === activeUser.id;
                  const isBot = message.isBot;

                  return (
                    <div
                      key={message.id}
                      className={`group animate-fade-up ${
                        isOwnMessage ? "ml-auto max-w-[85%]" : "mr-auto max-w-[85%]"
                      }`}
                    >
                      <div
                        className={`rounded-2xl p-4 shadow-sm transition-all hover:shadow-md ${
                          isBot
                            ? "border-2 border-[var(--coral)]/30 bg-gradient-to-br from-[var(--coral-soft)] to-secondary/40"
                            : isOwnMessage
                            ? "bg-[var(--coral)] text-white"
                            : "border border-border bg-card"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={message.avatar}
                              alt={message.user}
                              className={`h-8 w-8 rounded-full ${
                                isBot ? "ring-2 ring-[var(--coral)]" : ""
                              }`}
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <p
                                  className={`text-sm font-semibold ${
                                    isOwnMessage && !isBot ? "text-white" : ""
                                  }`}
                                >
                                  {message.user}
                                </p>
                                {isBot && (
                                  <Bot className="h-3.5 w-3.5 text-[var(--coral)]" />
                                )}
                              </div>
                              <p
                                className={`text-xs ${
                                  isOwnMessage && !isBot
                                    ? "text-white/80"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {message.badge}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs ${
                                isOwnMessage && !isBot
                                  ? "text-white/70"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {formatTime(message.time)}
                            </span>
                            {isOwnMessage && !isBot && (
                              <button
                                onClick={() => handleDeleteMessage(message.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/20 rounded"
                                aria-label="Delete message"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-white" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p
                          className={`mt-3 text-sm leading-relaxed ${
                            isOwnMessage && !isBot ? "text-white" : "text-foreground/90"
                          }`}
                        >
                          {message.message}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {isLoadingBot && (
                  <div className="mr-auto max-w-[85%] animate-fade-up">
                    <div className="rounded-2xl border-2 border-[var(--coral)]/30 bg-gradient-to-br from-[var(--coral-soft)] to-secondary/40 p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://api.dicebear.com/7.x/bottts/svg?seed=milo"
                          alt="Milo Bot"
                          className="h-8 w-8 rounded-full ring-2 ring-[var(--coral)]"
                        />
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-[var(--coral)] animate-bounce" />
                          <div
                            className="h-2 w-2 rounded-full bg-[var(--coral)] animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                          <div
                            className="h-2 w-2 rounded-full bg-[var(--coral)] animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="border-t border-border bg-card p-6"
              >
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      placeholder="Type your message... (mention @milo for AI help)"
                      className="input-field min-h-[80px] resize-none"
                      rows={2}
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      💡 Tip: Type <span className="font-semibold text-[var(--coral)]">@milo</span> to get help from our AI assistant
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || isLoadingBot}
                    className="btn-primary h-12 w-12 flex items-center justify-center p-0 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Milo Bot Info */}
            <div className="card-soft animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <img
                      src="https://api.dicebear.com/7.x/bottts/svg?seed=milo"
                      alt="Milo Bot"
                      className="h-12 w-12 rounded-full ring-2 ring-[var(--coral)]"
                    />
                    <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-[var(--coral)]" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg">Milo Bot</h3>
                    <p className="text-xs text-muted-foreground">AI Assistant</p>
                  </div>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Need help planning or have questions? Mention <span className="font-semibold text-[var(--coral)]">@milo</span> in your message and I'll assist you!
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">I can help with:</p>
                  <ul className="space-y-1 text-xs text-foreground/70">
                    <li>• Event planning tips</li>
                    <li>• Activity suggestions</li>
                    <li>• Location recommendations</li>
                    <li>• General questions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Discussion Notes */}
            <div className="card-soft animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  Discussion Guidelines
                </p>
                <div className="space-y-3 text-sm text-foreground/80">
                  <p>
                    💬 This is a friendly space for questions, ideas, and planning before your Milo.
                  </p>
                  <p>
                    🤝 Coordinate with others, ask the host for details, or share suggestions.
                  </p>
                  <p>
                    🤖 Need help? Just mention <span className="font-semibold text-[var(--coral)]">@milo</span> and our AI assistant will respond!
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="card-soft animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  Quick Links
                </p>
                <div className="space-y-3">
                  <Link
                    to={`/event/${event.id}`}
                    className="btn-secondary w-full"
                  >
                    View Event Details
                  </Link>
                  <Link to="/explore" className="btn-secondary w-full">
                    Explore Similar Milos
                  </Link>
                  <Link to="/upcoming" className="btn-secondary w-full">
                    My Upcoming Events
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Detail({ icon, label, value, weather }) {
  const getWeatherIconComponent = () => {
    if (!weather) return null;
    
    const iconClass = "h-4 w-4";
    if (weather === "sun") return <Sun className={`${iconClass} text-yellow-500`} />;
    if (weather === "rain") return <CloudRain className={`${iconClass} text-blue-500`} />;
    return <Cloud className={`${iconClass} text-gray-400`} />;
  };

  return (
    <div className="flex items-center gap-3 rounded-xl bg-secondary/40 p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-[var(--coral)]">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
      {weather && (
        <div className="flex items-center">
          {getWeatherIconComponent()}
        </div>
      )}
    </div>
  );
}

export default Discussion;
