import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Boxes,
  Code2,
  DatabaseZap,
  Download,
  ExternalLink,
  HardDrive,
  LayoutGrid,
  List,
  Plus,
  Rocket,
  Search,
  Share2,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Badge, Button } from '@/components/common';
import { projectsService } from '@/services/projects.service';
import useProjectsStore from '@/store/projects.store';

const statusVariant = {
  draft: 'default',
  generating: 'warning',
  ready: 'success',
  deployed: 'info',
};

const statusStyles = {
  draft: '!bg-[#e6e9f2] !text-[#343945]',
  generating: '!bg-[#fff2c7] !text-[#8a5b08]',
  ready: '!bg-[#dff7f1] !text-[#0f766e]',
  deployed: '!bg-[#dff7f1] !text-[#0f766e]',
};

const getProjectStorageBytes = (project) => {
  const value = project.storage_bytes ?? project.storageBytes ?? 0;
  const bytes = Number(value);
  return Number.isFinite(bytes) && bytes > 0 ? bytes : 0;
};

const getProjectVercelUrl = (project) =>
  project.vercel_url ||
  project.vercelUrl ||
  project.vercel_production_url ||
  project.vercelProductionUrl ||
  project.vercel_preview_url ||
  project.vercelPreviewUrl ||
  '';

const isProjectLive = (project) => {
  const live = project.is_live ?? project.isLive;
  if (live !== undefined && live !== null) return Boolean(live);
  return Boolean(getProjectVercelUrl(project));
};

const getProjectStatus = (project) => (isProjectLive(project) ? 'deployed' : project.status);

const isDatabaseConnected = (project) => Boolean(
  project.supabase_connected ?? project.supabaseConnected
);

const getCreatedTime = (project) => new Date(project.createdAt ?? project.created_at ?? 0).getTime() || 0;

const formatBytes = (bytes) => {
  if (!bytes) return '0 MB';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / (1024 ** exponent);
  const precision = value >= 10 || exponent === 0 ? 0 : 1;
  return `${value.toFixed(precision)} ${units[exponent]}`;
};

function DashboardSkeleton() {
  const statSkeletons = ['stat-1', 'stat-2', 'stat-3'];
  const projectSkeletons = ['project-1', 'project-2', 'project-3'];

  return (
    <div className="mx-auto max-w-7xl animate-pulse" aria-label="Loading dashboard">
      <div className="mb-8 h-56 rounded-lg border border-[#d8d0c0] bg-[#fffaf0]" />
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statSkeletons.map((item) => (
          <div key={item} className="rounded-lg border border-[#d8d0c0] bg-white p-5">
            <div className="h-4 w-28 rounded bg-[#e4dccf]" />
            <div className="mt-3 h-8 w-16 rounded bg-[#d8d0c0]" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projectSkeletons.map((item) => (
          <div key={item} className="rounded-lg border border-[#d8d0c0] bg-white p-5">
            <div className="mb-5 h-32 rounded-lg bg-[#f1eadf]" />
            <div className="h-5 w-2/5 rounded bg-[#d8d0c0]" />
            <div className="mt-3 h-3 w-28 rounded bg-[#e4dccf]" />
            <div className="mt-6 flex gap-2">
              <div className="h-9 w-20 rounded-lg bg-[#e4dccf]" />
              <div className="h-9 w-20 rounded-lg bg-[#e4dccf]" />
              <div className="h-9 w-24 rounded-lg bg-[#e4dccf]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, listView = false }) {
  const [downloading, setDownloading] = useState(false);
  const deployedUrl = getProjectVercelUrl(project);
  const createdAtValue = project.createdAt || project.created_at;
  const createdDate = createdAtValue ? new Date(createdAtValue) : null;
  const createdDateLabel = createdDate && !Number.isNaN(createdDate.getTime())
    ? createdDate.toLocaleDateString()
    : 'Unknown date';
  const displayStatus = getProjectStatus(project);
  const databaseConnected = isDatabaseConnected(project);
  const initials = String(project.name || 'Store')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'ST';

  const handleDownloadProject = async () => {
    setDownloading(true);
    try {
      const res = await projectsService.download(project.id);
      const blob = new Blob([res.data], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name || 'project'}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download project zip');
    } finally {
      setDownloading(false);
    }
  };

  const handleShareStore = async () => {
    if (!deployedUrl) {
      toast.error('This store is not deployed yet');
      return;
    }

    try {
      await navigator.clipboard.writeText(deployedUrl);
      toast.success('Deployed store link copied');
    } catch {
      toast.error('Failed to copy store link');
    }
  };

  return (
    <article
      className={`group rounded-lg border border-[#d8d0c0] bg-white p-5 shadow-[0_18px_55px_rgba(22,24,31,0.06)] transition hover:-translate-y-1 hover:border-[#10131b] ${
        listView ? 'lg:flex lg:items-center lg:gap-5' : ''
      }`}
    >
      <div
        className={`relative mb-5 overflow-hidden rounded-lg border border-[#d8d0c0] bg-[#f7f2e8] p-5 ${
          listView ? 'lg:mb-0 lg:w-72 lg:shrink-0' : ''
        }`}
      >
        <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-[#dff7f1]" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#10131b] text-lg font-black text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-[#10131b]">{project.name}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#6f766f]">
              {displayStatus === 'deployed' ? 'Live store' : 'Workspace'}
            </p>
          </div>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-black text-[#10131b]">{project.name}</h3>
            <p className="mt-1 text-sm font-bold text-[#6f766f]">Created {createdDateLabel}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={statusVariant[displayStatus] || 'default'} className={`!font-black ${statusStyles[displayStatus] || statusStyles.draft}`}>
              {displayStatus || 'draft'}
            </Badge>
            <Badge
              variant={databaseConnected ? 'success' : 'danger'}
              className={`!font-black ${databaseConnected ? '!bg-[#dff7f1] !text-[#0f766e]' : '!bg-[#ffe6df] !text-[#ba4d41]'}`}
            >
              {databaseConnected ? 'database connected' : 'database needed'}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to={`/projects/${project.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#10131b] px-3 py-2 text-xs font-black text-white transition hover:bg-[#253044]"
          >
            <ExternalLink size={12} /> Open
          </Link>
          <Link
            to={`/projects/${project.id}/code`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#d8d0c0] bg-[#fffaf0] px-3 py-2 text-xs font-black text-[#343945] transition hover:border-[#10131b]"
          >
            <Code2 size={12} /> Code
          </Link>
          <button
            onClick={handleShareStore}
            disabled={!deployedUrl}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#d8d0c0] bg-[#fffaf0] px-3 py-2 text-xs font-black text-[#343945] transition hover:border-[#10131b] disabled:cursor-not-allowed disabled:opacity-45"
            title={deployedUrl || 'Deploy this store before sharing'}
          >
            <Share2 size={12} /> Share
          </button>
          <button
            onClick={handleDownloadProject}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#d8d0c0] bg-[#fffaf0] px-3 py-2 text-xs font-black text-[#343945] transition hover:border-[#10131b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download size={12} /> {downloading ? 'Downloading...' : 'Download'}
          </button>
          <button className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-[#f0c9c1] bg-[#fff4f1] px-3 py-2 text-xs font-black text-[#ba4d41] transition hover:bg-[#ffe6df]">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function DashboardPage() {
  const projects = useProjectsStore((s) => s.projects);
  const setProjects = useProjectsStore((s) => s.setProjects);
  const [view, setView] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    query: '',
    deployment: 'all',
    database: 'all',
    sort: 'newest',
  });

  useEffect(() => {
    let mounted = true;

    projectsService.list()
      .then((res) => {
        if (!mounted) return;
        const items = res.data.items || res.data || [];
        const sortedProjects = [...items].sort((a, b) => {
          const aTime = new Date(a.createdAt ?? a.created_at ?? 0).getTime();
          const bTime = new Date(b.createdAt ?? b.created_at ?? 0).getTime();
          return bTime - aTime;
        });
        setProjects(sortedProjects);
      })
      .catch((err) => console.error('Failed to load projects', err))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [setProjects]);

  const filteredProjects = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return projects
      .filter((project) => {
        const name = String(project.name || '').toLowerCase();
        const slug = String(project.slug || '').toLowerCase();
        const matchesQuery = !query || name.includes(query) || slug.includes(query);
        const status = getProjectStatus(project);
        const matchesDeployment = filters.deployment === 'all' || status === filters.deployment;
        const connected = isDatabaseConnected(project);
        const matchesDatabase =
          filters.database === 'all' ||
          (filters.database === 'connected' && connected) ||
          (filters.database === 'not_connected' && !connected);

        return matchesQuery && matchesDeployment && matchesDatabase;
      })
      .sort((a, b) => {
        if (filters.sort === 'oldest') return getCreatedTime(a) - getCreatedTime(b);
        if (filters.sort === 'name') return String(a.name || '').localeCompare(String(b.name || ''));
        if (filters.sort === 'storage') return getProjectStorageBytes(b) - getProjectStorageBytes(a);
        return getCreatedTime(b) - getCreatedTime(a);
      });
  }, [projects, filters]);

  const hasActiveFilters =
    Boolean(filters.query.trim()) ||
    filters.deployment !== 'all' ||
    filters.database !== 'all' ||
    filters.sort !== 'newest';

  const resetFilters = () => {
    setFilters({
      query: '',
      deployment: 'all',
      database: 'all',
      sort: 'newest',
    });
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  const storesLive = projects.filter((project) => isProjectLive(project)).length;
  const storageUsed = projects.reduce(
    (total, project) => total + getProjectStorageBytes(project),
    0
  );
  const databaseReady = projects.filter((project) => isDatabaseConnected(project)).length;

  const statCards = [
    { label: 'Total projects', value: projects.length, glyph: <Boxes size={18} />, helper: 'Workspaces generated' },
    { label: 'Stores live', value: storesLive, glyph: <Rocket size={18} />, helper: 'Ready for customers' },
    { label: 'Storage used', value: formatBytes(storageUsed), glyph: <HardDrive size={18} />, helper: 'Across all projects' },
  ];

  return (
    <div className="mx-auto max-w-7xl text-[#10131b]">
      <section className="mb-8 overflow-hidden rounded-lg border border-[#d8d0c0] bg-[#fffaf0] shadow-[0_20px_70px_rgba(22,24,31,0.08)]">
        <div className="grid gap-8 p-6 lg:grid-cols-[1fr_22rem] lg:p-8">
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#0f766e]">Dashboard</p>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              Manage the stores ASEA helped you build.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#5c6270]">
              Track generated projects, deployment readiness, database connections, exports, and the next launch action from one focused workspace.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/projects/new">
                <Button className="!rounded-lg !bg-[#10131b] px-5 py-3 font-black !text-white hover:!bg-[#253044]">
                  <Plus size={16} />
                  New project
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d8d0c0] bg-white px-5 py-3 text-sm font-black text-[#10131b] transition hover:border-[#10131b]"
              >
                <SlidersHorizontal size={16} />
                Tune view
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-[#10131b] p-5 text-white">
            <div className="mb-8 flex items-center justify-between">
              <span className="rounded-lg bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#10131b]">
                Launch health
              </span>
              <DatabaseZap className="h-6 w-6 text-[#f2b84b]" />
            </div>
            <div className="space-y-5">
              <div>
                <div className="mb-2 flex justify-between text-sm font-black">
                  <span>Database connected</span>
                  <span>{databaseReady}/{projects.length || 0}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#0f766e]"
                    style={{ width: `${projects.length ? (databaseReady / projects.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-white/10 bg-white/8 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-white/48">Live</p>
                  <p className="mt-2 text-3xl font-black">{storesLive}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/8 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-white/48">Drafts</p>
                  <p className="mt-2 text-3xl font-black">{Math.max(projects.length - storesLive, 0)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statCards.map(({ label, value, glyph, helper }) => (
          <div key={label} className="rounded-lg border border-[#d8d0c0] bg-white p-5 shadow-[0_14px_45px_rgba(22,24,31,0.05)]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#6f766f]">{label}</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dff7f1] text-[#0f766e]">
                {glyph}
              </span>
            </div>
            <p className="text-3xl font-black tracking-tight text-[#10131b]">{value}</p>
            <p className="mt-2 text-sm font-bold text-[#6f766f]">{helper}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-lg border border-[#d8d0c0] bg-[#fffaf0] p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Projects</h2>
            <p className="mt-1 text-sm font-bold text-[#6f766f]">
              {filteredProjects.length} visible of {projects.length} total
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b8174]" />
              <input
                value={filters.query}
                onChange={(e) => setFilters((current) => ({ ...current, query: e.target.value }))}
                placeholder="Search projects"
                className="w-full rounded-lg border border-[#d8d0c0] bg-white py-2.5 pl-9 pr-3 text-sm font-bold text-[#10131b] outline-none placeholder:text-[#9a9387] focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e]/20"
              />
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen((current) => !current)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-black transition-colors ${
                filtersOpen || hasActiveFilters
                  ? 'border-[#0f766e]/35 bg-[#dff7f1] text-[#0f766e]'
                  : 'border-[#d8d0c0] bg-white text-[#343945] hover:border-[#10131b]'
              }`}
            >
              <SlidersHorizontal size={15} /> Filters
            </button>
            <div className="flex overflow-hidden rounded-lg border border-[#d8d0c0] bg-white">
              <button
                onClick={() => setView('grid')}
                className={`p-2.5 ${view === 'grid' ? 'bg-[#10131b] text-white' : 'text-[#6f766f] hover:text-[#10131b]'}`}
                aria-label="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2.5 ${view === 'list' ? 'bg-[#10131b] text-white' : 'text-[#6f766f] hover:text-[#10131b]'}`}
                aria-label="List view"
              >
                <List size={16} />
              </button>
            </div>
            <Link to="/projects/new">
              <Button size="md" className="!rounded-lg !bg-[#10131b] px-4 py-2.5 font-black !text-white hover:!bg-[#253044]">
                <Plus size={16} /> New project
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {filtersOpen && (
        <div className="mb-6 rounded-lg border border-[#d8d0c0] bg-white p-4 shadow-[0_14px_45px_rgba(22,24,31,0.05)]">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <label className="space-y-1.5">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6f766f]">Deployment</span>
              <select
                value={filters.deployment}
                onChange={(e) => setFilters((current) => ({ ...current, deployment: e.target.value }))}
                className="w-full rounded-lg border border-[#d8d0c0] bg-[#fffaf0] px-3 py-2 text-sm font-bold text-[#10131b] outline-none focus:border-[#0f766e]"
              >
                <option value="all">All statuses</option>
                <option value="deployed">Deployed</option>
                <option value="ready">Ready</option>
                <option value="generating">Generating</option>
                <option value="draft">Draft</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6f766f]">Database</span>
              <select
                value={filters.database}
                onChange={(e) => setFilters((current) => ({ ...current, database: e.target.value }))}
                className="w-full rounded-lg border border-[#d8d0c0] bg-[#fffaf0] px-3 py-2 text-sm font-bold text-[#10131b] outline-none focus:border-[#0f766e]"
              >
                <option value="all">All database states</option>
                <option value="connected">Connected</option>
                <option value="not_connected">Not connected</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6f766f]">Sort</span>
              <select
                value={filters.sort}
                onChange={(e) => setFilters((current) => ({ ...current, sort: e.target.value }))}
                className="w-full rounded-lg border border-[#d8d0c0] bg-[#fffaf0] px-3 py-2 text-sm font-bold text-[#10131b] outline-none focus:border-[#0f766e]"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="name">Name A-Z</option>
                <option value="storage">Storage used</option>
              </select>
            </label>
            <div className="flex items-end">
              <button
                type="button"
                onClick={resetFilters}
                disabled={!hasActiveFilters}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#d8d0c0] bg-[#fffaf0] px-3 py-2 text-sm font-black text-[#343945] transition-colors hover:border-[#10131b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={15} /> Clear filters
              </button>
            </div>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-[#d8d0c0] bg-[#fffaf0] px-6 py-24 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-lg bg-[#dff7f1] text-[#0f766e]">
            <Plus size={32} />
          </div>
          <h2 className="mb-2 text-2xl font-black">No projects yet</h2>
          <p className="mb-7 max-w-sm text-sm leading-6 text-[#5c6270]">
            Create your first AI-generated e-commerce store and manage the launch here.
          </p>
          <Link to="/projects/new">
            <Button size="lg" className="!rounded-lg !bg-[#10131b] font-black !text-white hover:!bg-[#253044]">
              <Plus size={18} /> Create your first store
            </Button>
          </Link>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-[#d8d0c0] bg-[#fffaf0] px-6 py-20 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-lg bg-[#fff2c7] text-[#9a6a0a]">
            <SlidersHorizontal size={30} />
          </div>
          <h2 className="mb-2 text-2xl font-black">No matching projects</h2>
          <p className="mb-7 max-w-sm text-sm leading-6 text-[#5c6270]">
            Adjust your filters to see more stores.
          </p>
          <Button
            size="md"
            variant="secondary"
            className="!rounded-lg !border-[#d8d0c0] !bg-white font-black !text-[#10131b] hover:!bg-[#f6f1e8]"
            onClick={resetFilters}
          >
            <X size={16} /> Clear filters
          </Button>
        </div>
      ) : (
        <div
          className={
            view === 'grid'
              ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3'
              : 'space-y-4'
          }
        >
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} listView={view === 'list'} />
          ))}
        </div>
      )}
    </div>
  );
}
