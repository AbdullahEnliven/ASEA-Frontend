import { Link } from 'react-router-dom';
import { Plus, LayoutGrid, List, Trash2, ExternalLink, Download, Code2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { projectsService } from '@/services/projects.service';
import { Button, Badge, Spinner } from '@/components/common';
import useProjectsStore from '@/store/projects.store';
import toast from 'react-hot-toast';

const statusVariant = {
  draft: 'default',
  generating: 'warning',
  ready: 'success',
  deployed: 'info',
};

function ProjectCard({ project }) {
  const [downloading, setDownloading] = useState(false);

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

  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-white/20 transition-all">
      {/* Thumbnail placeholder */}
      <div className="h-36 rounded-xl bg-white/5 mb-4 flex items-center justify-center text-gray-600 text-sm">
        Preview
      </div>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-white">{project.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge variant={statusVariant[project.status] || 'default'}>
          {project.status}
        </Badge>
      </div>
      <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link
          to={`/projects/${project.id}`}
          className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10"
        >
          <ExternalLink size={12} /> Open
        </Link>
        <Link
          to={`/projects/${project.id}/code`}
          className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10"
        >
          <Code2 size={12} /> Code
        </Link>
        <button
          onClick={handleDownloadProject}
          disabled={downloading}
          className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Download size={12} /> {downloading ? 'Downloading...' : 'Download'}
        </button>
        <button className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 ml-auto">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const projects = useProjectsStore((s) => s.projects);
  const setProjects = useProjectsStore((s) => s.setProjects);
  const [view, setView] = useState('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsService.list()
      .then((res) => {
         setProjects(res.data.items || res.data || []);
      })
      .catch((err) => console.error("Failed to load projects", err))
      .finally(() => setLoading(false));
  }, [setProjects]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Projects', value: projects.length },
          { label: 'Stores Live', value: projects.filter((p) => p.status === 'deployed').length },
          { label: 'Storage Used', value: '0 MB' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
          >
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Projects</h1>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-white/10 overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`p-2 ${view === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 ${view === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
            >
              <List size={16} />
            </button>
          </div>
          <Link to="/projects/new">
            <Button size="md">
              <Plus size={16} /> New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Projects */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Plus size={32} className="text-gray-600" />
          </div>
          <h2 className="text-lg font-semibold mb-2">No projects yet</h2>
          <p className="text-sm text-gray-400 mb-6 max-w-xs">
            Create your first AI-generated e-commerce store in minutes.
          </p>
          <Link to="/projects/new">
            <Button size="lg">
              <Plus size={18} /> Create Your First Store
            </Button>
          </Link>
        </div>
      ) : (
        <div
          className={
            view === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-3'
          }
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
