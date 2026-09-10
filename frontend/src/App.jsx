import { useEffect, useMemo, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Camera,
  Check,
  ChevronDown,
  Code2,
  Compass,
  Heart,
  MapPin,
  MessageCircle,
  Music2,
  Palette,
  Search,
  Sparkles,
  Users,
  Utensils,
  X
} from "lucide-react";

const seedSkills = [
  { id: "1", title: "Conversational Spanish", category: "Languages", description: "Practice real conversations, pronunciation, and confidence for your next trip.", owner: "Sofia R.", initials: "SR", location: "North Park", distance: "0.8 mi", rating: "4.9", reviews: 18, wants: "React basics", accent: "coral", icon: BookOpen },
  { id: "2", title: "Portrait Photography", category: "Creative", description: "Learn natural-light portraits and simple edits using the camera you already own.", owner: "Marcus T.", initials: "MT", location: "Hillcrest", distance: "1.4 mi", rating: "5.0", reviews: 9, wants: "Sourdough baking", accent: "blue", icon: Camera },
  { id: "3", title: "React for Beginners", category: "Technology", description: "Build a small project together and leave with a clear mental model of React.", owner: "Priya K.", initials: "PK", location: "University Heights", distance: "2.1 mi", rating: "4.8", reviews: 24, wants: "Conversational Spanish", accent: "gold", icon: Code2 },
  { id: "4", title: "Weeknight Vegetarian Cooking", category: "Food & Home", description: "Three flexible recipes, knife skills, and a plan for making dinner less stressful.", owner: "Eli M.", initials: "EM", location: "Normal Heights", distance: "2.6 mi", rating: "4.7", reviews: 12, wants: "Portrait photography", accent: "green", icon: Utensils },
  { id: "5", title: "Beginner Guitar Sessions", category: "Music", description: "Learn the chords and rhythm patterns behind songs you actually want to play.", owner: "Nora J.", initials: "NJ", location: "South Park", distance: "3.2 mi", rating: "4.9", reviews: 7, wants: "Website feedback", accent: "violet", icon: Music2 },
  { id: "6", title: "Watercolor Foundations", category: "Creative", description: "A relaxed introduction to washes, color mixing, and painting from observation.", owner: "Theo L.", initials: "TL", location: "Kensington", distance: "3.8 mi", rating: "4.6", reviews: 5, wants: "Guitar basics", accent: "peach", icon: Palette }
];

const categories = ["All skills", "Technology", "Languages", "Creative", "Food & Home", "Music"];
const categoryIcons = { Technology: Code2, Languages: BookOpen, Creative: Palette, "Food & Home": Utensils, Music: Music2 };

function Avatar({ initials, size = "medium" }) {
  return <span className={`avatar avatar-${size}`}>{initials}</span>;
}

function App() {
  const [skills, setSkills] = useState(seedSkills);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All skills");
  const [selectedSkill, setSelectedSkill] = useState(seedSkills[0]);
  const [saved, setSaved] = useState(new Set());
  const [showRequest, setShowRequest] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/skills")
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("API unavailable"))))
      .then((data) => {
        if (data.skills?.length) {
          setSkills(data.skills);
          setSelectedSkill(data.skills[0]);
        }
      })
      .catch(() => {});
  }, []);

  const filteredSkills = useMemo(() => skills.filter((skill) => {
    const matchesCategory = activeCategory === "All skills" || skill.category === activeCategory;
    const searchable = `${skill.title} ${skill.description} ${skill.owner} ${skill.location}`.toLowerCase();
    return matchesCategory && searchable.includes(query.toLowerCase());
  }), [activeCategory, query, skills]);
  const DetailIcon = selectedSkill?.icon || categoryIcons[selectedSkill?.category] || Sparkles;

  function toggleSaved(skillId) {
    setSaved((current) => {
      const next = new Set(current);
      next.has(skillId) ? next.delete(skillId) : next.add(skillId);
      return next;
    });
  }

  function requestExchange(event) {
    event.preventDefault();
    setShowRequest(false);
    setNotice(`Your exchange request was sent to ${selectedSkill.owner}`);
    window.setTimeout(() => setNotice(""), 4200);
    fetch("http://localhost:5000/api/exchanges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skillId: selectedSkill.id, message: event.currentTarget.message.value })
    }).catch(() => {});
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="topbar">
          <a className="brand" href="/" aria-label="SkillSwap home"><span className="brand-mark"><Sparkles size={17} /></span><span>skillswap</span></a>
          <nav className="main-nav"><a className="nav-link nav-link-active" href="#discover"><Compass size={17} /> Discover</a><a className="nav-link" href="#exchanges"><Users size={17} /> My exchanges</a><a className="nav-link" href="#messages"><MessageCircle size={17} /> Messages <span className="nav-count">2</span></a></nav>
          <div className="account-area"><button className="icon-button" aria-label="Notifications"><Bell size={19} /><span className="notification-dot" /></button><div className="account"><Avatar initials="AK" /><span className="account-name">Alex Kim</span><ChevronDown size={15} /></div></div>
        </header>

        <main id="discover" className="main-content">
          <section className="welcome-row"><div><p className="eyebrow">Tuesday, September 11</p><h1>Find your next <em>exchange.</em></h1><p className="lede">Share what you know. Learn what you need. Keep it local.</p></div><button className="primary-button" onClick={() => setNotice("Your offer editor is coming next")}>Share a skill <ArrowRight size={17} /></button></section>

          <section className="stats-strip"><div><span className="stat-number">248</span><span className="stat-label">active skills nearby</span></div><div className="stat-divider" /><div><span className="stat-number">1,204</span><span className="stat-label">hours exchanged</span></div><div className="stat-divider" /><div><span className="stat-number">4.9</span><span className="stat-label">average community rating</span></div><div className="stats-spacer" /><span className="live-indicator"><span /> Community is active</span></section>

          <section className="toolbar" aria-label="Search and filter skills"><div className="search-box"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search skills, people, or neighborhoods" /></div><button className="location-filter"><MapPin size={17} /> Within 5 miles <ChevronDown size={15} /></button></section>
          <div className="category-row">{categories.map((category) => { const Icon = categoryIcons[category]; return <button key={category} className={`category-pill ${activeCategory === category ? "category-pill-active" : ""}`} onClick={() => setActiveCategory(category)}>{Icon && <Icon size={15} />}{category}</button>; })}</div>

          <section className="content-grid"><div className="listing-column"><div className="section-heading"><div><h2>Recommended for you</h2><p>Good matches based on what you want to learn.</p></div><span className="result-count">{filteredSkills.length} results</span></div><div className="skill-list">{filteredSkills.map((skill) => { const Icon = skill.icon || categoryIcons[skill.category] || Sparkles; return <article className={`skill-card ${selectedSkill?.id === skill.id ? "skill-card-selected" : ""}`} key={skill.id} onClick={() => setSelectedSkill(skill)}><div className={`skill-icon skill-icon-${skill.accent}`}><Icon size={23} /></div><div className="skill-card-body"><div className="skill-card-top"><span className="skill-category">{skill.category}</span><button className={`save-button ${saved.has(skill.id) ? "save-button-saved" : ""}`} onClick={(event) => { event.stopPropagation(); toggleSaved(skill.id); }} aria-label="Save skill"><Heart size={17} fill={saved.has(skill.id) ? "currentColor" : "none"} /></button></div><h3>{skill.title}</h3><p>{skill.description}</p><div className="skill-meta"><Avatar initials={skill.initials} size="small" /><span>{skill.owner}</span><span className="meta-separator">·</span><MapPin size={13} /><span>{skill.location}</span><span className="meta-separator">·</span><span className="rating">★ {skill.rating}</span></div></div></article>; })}</div>{filteredSkills.length === 0 && <div className="empty-state"><Search size={25} /><h3>No skills found</h3><p>Try another search or browse all categories.</p></div>}</div>

              {selectedSkill && <aside className="detail-panel"><div className={`detail-banner detail-banner-${selectedSkill.accent}`}><div className="banner-pattern" /><div className="detail-icon"><DetailIcon size={28} /></div><button className="detail-save" onClick={() => toggleSaved(selectedSkill.id)} aria-label="Save selected skill"><Heart size={18} fill={saved.has(selectedSkill.id) ? "currentColor" : "none"} /></button></div><div className="detail-content"><span className="skill-category">{selectedSkill.category}</span><h2>{selectedSkill.title}</h2><div className="detail-owner"><Avatar initials={selectedSkill.initials} /><div><strong>{selectedSkill.owner}</strong><span><MapPin size={13} /> {selectedSkill.location} · {selectedSkill.distance}</span></div><span className="verified"><Check size={13} /> Verified</span></div><div className="detail-rating"><span>★ {selectedSkill.rating}</span><span className="muted">{selectedSkill.reviews} exchanges completed</span></div><p className="detail-description">{selectedSkill.description}</p><div className="exchange-match"><div className="match-label"><Sparkles size={15} /> Exchange match</div><strong>{selectedSkill.owner} wants <span>{selectedSkill.wants}</span></strong><p>Offer something you know in return for this skill.</p></div><button className="request-button" onClick={() => setShowRequest(true)}>Request an exchange <ArrowRight size={17} /></button><button className="message-button"><MessageCircle size={17} /> Message {selectedSkill.owner.split(" ")[0]}</button></div></aside>}
          </section>
        </main>
        {notice && <div className="toast"><Check size={17} /> {notice}</div>}
        {showRequest && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setShowRequest(false)}><form className="request-modal" onSubmit={requestExchange}><button type="button" className="modal-close" onClick={() => setShowRequest(false)} aria-label="Close"><X size={18} /></button><span className="modal-kicker">Start an exchange</span><h2>Send a note to {selectedSkill.owner.split(" ")[0]}</h2><p>Tell them what you would like to learn and what you can offer in return.</p><textarea name="message" required placeholder={`Hi ${selectedSkill.owner.split(" ")[0]}, I would love to learn ${selectedSkill.title.toLowerCase()}...`} /><button className="request-button" type="submit">Send exchange request <ArrowRight size={17} /></button></form></div>}
      </div>
    </BrowserRouter>
  );
}

export default App;
