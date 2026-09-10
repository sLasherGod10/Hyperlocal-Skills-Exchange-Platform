const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

const skills = [
  { id: "1", title: "Conversational Spanish", category: "Languages", description: "Practice real conversations, pronunciation, and confidence for your next trip.", owner: "Sofia R.", initials: "SR", location: "North Park", distance: "0.8 mi", rating: "4.9", reviews: 18, wants: "React basics", accent: "coral" },
  { id: "2", title: "Portrait Photography", category: "Creative", description: "Learn natural-light portraits and simple edits using the camera you already own.", owner: "Marcus T.", initials: "MT", location: "Hillcrest", distance: "1.4 mi", rating: "5.0", reviews: 9, wants: "Sourdough baking", accent: "blue" },
  { id: "3", title: "React for Beginners", category: "Technology", description: "Build a small project together and leave with a clear mental model of React.", owner: "Priya K.", initials: "PK", location: "University Heights", distance: "2.1 mi", rating: "4.8", reviews: 24, wants: "Conversational Spanish", accent: "gold" },
  { id: "4", title: "Weeknight Vegetarian Cooking", category: "Food & Home", description: "Three flexible recipes, knife skills, and a plan for making dinner less stressful.", owner: "Eli M.", initials: "EM", location: "Normal Heights", distance: "2.6 mi", rating: "4.7", reviews: 12, wants: "Portrait photography", accent: "green" },
  { id: "5", title: "Beginner Guitar Sessions", category: "Music", description: "Learn the chords and rhythm patterns behind songs you actually want to play.", owner: "Nora J.", initials: "NJ", location: "South Park", distance: "3.2 mi", rating: "4.9", reviews: 7, wants: "Website feedback", accent: "violet" },
  { id: "6", title: "Watercolor Foundations", category: "Creative", description: "A relaxed introduction to washes, color mixing, and painting from observation.", owner: "Theo L.", initials: "TL", location: "Kensington", distance: "3.8 mi", rating: "4.6", reviews: 5, wants: "Guitar basics", accent: "peach" }
];

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Hyperlocal Skills API is running" });
});

app.get("/api/skills", (req, res) => {
  const search = String(req.query.search || "").toLowerCase();
  const category = String(req.query.category || "");
  const results = skills.filter((skill) => {
    const matchesSearch = !search || `${skill.title} ${skill.description} ${skill.owner} ${skill.location}`.toLowerCase().includes(search);
    const matchesCategory = !category || category === "All skills" || skill.category === category;
    return matchesSearch && matchesCategory;
  });
  res.json({ success: true, skills: results });
});

app.post("/api/skills", (req, res) => {
  const { title, category, description, location, wants } = req.body;
  if (!title || !category || !description || !location || !wants) {
    return res.status(400).json({ success: false, message: "All skill listing fields are required" });
  }
  const skill = {
    id: `skill-${Date.now()}`,
    title,
    category,
    description,
    owner: "Alex K.",
    initials: "AK",
    location,
    distance: "0.0 mi",
    rating: "New",
    reviews: 0,
    wants,
    accent: "peach"
  };
  skills.unshift(skill);
  res.status(201).json({ success: true, skill });
});

app.post("/api/exchanges", (req, res) => {
  const skill = skills.find((item) => item.id === req.body.skillId);
  if (!skill || !req.body.message) {
    return res.status(400).json({ success: false, message: "A skill and message are required" });
  }
  res.status(201).json({ success: true, exchange: { skillId: skill.id, status: "pending", message: req.body.message } });
});

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
