import { useState } from 'react'
import {
  Search,
  Plus,
  FileText,
  BookOpen,
  Mic,
  ChevronDown,
  ExternalLink,
  X,
  Trash2,
  Edit3,
  Eye,
  BookMarked,
  TrendingUp,
  Star,
  Filter,
  RefreshCw,
} from 'lucide-react'
import { usePublications } from '../contexts/PublicationContext'
import type { Publication } from '../data/publications'

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  Published: { bg: '#ECFDF5', text: '#059669', dot: '#10B981' },
  Submitted: { bg: '#EFF6FF', text: '#2563EB', dot: '#3B82F6' },
  Draft: { bg: '#F8FAFC', text: '#64748B', dot: '#94A3B8' },
  'Under Review': { bg: '#FFF7ED', text: '#C2410C', dot: '#F59E0B' },
}

const darkStatusColors: Record<string, { bg: string; text: string; dot: string }> = {
  Published: { bg: 'rgba(16,185,129,0.15)', text: '#34D399', dot: '#10B981' },
  Submitted: { bg: 'rgba(59,130,246,0.15)', text: '#60A5FA', dot: '#3B82F6' },
  Draft: { bg: 'rgba(148,163,184,0.15)', text: '#94A3B8', dot: '#64748B' },
  'Under Review': { bg: 'rgba(245,158,11,0.15)', text: '#FCD34D', dot: '#F59E0B' },
}

const typeIcons: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Journal: FileText,
  Conference: Mic,
  'Book Chapter': BookOpen,
  Preprint: BookMarked,
}

const typeColors: Record<string, string> = {
  Journal: '#2563EB',
  Conference: '#7C3AED',
  'Book Chapter': '#14B8A6',
  Preprint: '#F59E0B',
}

const STATUSES = ['All', 'Published', 'Submitted', 'Draft', 'Under Review'] as const
const TYPES = ['All', 'Journal', 'Conference', 'Book Chapter', 'Preprint'] as const

type SortKey = 'year' | 'citations' | 'title'

interface FormState {
  title: string
  authors: string
  journal: string
  year: string
  doi: string
  abstract: string
  keywords: string
  type: Publication['type']
  status: Publication['status']
}

const emptyForm: FormState = {
  title: '',
  authors: '',
  journal: '',
  year: String(new Date().getFullYear()),
  doi: '',
  abstract: '',
  keywords: '',
  type: 'Journal',
  status: 'Draft',
}

function formToPublication(f: FormState): Omit<Publication, 'id'> {
  return {
    title: f.title.trim(),
    authors: f.authors.split(',').map((a) => a.trim()).filter(Boolean),
    journal: f.journal.trim(),
    year: parseInt(f.year) || new Date().getFullYear(),
    doi: f.doi.trim(),
    abstract: f.abstract.trim(),
    keywords: f.keywords.split(',').map((k) => k.trim()).filter(Boolean),
    type: f.type,
    status: f.status,
    citations: 0,
  }
}

function publicationToForm(p: Publication): FormState {
  return {
    title: p.title,
    authors: p.authors.join(', '),
    journal: p.journal,
    year: String(p.year),
    doi: p.doi,
    abstract: p.abstract,
    keywords: p.keywords.join(', '),
    type: p.type,
    status: p.status,
  }
}

// ──────────────────────────────────────────
// Stat Card
// ──────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
  sub?: string
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 card-hover flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground font-mono">{value}</p>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground/60 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────
// Publication Form Modal
// ──────────────────────────────────────────
function PublicationModal({
  mode,
  initial,
  onClose,
  onSave,
}: {
  mode: 'add' | 'edit'
  initial: FormState
  onClose: () => void
  onSave: (f: FormState) => void
}) {
  const [form, setForm] = useState<FormState>(initial)

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave(form)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-card rounded-3xl shadow-2xl shadow-black/20 w-full max-w-2xl overflow-hidden border border-border max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              {mode === 'add' ? <Plus className="w-5 h-5 text-primary" /> : <Edit3 className="w-5 h-5 text-primary" />}
            </div>
            <h2 className="text-lg font-bold text-foreground">
              {mode === 'add' ? 'Add Publication' : 'Edit Publication'}
            </h2>
          </div>
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">
              Title <span className="text-error">*</span>
            </label>
            <input
              id="pub-title"
              type="text"
              value={form.title}
              onChange={set('title')}
              required
              placeholder="Enter publication title..."
              className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Authors</label>
            <input
              id="pub-authors"
              type="text"
              value={form.authors}
              onChange={set('authors')}
              placeholder="Author 1, Author 2, Author 3..."
              className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Journal / Venue</label>
              <input
                id="pub-journal"
                type="text"
                value={form.journal}
                onChange={set('journal')}
                placeholder="e.g. Nature, ICML 2024"
                className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Year</label>
              <input
                id="pub-year"
                type="number"
                value={form.year}
                onChange={set('year')}
                min={1900}
                max={2030}
                className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">DOI</label>
            <input
              id="pub-doi"
              type="text"
              value={form.doi}
              onChange={set('doi')}
              placeholder="10.xxxx/xxxxx"
              className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground font-mono placeholder:text-muted-foreground placeholder:font-sans outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Type</label>
              <select
                id="pub-type"
                value={form.type}
                onChange={set('type')}
                className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground outline-none focus:border-primary transition-all"
              >
                {(['Journal', 'Conference', 'Book Chapter', 'Preprint'] as const).map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Status</label>
              <select
                id="pub-status"
                value={form.status}
                onChange={set('status')}
                className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground outline-none focus:border-primary transition-all"
              >
                {(['Draft', 'Submitted', 'Under Review', 'Published'] as const).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Abstract</label>
            <textarea
              id="pub-abstract"
              value={form.abstract}
              onChange={set('abstract')}
              rows={4}
              placeholder="Enter abstract..."
              className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Keywords</label>
            <input
              id="pub-keywords"
              type="text"
              value={form.keywords}
              onChange={set('keywords')}
              placeholder="keyword1, keyword2, keyword3..."
              className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-5 border-t border-border bg-secondary/40 flex-shrink-0">
          <button
            id="modal-cancel-btn"
            type="button"
            onClick={onClose}
            className="flex-1 border border-border bg-card text-foreground/80 rounded-xl py-2.5 text-sm font-medium hover:bg-secondary/60 transition-colors"
          >
            Cancel
          </button>
          <button
            id="modal-save-btn"
            type="submit"
            onClick={(e) => {
              e.preventDefault()
              if (!form.title.trim()) return
              onSave(form)
            }}
            className="flex-1 bg-primary text-primary-foreground rounded-xl py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            {mode === 'add' ? 'Add Publication' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────
// Publication Detail Modal
// ──────────────────────────────────────────
function DetailModal({ pub, onClose, onEdit, onDelete, darkMode }: { pub: Publication; onClose: () => void; onEdit: () => void; onDelete: () => void; darkMode: boolean }) {
  const sc = (darkMode ? darkStatusColors : statusColors)[pub.status]
  const TypeIcon = typeIcons[pub.type]
  const typeColor = typeColors[pub.type]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-card rounded-3xl shadow-2xl shadow-black/20 w-full max-w-2xl overflow-hidden border border-border max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-border gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <TypeIcon className="w-4 h-4 flex-shrink-0" style={{ color: typeColor }} />
              <span className="text-xs font-semibold" style={{ color: typeColor }}>{pub.type}</span>
              <span
                className="badge px-2.5 py-0.5 rounded-lg text-xs font-semibold flex items-center gap-1"
                style={{ backgroundColor: sc.bg, color: sc.text }}
              >
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: sc.dot }} />
                {pub.status}
              </span>
            </div>
            <h2 className="text-base font-bold text-foreground leading-snug">{pub.title}</h2>
            <p className="text-xs text-muted-foreground mt-1">{pub.authors.join(', ')}</p>
          </div>
          <button
            id="detail-close-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Meta grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Journal', value: pub.journal },
              { label: 'Year', value: pub.year },
              { label: 'Citations', value: pub.citations > 0 ? pub.citations : '—' },
              ...(pub.doi ? [{ label: 'DOI', value: pub.doi }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="bg-secondary/50 rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-1">{label}</p>
                <p className="text-sm font-semibold text-foreground truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* Abstract */}
          {pub.abstract && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Abstract</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{pub.abstract}</p>
            </div>
          )}

          {/* Keywords */}
          {pub.keywords.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Keywords</p>
              <div className="flex flex-wrap gap-2">
                {pub.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-medium"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-5 border-t border-border bg-secondary/40 flex-shrink-0">
          <button
            id="detail-delete-btn"
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1.5 border border-error/30 bg-error/5 text-error rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-error/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <div className="flex-1" />
          <button
            id="detail-edit-btn"
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────
export default function PublicationsPage() {
  const { publications, darkMode, addPublication, updatePublication, deletePublication } = usePublications()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<(typeof STATUSES)[number]>('All')
  const [typeFilter, setTypeFilter] = useState<(typeof TYPES)[number]>('All')
  const [sortBy, setSortBy] = useState<SortKey>('year')
  const [sortDesc, setSortDesc] = useState(true)

  // modal states
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Publication | null>(null)
  const [detailTarget, setDetailTarget] = useState<Publication | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const sc = darkMode ? darkStatusColors : statusColors

  // ---- filtering & sorting ----
  const filtered = publications
    .filter(
      (p) =>
        (statusFilter === 'All' || p.status === statusFilter) &&
        (typeFilter === 'All' || p.type === typeFilter) &&
        (p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.authors.some((a) => a.toLowerCase().includes(search.toLowerCase())) ||
          p.journal.toLowerCase().includes(search.toLowerCase()) ||
          p.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()))),
    )
    .sort((a, b) => {
      const dir = sortDesc ? -1 : 1
      if (sortBy === 'year') return (a.year - b.year) * dir
      if (sortBy === 'citations') return (a.citations - b.citations) * dir
      if (sortBy === 'title') return a.title.localeCompare(b.title) * dir
      return 0
    })

  // ---- stats ----
  const totalCitations = publications.reduce((s, p) => s + p.citations, 0)
  const published = publications.filter((p) => p.status === 'Published').length
  const inProgress = publications.filter((p) => ['Submitted', 'Under Review', 'Draft'].includes(p.status)).length

  // ---- handlers ----
  const handleAdd = (f: FormState) => {
    addPublication(formToPublication(f))
    setAddModalOpen(false)
  }
  const handleEdit = (f: FormState) => {
    if (!editTarget) return
    updatePublication(editTarget.id, formToPublication(f))
    setEditTarget(null)
    setDetailTarget(null)
  }
  const handleDelete = (id: string) => {
    deletePublication(id)
    setDeleteConfirmId(null)
    setDetailTarget(null)
  }

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortDesc((d) => !d)
    else {
      setSortBy(key)
      setSortDesc(true)
    }
  }

  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <button
      onClick={() => toggleSort(k)}
      className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wide transition-colors ${
        sortBy === k ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {label}
      {sortBy === k && (
        <ChevronDown
          className="w-3 h-3 transition-transform"
          style={{ transform: sortDesc ? 'rotate(0deg)' : 'rotate(180deg)' }}
        />
      )}
    </button>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Top bar ─── */}
      <header className="sticky top-0 z-30 bg-card/90 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground leading-none">
                Publication<span className="gradient-text">Manager</span>
              </h1>
              <p className="text-xs text-muted-foreground">{publications.length} publications</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="add-publication-btn"
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground rounded-xl px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:block">Add Publication</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ─── Stats ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Publications"
            value={publications.length}
            icon={FileText}
            color="#2563EB"
            sub="All time"
          />
          <StatCard
            label="Published"
            value={published}
            icon={Star}
            color="#10B981"
            sub={`${Math.round((published / publications.length) * 100)}% of total`}
          />
          <StatCard
            label="In Progress"
            value={inProgress}
            icon={RefreshCw}
            color="#F59E0B"
            sub="Draft + Submitted + Review"
          />
          <StatCard
            label="Total Citations"
            value={totalCitations.toLocaleString()}
            icon={TrendingUp}
            color="#7C3AED"
            sub="Across all publications"
          />
        </div>

        {/* ─── Filters & search ─── */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="search-input"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, author, journal, keyword..."
                className="w-full bg-background border border-border rounded-xl py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="text-sm border border-border bg-background text-foreground rounded-xl px-3 py-2.5 outline-none focus:border-primary"
            >
              <option value="year">Sort: Year</option>
              <option value="citations">Sort: Citations</option>
              <option value="title">Sort: Title</option>
            </select>
            <button
              id="sort-dir-btn"
              onClick={() => setSortDesc((d) => !d)}
              title={sortDesc ? 'Descending' : 'Ascending'}
              className="w-10 h-10 rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors flex items-center justify-center"
            >
              <ChevronDown
                className="w-4 h-4 transition-transform"
                style={{ transform: sortDesc ? 'rotate(0deg)' : 'rotate(180deg)' }}
              />
            </button>
          </div>

          {/* Type filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <span className="flex items-center gap-1 text-xs text-muted-foreground self-center flex-shrink-0">
              <Filter className="w-3 h-3" /> Type:
            </span>
            {TYPES.map((t) => {
              const Icon = t !== 'All' ? typeIcons[t] : null
              const color = t !== 'All' ? typeColors[t] : '#64748B'
              return (
                <button
                  key={t}
                  id={`type-filter-${t.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setTypeFilter(t)}
                  className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl transition-all ${
                    typeFilter === t ? 'text-white shadow-sm' : 'bg-secondary border border-border text-muted-foreground hover:bg-secondary/80'
                  }`}
                  style={typeFilter === t ? { backgroundColor: color } : {}}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {t}
                  <span className={`text-xs ${typeFilter === t ? 'opacity-70' : 'text-muted-foreground/60'}`}>
                    ({t === 'All' ? publications.length : publications.filter((p) => p.type === t).length})
                  </span>
                </button>
              )
            })}
          </div>

          {/* Status filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <span className="flex items-center gap-1 text-xs text-muted-foreground self-center flex-shrink-0">
              <Filter className="w-3 h-3" /> Status:
            </span>
            {STATUSES.map((s) => (
              <button
                key={s}
                id={`status-filter-${s.toLowerCase().replace(' ', '-')}`}
                onClick={() => setStatusFilter(s)}
                className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-xl transition-colors ${
                  statusFilter === s
                    ? 'bg-foreground text-card'
                    : 'bg-secondary border border-border text-muted-foreground hover:bg-secondary/80'
                }`}
              >
                {s}
                <span className="ml-1 opacity-60">
                  ({s === 'All' ? publications.length : publications.filter((p) => p.status === s).length})
                </span>
              </button>
            ))}
            <span className="text-xs text-muted-foreground/60 self-center ml-2">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* ─── Table ─── */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-3">
                    <SortBtn k="title" label="Publication" />
                  </th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</span>
                  </th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Journal / Venue</span>
                  </th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">
                    <SortBtn k="citations" label="Citations" />
                  </th>
                  <th className="text-left px-4 py-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</span>
                  </th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">
                    <SortBtn k="year" label="Year" />
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((pub) => {
                  const statusStyle = sc[pub.status]
                  const TypeIcon = typeIcons[pub.type]
                  const typeColor = typeColors[pub.type]
                  return (
                    <tr
                      key={pub.id}
                      className="hover:bg-secondary/50 transition-colors group cursor-pointer"
                      onClick={() => setDetailTarget(pub)}
                    >
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-0.5">
                          {pub.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{pub.authors.join(', ')}</p>
                        {pub.doi && <p className="text-xs font-mono text-muted-foreground/60 mt-0.5 truncate">{pub.doi}</p>}
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <TypeIcon className="w-3.5 h-3.5" style={{ color: typeColor }} />
                          <span className="text-xs font-medium" style={{ color: typeColor }}>
                            {pub.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell max-w-[160px]">
                        <p className="text-xs text-foreground/80 truncate">{pub.journal}</p>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-sm font-semibold text-foreground tabular-nums">
                          {pub.citations > 0 ? pub.citations.toLocaleString() : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className="badge px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 w-fit"
                          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: statusStyle.dot }}
                          />
                          {pub.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className="text-xs text-muted-foreground tabular-nums">{pub.year}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            id={`view-btn-${pub.id}`}
                            title="View details"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDetailTarget(pub)
                            }}
                            className="w-7 h-7 rounded-lg hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`edit-btn-${pub.id}`}
                            title="Edit"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditTarget(pub)
                            }}
                            className="w-7 h-7 rounded-lg hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`delete-btn-${pub.id}`}
                            title="Delete"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteConfirmId(pub.id)
                            }}
                            className="w-7 h-7 rounded-lg hover:bg-error/10 flex items-center justify-center text-muted-foreground hover:text-error transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          {pub.doi && (
                            <a
                              id={`doi-link-${pub.id}`}
                              href={`https://doi.org/${pub.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open DOI"
                              onClick={(e) => e.stopPropagation()}
                              className="w-7 h-7 rounded-lg hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">No publications found</p>
              <p className="text-xs text-muted-foreground/70 mb-4">
                {search || statusFilter !== 'All' || typeFilter !== 'All'
                  ? 'Try adjusting your search or filters'
                  : 'Click "Add Publication" to get started'}
              </p>
              {(search || statusFilter !== 'All' || typeFilter !== 'All') && (
                <button
                  onClick={() => {
                    setSearch('')
                    setStatusFilter('All')
                    setTypeFilter('All')
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{' '}
              <span className="font-semibold text-foreground">{publications.length}</span> publications
            </p>
            <button
              id="add-publication-footer-btn"
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add new
            </button>
          </div>
        </div>
      </main>

      {/* ─── Add Modal ─── */}
      {addModalOpen && (
        <PublicationModal mode="add" initial={emptyForm} onClose={() => setAddModalOpen(false)} onSave={handleAdd} />
      )}

      {/* ─── Edit Modal ─── */}
      {editTarget && !detailTarget && (
        <PublicationModal
          mode="edit"
          initial={publicationToForm(editTarget)}
          onClose={() => setEditTarget(null)}
          onSave={handleEdit}
        />
      )}

      {/* ─── Detail Modal ─── */}
      {detailTarget && !editTarget && (
        <DetailModal
          pub={detailTarget}
          darkMode={darkMode}
          onClose={() => setDetailTarget(null)}
          onEdit={() => {
            setEditTarget(detailTarget)
            setDetailTarget(null)
          }}
          onDelete={() => setDeleteConfirmId(detailTarget.id)}
        />
      )}

      {/* ─── Delete Confirm ─── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl shadow-black/20 w-full max-w-sm p-6">
            <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6 text-error" />
            </div>
            <h3 className="text-lg font-bold text-foreground text-center mb-1">Delete Publication</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              This action cannot be undone. The publication will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                id="delete-cancel-btn"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 border border-border rounded-xl py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary/60 transition-colors"
              >
                Cancel
              </button>
              <button
                id="delete-confirm-btn"
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 bg-error text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-error/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
