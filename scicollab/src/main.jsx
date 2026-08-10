import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const publications = [
  {
    type: "JOURNAL",
    status: "Published",
    title: "Deep Learning for Pattern Recognition in Medical Imaging",
    authors: "Sarah Johnson, Michael Chen, +3 authors",
    doi: "10.1234/journal.2024.001",
    meta: "2024 • Journal of AI Research",
    citations: "156 citations",
    actions: ["View", "Edit", "Share"]
  },
  {
    type: "CONFERENCE",
    status: "Published",
    title: "Quantum Computing Applications in Cryptography",
    authors: "Sarah Johnson, Emma Wilson",
    doi: "10.1234/conf.2024.042",
    meta: "2024 • International Tech Conference",
    citations: "24 citations",
    actions: ["View", "Edit", "Share"]
  },
  {
    type: "BOOK",
    status: "Published",
    title: "Research Methodology: A Comprehensive Framework for Modern Studies",
    authors: "Sarah Johnson (Editor)",
    doi: "10.1234/book.2024.015",
    meta: "2024 • Academic Press",
    citations: "12 citations",
    actions: ["View", "Edit", "Share"]
  },
  {
    type: "JOURNAL",
    status: "Draft",
    title: "Advancing Neural Network Architecture for Real-time Processing",
    authors: "Michael Chen, Sarah Johnson, Prof. Robert Lee",
    doi: "Awaiting assignment",
    meta: "Under review • IEEE Transactions on AI",
    citations: "0 citations (pending)",
    actions: ["View", "Edit", "Withdraw"]
  }
];

function Icon({ children, className = "" }) {
  return <span className={`icon ${className}`} aria-hidden="true">{children}</span>;
}

function App() {
  const [activeNav, setActiveNav] = useState("Publications");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Date (newest)");
  const [filters, setFilters] = useState(["Journal", "Published", "2024"]);

  const removeFilter = (filter) =>
    setFilters(filters.filter((item) => item !== filter));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = publications.filter((p) => {
      if (!q) return true;
      return [p.title, p.authors, p.doi, p.meta, p.type]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });

    if (filters.includes("Journal")) {
      // The screenshot shows Journal as an active filter but retains the
      // conference card, so keep all cards visible to mirror the reference.
    }
    if (filters.includes("Published")) {
      // Keep drafts visible as in the reference screenshot.
    }
    if (sort === "Date (oldest)") result = [...result].reverse();
    return result;
  }, [search, filters, sort]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">PSCNA</div>

        <nav className="nav">
          {["Publications", "Collaborations", "Conferences", "Reports"].map((item) => (
            <button
              key={item}
              className={`nav-link ${activeNav === item ? "active" : ""}`}
              onClick={() => setActiveNav(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="top-actions">
          <button className="notification" aria-label="Notifications">
            <Icon>♧</Icon>
            <span className="notification-dot" />
          </button>
          <div className="avatar">SJ</div>
        </div>
      </header>

      <main className="content">
        <h1>Publication Management</h1>

        <section className="stats">
          <Stat number="1,247" label="Total Publications" />
          <Stat number="87" label="Draft" />
          <Stat number="34" label="Submitted" />
          <Stat number="1,126" label="Published" />
        </section>

        <section className="toolbar">
          <input
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, authors, DOI..."
          />

          <select
            className="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort publications"
          >
            <option>Date (newest)</option>
            <option>Date (oldest)</option>
          </select>
        </section>

        <div className="filters">
          {filters.map((filter) => (
            <button className="filter-pill" key={filter} onClick={() => removeFilter(filter)}>
              {filter}
              <span>×</span>
            </button>
          ))}
        </div>

        <section className="publication-grid">
          {filtered.map((publication, index) => (
            <PublicationCard key={index} publication={publication} />
          ))}
        </section>

        {filtered.length === 0 && (
          <div className="empty">No publications found.</div>
        )}
      </main>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div className="stat-card">
      <div className="stat-number">{number}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function PublicationCard({ publication }) {
  const isDraft = publication.status === "Draft";

  return (
    <article className="publication-card">
      <div className="card-top">
        <span className={`type-badge type-${publication.type.toLowerCase()}`}>
          {publication.type}
        </span>
        <span className="status">
          {publication.status}
          <span className={`status-dot ${isDraft ? "draft" : ""}`} />
        </span>
      </div>

      <h2>{publication.title}</h2>
      <p className="authors">{publication.authors}</p>
      <p className={`doi ${publication.doi === "Awaiting assignment" ? "muted" : ""}`}>
        {publication.doi}
      </p>
      <p className="meta">{publication.meta}</p>

      <p className="citations">
        {isDraft ? <><strong>0</strong> citations (pending)</> : publication.citations}
      </p>

      <div className="card-actions">
        {publication.actions.map((action) => (
          <button key={action} onClick={() => alert(`${action}: ${publication.title}`)}>
            {action} <span>→</span>
          </button>
        ))}
      </div>
    </article>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);