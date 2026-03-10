import { useParams } from 'react-router-dom';
import { Settings, Link2, Globe } from 'lucide-react';
import { Button, Input } from '@/components/common';
import useProjectsStore from '@/store/projects.store';

export default function ProjectSettingsPage() {
  const { id } = useParams();
  const activeProject = useProjectsStore((s) => s.activeProject);

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-8">Project Settings</h1>

      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4 mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Settings size={18} /> General
        </h2>
        <Input
          label="Project Name"
          defaultValue={activeProject?.name || ''}
          placeholder="My Store"
        />
        <Input
          label="Custom Domain"
          placeholder="store.example.com"
          defaultValue=""
        />
        <Button>Save</Button>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Link2 size={18} /> Integrations
        </h2>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="font-medium text-sm">Supabase</p>
            <p className="text-xs text-gray-500">Not connected</p>
          </div>
          <Button variant="secondary" size="sm">Connect</Button>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="font-medium text-sm">GitHub</p>
            <p className="text-xs text-gray-500">Not connected</p>
          </div>
          <Button variant="secondary" size="sm">Connect</Button>
        </div>
      </section>
    </div>
  );
}
