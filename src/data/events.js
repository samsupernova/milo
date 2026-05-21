import brunch from "../assets/event-brunch.jpg";
import football from "../assets/event-football.jpg";
import coffee from "../assets/event-coffee.jpg";
import run from "../assets/event-run.jpg";
import wellness from "../assets/event-wellness.jpg";
import art from "../assets/event-art.jpg";

export const events = [
  {
    id: "sunday-brunch-club",
    title: "Sunday Brunch Club",
    host: "Ananya Sharma",
    date: "Sun, May 18",
    time: "11:00 AM",
    location: "C-Scheme, Jaipur",
    image: brunch,
    tags: ["Brunches", "Food"],
    description:
      "Slow Sunday mornings, fresh pancakes, filter coffee and the kind of conversation that makes you forget the time. A small, intentional table for ten.",
    spots: 10,
    joined: 1,
  },
  {
    id: "jaipur-football-circle",
    title: "Jaipur Football Circle",
    host: "Rohan Mehta",
    date: "Sat, May 17",
    time: "6:30 AM",
    location: "Jhalana Sports Ground, Jaipur",
    image: football,
    tags: ["Sports", "Fitness"],
    description:
      "Friendly 7-a-side football for all skill levels. Show up, sweat it out, swap stories over chai after.",
    spots: 14,
    joined: 1,
  },
  {
    id: "creative-coffee-meetup",
    title: "Creative Coffee Meetup",
    host: "Isha Kapoor",
    date: "Wed, May 21",
    time: "5:00 PM",
    location: "Bani Park, Jaipur",
    image: coffee,
    tags: ["Networking", "Startups"],
    description:
      "Designers, founders and writers — bring your laptop or just your curiosity. Two hours of working in good company.",
    spots: 12,
    joined: 2,
  },
  {
    id: "sunrise-run-club",
    title: "Sunrise Run Club",
    host: "Karan Singh",
    date: "Tue, May 20",
    time: "5:45 AM",
    location: "Central Park, Jaipur",
    image: run,
    tags: ["Running", "Fitness"],
    description:
      "5km easy pace through the cool Jaipur dawn. Stretch, breakfast and good people after.",
    spots: 20,
    joined: 2,
  },
  {
    id: "wellness-circle",
    title: "Sunday Wellness Circle",
    host: "Meera Iyer",
    date: "Sun, May 25",
    time: "8:00 AM",
    location: "Civil Lines, Jaipur",
    image: wellness,
    tags: ["Wellness", "Yoga"],
    description:
      "Guided breathwork, gentle yoga, and a shared journaling moment. Leave lighter than you came.",
    spots: 15,
    joined: 1,
  },
  {
    id: "watercolor-workshop",
    title: "Watercolor Workshop",
    host: "Aditi Joshi",
    date: "Sat, May 24",
    time: "4:00 PM",
    location: "Hawa Mahal Studios, Jaipur",
    image: art,
    tags: ["Art", "Photography"],
    description:
      "Two hours of slow painting with a working artist. All materials included — beginners welcome.",
    spots: 10,
    joined: 1,
  },
];

export const addEvent = (event) => {
  // Validate event structure
  if (!event.id || !event.title || !event.host) {
    return { success: false, error: "Invalid event data" };
  }

  // Check for duplicate ID
  if (events.find((e) => e.id === event.id)) {
    return { success: false, error: "Event ID already exists" };
  }

  events.push(event);
  return { success: true, event };
};

export const deleteEvent = (id) => {
  const index = events.findIndex((event) => event.id === id);
  if (index === -1) {
    return false;
  }
  events.splice(index, 1);
  return true;
};

export const interests = [
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
