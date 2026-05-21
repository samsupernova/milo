import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Dashboard from "./pages/Dashboard";
import EventDetails from "./pages/EventDetails";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Host from "./pages/Host";
import Upcoming from "./pages/Upcoming";
import Discussion from "./pages/Discussion";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/host" element={<Host />} />
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/discussion/:eventId" element={<Discussion />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="bottom-right" />
    </AuthProvider>
  );
}

export default App;
