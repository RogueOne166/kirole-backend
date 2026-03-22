const slugify = require("../utils/slugify");


const events = [
  {
    id: 1,
    name: "Grand Baie NJOY bar pub",
    category: "pub",
    region: "North",
    description: "Day/night bar pub with food, music, and sunset vibes.",
    latitude: -20.0182,
    longitude: 57.5804,
    price: "free",
    rating: 4.5,
    reviews: 90,
    audience: ["tourists", "locals"],
    type: "event",
    date: "2026-07-12",
    featured: false,
    image: "https://frolic.mu/wp-content/uploads/2025/05/482261063_663127339561473_881005317476848785_n.jpg"
  },
  {
    id: 2,
    name: "Beach Party at Flic en Flac",
    category: "nightlife",
    region: "West",
    description: "Live DJ, food stalls, and sunset beach vibes.",
    latitude: -20.2747,
    longitude: 57.3631,
    price: "paid",
    rating: 4.6,
    reviews: 120,
    audience: ["tourists", "locals"],
    type: "event",
    date: "2026-07-19",
    featured: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrdPUI5DxZzu5Ku87q8DZlBMonDNCzxZKPUA&s"
  },
  {
    id: 3,
    name: "Port Louis Food Festival",
    category: "food",
    region: "Central",
    description: "Local street food, music, and culinary experiences in Port Louis.",
    latitude: -20.1609,
    longitude: 57.5012,
    price: "free",
    rating: 4.7,
    reviews: 150,
    audience: ["tourists", "locals"],
    type: "event",
    date: "2026-08-03",
    featured: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR45QmXsuizMXi__ddBXBKOTldJGgYBZPa5Lg&s"
  },
  {
    id: 4,
    name: "Blue Bay Music Evening",
    category: "music",
    region: "South-East",
    description: "An outdoor live music evening near Blue Bay beach.",
    latitude: -20.4453,
    longitude: 57.7131,
    price: "free",
    rating: 4.4,
    reviews: 80,
    audience: ["tourists", "locals"],
    type: "event",
    date: "2026-08-10",
    featured: false,
    image: "https://images.stockcake.com/public/4/d/4/4d489746-1b81-41f9-bc8d-ddce3337323a_large/beach-sunset-party-stockcake.jpg"
  }
];

// ADD SLUGS AUTOMATICALLY
const eventsWithSlugs = events.map((event) => ({
  ...event,
  slug: slugify(event.name),
}));

module.exports = eventsWithSlugs;
