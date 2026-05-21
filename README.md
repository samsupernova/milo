# 🎉 Milo - Social Events Platform

A modern social events platform for Jaipur, India, built with React, Vite, and Supabase.

![Milo Platform](https://img.shields.io/badge/Status-Live-success)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.3.5-purple)
![Supabase](https://img.shields.io/badge/Supabase-Integrated-green)

## ✨ Features

- 🎯 **Event Discovery** - Browse and explore local events in Jaipur
- 📅 **Event Hosting** - Create and manage your own events
- 👥 **Social Networking** - Join events and connect with like-minded people
- 💬 **Circle Chat** - Real-time discussion forums for each event
- 🤖 **Milo Bot** - AI-powered assistant for event planning (powered by Groq)
- 🌤️ **Weather Integration** - See weather forecasts for event dates
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 🔐 **User Authentication** - Secure login and registration with Supabase

## 🚀 Tech Stack

- **Frontend:** React 19, React Router
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **AI:** Groq API (Llama 3.3)
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Testing:** Vitest, React Testing Library

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Groq API key (for Milo Bot)

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/samsupernova/milo.git
cd milo
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_KEY=your_groq_api_key
```

4. **Set up Supabase database**

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  avatar TEXT,
  interests TEXT[],
  hosted INTEGER[],
  joined INTEGER[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create events table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  spots INTEGER NOT NULL,
  joined INTEGER DEFAULT 0,
  tags TEXT[],
  image TEXT,
  host INTEGER REFERENCES users(id),
  host_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create messages table (optional, for persistent chat)
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id),
  user_id INTEGER REFERENCES users(id),
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

5. **Run the development server**

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

## 🏗️ Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## 🧪 Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

## 📁 Project Structure

```
milo/
├── src/
│   ├── assets/          # Images and static files
│   ├── components/      # Reusable React components
│   │   ├── CircleCalendar.jsx
│   │   ├── CircleMap.jsx
│   │   ├── EventCard.jsx
│   │   ├── Footer.jsx
│   │   └── Navbar.jsx
│   ├── contexts/        # React contexts
│   │   └── AuthContext.jsx
│   ├── data/            # Static data (legacy)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Third-party integrations
│   │   └── supabase.js
│   ├── pages/           # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Discussion.jsx
│   │   ├── EventDetails.jsx
│   │   ├── Explore.jsx
│   │   ├── Home.jsx
│   │   ├── Host.jsx
│   │   ├── Login.jsx
│   │   ├── Onboarding.jsx
│   │   ├── Profile.jsx
│   │   └── Upcoming.jsx
│   ├── services/        # API services
│   │   ├── auth.js
│   │   ├── events.js
│   │   └── messages.js
│   ├── utils/           # Utility functions
│   │   └── weather.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── styles.css       # Global styles
├── public/              # Public assets
├── .env.example         # Environment variables template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── tailwind.config.js   # Tailwind configuration
```

## 🌐 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions on:
- Deploying to GitHub
- Hosting on Vercel
- Connecting custom domain
- Environment variable configuration

## 🔐 Security Notes

⚠️ **Important:** This is a demo/educational project. Before deploying to production:

1. **Implement password hashing** - Currently passwords are stored in plain text
2. **Add rate limiting** - Protect API endpoints from abuse
3. **Input validation** - Sanitize all user inputs
4. **CORS configuration** - Restrict API access
5. **Rotate API keys** - Use different keys for dev/prod

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Sameer Kumar**
- GitHub: [@samsupernova](https://github.com/samsupernova)

## 🙏 Acknowledgments

- Weather data from [Open-Meteo](https://open-meteo.com/)
- AI powered by [Groq](https://groq.com/)
- Database by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)
- Avatars by [DiceBear](https://dicebear.com/)

---

**Made with ❤️ in Jaipur, India**
