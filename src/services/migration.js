// Data migration script for Supabase
import { supabase } from '../lib/supabase.js';

// Default users from src/data/users.js
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
  // Additional event hosts
  {
    id: 4,
    email: "rohan@milo.com",
    password: "rohan123",
    name: "Rohan Mehta",
    dob: "15-06-2004",
    occupation: "Sports Coach",
    home: { country: "India", state: "Rajasthan", city: "Jaipur" },
    gender: "male",
    relationship: "Single",
    interests: ["sports", "fitness"],
    joined: [],
    hosted: ["jaipur-football-circle"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rohan",
  },
  {
    id: 5,
    email: "isha@milo.com",
    password: "isha123",
    name: "Isha Kapoor",
    dob: "20-03-2005",
    occupation: "Entrepreneur",
    home: { country: "India", state: "Rajasthan", city: "Jaipur" },
    gender: "female",
    relationship: "Single",
    interests: ["networking", "startups"],
    joined: [],
    hosted: ["creative-coffee-meetup"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=isha",
  },
  {
    id: 6,
    email: "karan@milo.com",
    password: "karan123",
    name: "Karan Singh",
    dob: "10-08-2004",
    occupation: "Fitness Trainer",
    home: { country: "India", state: "Rajasthan", city: "Jaipur" },
    gender: "male",
    relationship: "Single",
    interests: ["running", "fitness"],
    joined: [],
    hosted: ["sunrise-run-club"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=karan",
  },
  {
    id: 7,
    email: "meera@milo.com",
    password: "meera123",
    name: "Meera Iyer",
    dob: "05-11-2005",
    occupation: "Yoga Instructor",
    home: { country: "India", state: "Rajasthan", city: "Jaipur" },
    gender: "female",
    relationship: "Single",
    interests: ["wellness", "yoga"],
    joined: [],
    hosted: ["wellness-circle"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=meera",
  },
  {
    id: 8,
    email: "aditi@milo.com",
    password: "aditi123",
    name: "Aditi Joshi",
    dob: "12-01-2005",
    occupation: "Artist",
    home: { country: "India", state: "Rajasthan", city: "Jaipur" },
    gender: "female",
    relationship: "Single",
    interests: ["art", "photography"],
    joined: [],
    hosted: ["watercolor-workshop"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aditi",
  },
];

// Default events from src/data/events.js
const defaultEvents = [
  {
    id: "sunday-brunch-club",
    title: "Sunday Brunch Club",
    host: "Ananya Sharma",
    date: "Sun, May 18",
    time: "11:00 AM",
    location: "C-Scheme, Jaipur",
    image: "/src/assets/event-brunch.jpg",
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
    image: "/src/assets/event-football.jpg",
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
    image: "/src/assets/event-coffee.jpg",
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
    image: "/src/assets/event-run.jpg",
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
    image: "/src/assets/event-wellness.jpg",
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
    image: "/src/assets/event-art.jpg",
    tags: ["Art", "Photography"],
    description:
      "Two hours of slow painting with a working artist. All materials included — beginners welcome.",
    spots: 10,
    joined: 1,
  },
];

// Migrate default users to Supabase
export const migrateUsers = async () => {
  console.log('Starting user migration...');
  const results = {
    inserted: 0,
    skipped: 0,
    errors: [],
  };

  for (const user of defaultUsers) {
    try {
      // Check if user already exists
      const { data: existing, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .limit(1);

      if (checkError) {
        console.error(`Error checking user ${user.email}:`, checkError);
        results.errors.push({ user: user.email, error: checkError.message });
        continue;
      }

      if (existing && existing.length > 0) {
        console.log(`User ${user.email} already exists, skipping...`);
        results.skipped++;
        continue;
      }

      // Insert user with explicit ID
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          password: user.password,
          name: user.name,
          dob: user.dob,
          occupation: user.occupation,
          home: user.home,
          gender: user.gender,
          relationship: user.relationship,
          interests: user.interests,
          joined: user.joined,
          hosted: user.hosted,
          avatar: user.avatar,
        });

      if (insertError) {
        console.error(`Error inserting user ${user.email}:`, insertError);
        results.errors.push({ user: user.email, error: insertError.message });
      } else {
        console.log(`Inserted user: ${user.email}`);
        results.inserted++;
      }
    } catch (error) {
      console.error(`Exception migrating user ${user.email}:`, error);
      results.errors.push({ user: user.email, error: error.message });
    }
  }

  console.log('User migration complete:', results);
  return results;
};

// Migrate default events to Supabase
export const migrateEvents = async () => {
  console.log('Starting event migration...');
  const results = {
    inserted: 0,
    skipped: 0,
    errors: [],
  };

  for (const event of defaultEvents) {
    try {
      // Check if event already exists
      const { data: existing, error: checkError } = await supabase
        .from('events')
        .select('id')
        .eq('id', event.id)
        .limit(1);

      if (checkError) {
        console.error(`Error checking event ${event.id}:`, checkError);
        results.errors.push({ event: event.id, error: checkError.message });
        continue;
      }

      if (existing && existing.length > 0) {
        console.log(`Event ${event.id} already exists, skipping...`);
        results.skipped++;
        continue;
      }

      // Find host user ID by name
      const { data: hostUser, error: hostError } = await supabase
        .from('users')
        .select('id')
        .eq('name', event.host)
        .limit(1);

      const hostId = hostUser && hostUser.length > 0 ? hostUser[0].id : 1; // Default to user 1 if not found

      if (!hostUser || hostUser.length === 0) {
        console.warn(`Host ${event.host} not found for event ${event.id}, using default host ID 1`);
      }

      // Insert event
      const { error: insertError } = await supabase
        .from('events')
        .insert({
          id: event.id,
          title: event.title,
          host_id: hostId,
          host_name: event.host,
          date: event.date,
          time: event.time,
          location: event.location,
          image: event.image,
          tags: event.tags,
          description: event.description,
          spots: event.spots,
          joined: event.joined,
        });

      if (insertError) {
        console.error(`Error inserting event ${event.id}:`, insertError);
        results.errors.push({ event: event.id, error: insertError.message });
      } else {
        console.log(`Inserted event: ${event.id}`);
        results.inserted++;
      }
    } catch (error) {
      console.error(`Exception migrating event ${event.id}:`, error);
      results.errors.push({ event: event.id, error: error.message });
    }
  }

  console.log('Event migration complete:', results);
  return results;
};

// Run full migration (users first, then events)
export const runFullMigration = async () => {
  console.log('=== Starting Full Data Migration ===');
  
  try {
    // Step 1: Migrate users
    const userResults = await migrateUsers();
    
    // Step 2: Migrate events
    const eventResults = await migrateEvents();
    
    // Summary
    console.log('\n=== Migration Summary ===');
    console.log('Users:');
    console.log(`  - Inserted: ${userResults.inserted}`);
    console.log(`  - Skipped: ${userResults.skipped}`);
    console.log(`  - Errors: ${userResults.errors.length}`);
    console.log('Events:');
    console.log(`  - Inserted: ${eventResults.inserted}`);
    console.log(`  - Skipped: ${eventResults.skipped}`);
    console.log(`  - Errors: ${eventResults.errors.length}`);
    
    if (userResults.errors.length > 0 || eventResults.errors.length > 0) {
      console.error('\nErrors encountered:');
      [...userResults.errors, ...eventResults.errors].forEach(err => {
        console.error(`  - ${err.user || err.event}: ${err.error}`);
      });
    }
    
    console.log('\n=== Migration Complete ===');
    
    return {
      success: userResults.errors.length === 0 && eventResults.errors.length === 0,
      userResults,
      eventResults,
    };
  } catch (error) {
    console.error('Migration failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
