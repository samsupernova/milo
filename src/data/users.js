// Dummy users for authentication
const defaultUsers = [
  {
    id: 1,
    email: "demo@milo.com",
    password: "password123",
    name: "Demo User",
    dob: "23-09-2005",
    occupation: "Product Designer",
    home: { country: "India", state: "Rajasthan", city: "Jaipur" },
    gender: "male",
    relationship: "Single",
    interests: ["sports", "art", "music"],
    joined: ["sunday-brunch-club", "sunrise-run-club"],
    hosted: ["watercolor-workshop"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
  },
  {
    id: 2,
    email: "test@milo.com",
    password: "test123",
    name: "Ananya Sharma",
    dob: "03-09-2005",
    occupation: "Designer",
    home: { country: "India", state: "Rajasthan", city: "Jaipur" },
    gender: "female",
    relationship: "Single",
    interests: ["sports"],
    joined: [
      "jaipur-football-circle",
      "creative-coffee-meetup",
      "watercolor-workshop",
    ],
    hosted: ["jaipur-football-circle", "sunrise-run-club"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=test",
  },
  {
    id: 3,
    email: "user@milo.com",
    password: "user123",
    name: "John Doe",
    dob: "23-12-2005",
    occupation: "Photographer",
    home: { country: "India", state: "Rajasthan", city: "Jaipur" },
    gender: "female",
    relationship: "Married",
    interests: ["art", "music"],
    joined: ["creative-coffee-meetup", "wellness-circle", "sunrise-run-club"],
    hosted: [],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  },
];

// Hydrate registered users from localStorage on module load
function loadUsers() {
  const stored = localStorage.getItem("registeredUsers");
  const registered = stored ? JSON.parse(stored) : [];
  const hydratedRegistered = registered.map((user) => ({
    ...user,
    joined: Array.isArray(user.joined) ? user.joined : [],
    hosted: Array.isArray(user.hosted) ? user.hosted : [],
  }));
  return [...defaultUsers, ...hydratedRegistered];
}

export const dummyUsers = loadUsers();

// Persist registered users (excludes the hardcoded defaults) to localStorage
function saveRegisteredUsers() {
  const registered = dummyUsers.filter(
    (u) => !defaultUsers.some((d) => d.id === u.id),
  );
  localStorage.setItem("registeredUsers", JSON.stringify(registered));
}

export const getActiveUser = () => {
  const stored = JSON.parse(localStorage.getItem("user") || "null");
  if (!stored?.id) return null;
  return dummyUsers.find((user) => user.id === stored.id) || null;
};

export const joinEvent = (eventId) => {
  const stored = JSON.parse(localStorage.getItem("user") || "null");
  if (!stored?.id) {
    return { success: false, error: "Must be logged in to join." };
  }

  const user = dummyUsers.find((u) => u.id === stored.id);
  if (!user) {
    return { success: false, error: "Active user not found." };
  }

  if (!Array.isArray(user.joined)) {
    user.joined = [];
  }

  if (user.joined.includes(eventId)) {
    return { success: false, error: "Already joined this event." };
  }

  user.joined.push(eventId);

  if (!defaultUsers.some((d) => d.id === user.id)) {
    saveRegisteredUsers();
  }

  localStorage.setItem(
    "user",
    JSON.stringify({
      ...stored,
      joined: user.joined,
      hosted: user.hosted || [],
    }),
  );

  return { success: true, user };
};

export const leaveEvent = (eventId) => {
  const stored = JSON.parse(localStorage.getItem("user") || "null");
  if (!stored?.id) {
    return { success: false, error: "Must be logged in to leave." };
  }

  const user = dummyUsers.find((u) => u.id === stored.id);
  if (!user) {
    return { success: false, error: "Active user not found." };
  }

  if (!Array.isArray(user.joined)) {
    user.joined = [];
  }

  if (!user.joined.includes(eventId)) {
    return { success: false, error: "You have not joined this event." };
  }

  user.joined = user.joined.filter((id) => id !== eventId);

  if (!defaultUsers.some((d) => d.id === user.id)) {
    saveRegisteredUsers();
  }

  localStorage.setItem(
    "user",
    JSON.stringify({
      ...stored,
      joined: user.joined,
      hosted: user.hosted || [],
    }),
  );

  return { success: true, user };
};

export const removeHostedEvent = (eventId) => {
  const stored = JSON.parse(localStorage.getItem("user") || "null");
  if (!stored?.id) {
    return {
      success: false,
      error: "Must be logged in to manage hosted events.",
    };
  }

  const user = dummyUsers.find((u) => u.id === stored.id);
  if (!user) {
    return { success: false, error: "Active user not found." };
  }

  if (!Array.isArray(user.hosted)) {
    user.hosted = [];
  }

  if (!user.hosted.includes(eventId)) {
    return { success: false, error: "You are not the host of this event." };
  }

  user.hosted = user.hosted.filter((id) => id !== eventId);

  if (!defaultUsers.some((d) => d.id === user.id)) {
    saveRegisteredUsers();
  }

  localStorage.setItem(
    "user",
    JSON.stringify({
      ...stored,
      joined: user.joined || [],
      hosted: user.hosted,
    }),
  );

  return { success: true, user };
};

export const addHostedEvent = (eventId) => {
  const stored = JSON.parse(localStorage.getItem("user") || "null");
  if (!stored?.id) {
    return { success: false, error: "Must be logged in to host events." };
  }

  const user = dummyUsers.find((u) => u.id === stored.id);
  if (!user) {
    return { success: false, error: "Active user not found." };
  }

  if (!Array.isArray(user.hosted)) {
    user.hosted = [];
  }

  if (user.hosted.includes(eventId)) {
    return { success: false, error: "Already hosting this event." };
  }

  user.hosted.push(eventId);

  if (!defaultUsers.some((d) => d.id === user.id)) {
    saveRegisteredUsers();
  }

  localStorage.setItem(
    "user",
    JSON.stringify({
      ...stored,
      joined: user.joined || [],
      hosted: user.hosted,
    }),
  );

  return { success: true, user };
};

// Mock authentication helper
export const authenticateUser = (email, password) => {
  console.log('authenticateUser called with:', email);
  const user = dummyUsers.find(
    (u) => u.email === email && u.password === password,
  );
  console.log('Found user:', user);
  if (user) {
    const userToStore = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      occupation: user.occupation,
      home: user.home,
      gender: user.gender,
      relationship: user.relationship,
      interests: user.interests,
      joined: user.joined || [],
      hosted: user.hosted || [],
    };
    localStorage.setItem('user', JSON.stringify(userToStore));
    localStorage.setItem('milo_current_user', JSON.stringify(userToStore));
    return {
      success: true,
      user: userToStore,
    };
  }
  return {
    success: false,
    error: "Invalid email or password",
  };
};

// Register a new user and add to dummyUsers
export const registerUser = ({
  email,
  password,
  name,
  dob,
  occupation,
  country,
  state,
  city,
  gender,
  relationship,
  interests,
}) => {
  console.log('registerUser called with:', email);
  // Check if email already taken
  const existing = dummyUsers.find((u) => u.email === email);
  if (existing) {
    return { success: false, error: "Email already registered" };
  }

  const nextId = Math.max(0, ...dummyUsers.map((user) => user.id)) + 1;
  const newUser = {
    id: nextId,
    email,
    password,
    name,
    dob,
    occupation,
    home: { country, state, city },
    gender,
    relationship,
    interests,
    joined: [],
    hosted: [],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
  };

  dummyUsers.push(newUser);
  saveRegisteredUsers();

  const userToStore = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    avatar: newUser.avatar,
    occupation: newUser.occupation,
    home: newUser.home,
    gender: newUser.gender,
    relationship: newUser.relationship,
    interests: newUser.interests,
    joined: newUser.joined,
    hosted: newUser.hosted,
  };
  
  localStorage.setItem('user', JSON.stringify(userToStore));
  localStorage.setItem('milo_current_user', JSON.stringify(userToStore));

  return {
    success: true,
    user: userToStore,
  };
};
