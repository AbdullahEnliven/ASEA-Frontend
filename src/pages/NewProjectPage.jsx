import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Loader2, Bot, Database, Layout, Palette, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Button, Input } from '@/components/common';
import { STORE_CATEGORIES } from '@/constants';
import useGenerationStore from '@/store/generation.store';
import useProjectsStore from '@/store/projects.store';
import { projectsService } from '@/services/projects.service';

// ─── Step 1: Requirement Input ────────────────────────
function RequirementStep({ data, onChange, onGenerate }) {
  const [enhancing, setEnhancing] = useState(false);

  const enhance = async () => {
    if (!data.requirements?.trim()) {
      toast.error('Please describe your store first');
      return;
    }
    setEnhancing(true);
    try {
      const res = await projectsService.enhanceRequirements(data.requirements);
      onChange({ requirements: res.data.enhanced });
      toast.success('Requirements enhanced!');
    } catch {
      toast.error('Enhancement failed');
    } finally {
      setEnhancing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-2">Describe Your Store</h2>
      <p className="text-gray-400 text-sm mb-8">
        Tell us what kind of e-commerce store you want to build. Be as detailed as you like.
      </p>

      <textarea
        value={data.requirements || ''}
        onChange={(e) => onChange({ requirements: e.target.value })}
        rows={8}
        placeholder="I want a fashion store selling streetwear for men and women. I need size and color variants, a lookbook page, and Instagram-style product photos..."
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white placeholder:text-gray-500 outline-none focus:border-blue-500 resize-none"
      />
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500">
          {data.requirements?.length || 0} characters
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={enhance}
          loading={enhancing}
        >
          <Sparkles size={14} /> Enhance with AI
        </Button>
      </div>

      {/* Category pills */}
      <div className="mt-6">
        <p className="text-sm text-gray-400 mb-3">Store Category</p>
        <div className="flex flex-wrap gap-2">
          {STORE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onChange({ category: cat })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border
                ${data.category === cat
                  ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
                  : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Optional fields */}
      <details className="mt-6">
        <summary className="text-sm text-gray-400 cursor-pointer hover:text-white">
          Optional: Additional details
        </summary>
        <div className="mt-4 space-y-4">
          <Input
            label="Store Name"
            placeholder="My Awesome Store"
            value={data.storeName || ''}
            onChange={(e) => onChange({ storeName: e.target.value })}
          />
          <p className="text-xs text-gray-500 -mt-2">
            Leave blank to auto-generate a strong store name using Groq.
          </p>
          <Input
            label="Target Market"
            placeholder="e.g. Young adults 18-35"
            value={data.targetMarket || ''}
            onChange={(e) => onChange({ targetMarket: e.target.value })}
          />
        </div>
      </details>

      <div className="flex justify-end mt-8">
        <Button
          size="lg"
          onClick={onGenerate}
          disabled={!data.requirements?.trim()}
        >
          Generate Store <ArrowRight size={18} />
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Step 2: Generation Progress ──────────────────────
// Cool animation components
const agents = [
  { id: 'architect', name: 'Architect Agent', icon: Database, task: 'Database & Models' },
  { id: 'backend', name: 'Backend Agent', icon: Server, task: 'API & Business Logic' },
  { id: 'frontend', name: 'Frontend Agent', icon: Layout, task: 'Components & Pages' },
  { id: 'stylist', name: 'Stylist Agent', icon: Palette, task: 'Tailwind & Design' },
];

function GenerationStep({ projectId }) {
  const status = useGenerationStore((state) => state.status);
  const progress = useGenerationStore((state) => state.progress);
  const logs = useGenerationStore((state) => state.logs);
  const currentStep = useGenerationStore((state) => state.currentStep);
  const setStatus = useGenerationStore((state) => state.setStatus);
  const setProgress = useGenerationStore((state) => state.setProgress);
  const setStep = useGenerationStore((state) => state.setStep);
  const appendLog = useGenerationStore((state) => state.appendLog);
  
  // Fake generation simulation
  useEffect(() => {
    if (!projectId) return;

    setStatus('running');
    setProgress(0);

    const stepsInfo = [
      { stepText: 'Architecting Database & Models', logLines: ['Designing database schema...', 'Generating SQLAlchemy models...', 'Establishing relationships...', 'Creating initial migrations...'] },
      { stepText: 'Building API & Business Logic', logLines: ['Scaffolding FastAPI app...', 'Setting up authentication routes...', 'Creating product and order endpoints...', 'Implementing background tasks...'] },
      { stepText: 'Developing UI Components', logLines: ['Initializing React application...', 'Building layout components...', 'Integrating Zustand state...', 'Fetching template assets...'] },
      { stepText: 'Applying Styles & Polish', logLines: ['Configuring Tailwind CSS...', 'Adding Framer Motion animations...', 'Finalizing responsive design...', 'Preparing deployment package...'] },
    ];

    let overallProgress = 0;
    const totalLogs = stepsInfo.reduce((acc, s) => acc + s.logLines.length, 0);
    const progressPerLog = 100 / totalLogs;

    const simulateGeneration = async () => {
      // 1.5s initial startup delay
      await new Promise(r => setTimeout(r, 1500));
      
      for (let i = 0; i < stepsInfo.length; i++) {
        setStep(stepsInfo[i].stepText);
        for (let j = 0; j < stepsInfo[i].logLines.length; j++) {
          await new Promise(r => setTimeout(r, 600 + Math.random() * 400)); // 0.6s - 1s per log
          appendLog({ level: 'info', line: stepsInfo[i].logLines[j] });
          overallProgress += progressPerLog;
          setProgress(Math.min(Math.round(overallProgress), 99));
        }
      }
      
      await new Promise(r => setTimeout(r, 1000));
      appendLog({ level: 'success', line: 'Multi-agent orchestration complete! Project is ready.' });
      setProgress(100);
      setStatus('complete');
    };

    simulateGeneration();
  }, [projectId]);

  // We determine active agent based on progress for visual sync:
  const activeIndex = Math.min(Math.floor(progress / 25), 3);

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 mb-6 relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            className="absolute inset-0 border-t-2 border-r-2 border-blue-400 rounded-full"
          />
          <Bot size={32} />
        </div>
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Orchestrating AI Agents...
        </h2>
        <p className="text-gray-400 text-lg">
          {currentStep || 'Initializing multi-agent framework...'}
        </p>
      </motion.div>

      {/* Agents grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-12">
        {agents.map((agent, idx) => {
          const isActive = idx === activeIndex && status !== 'complete';
          const isDone = progress >= ((idx + 1) * 25);
          const Icon = agent.icon;
          
          return (
            <motion.div
              key={agent.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-6 rounded-2xl border transition-all duration-500 relative overflow-hidden
                ${isActive 
                  ? 'border-blue-500/50 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]' 
                  : isDone
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-white/5 bg-white/5 opacity-50'
                }`}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-blue-500/10"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
              <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center
                ${isActive ? 'bg-blue-500/20 text-blue-400' : isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-gray-500'}
              `}>
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-white mb-1">{agent.name}</h3>
              <p className="text-xs text-gray-400">{agent.task}</p>
              
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                  <motion.div 
                    className="h-full bg-blue-500"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Global Progress & Logs */}
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm text-gray-400">Overall Generation Progress</span>
          <span className="text-sm font-mono text-blue-400">{progress}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/10 mb-6 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/50 p-4 h-48 overflow-y-auto font-mono text-xs space-y-2">
          {logs.map((log, i) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={i}
              className={`${
                log.level === 'error' ? 'text-red-400' :
                log.level === 'success' ? 'text-emerald-400' :
                'text-gray-400'
              }`}
            >
              <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
              {log.line}
            </motion.div>
          ))}
          {status === 'running' && (
            <div className="flex items-center gap-2 text-blue-400 pt-2">
              <Loader2 size={12} className="animate-spin" />
              Agent framework is processing...
            </div>
          )}
        </div>

        {status === 'error' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400"
          >
            Generation failed. Please try again or check the logs.
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Main Wizard ──────────────────────────────────────
export default function NewProjectPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});
  const [projectId, setProjectId] = useState(null);
  
  const addProject = useProjectsStore((s) => s.addProject);
  const generationReset = useGenerationStore((s) => s.reset);

  const updateData = useCallback((updates) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleGenerate = async () => {
    if (!data.requirements?.trim()) {
      toast.error('Please describe your store first');
      return;
    }

    // Immediately navigate to the animation loading page
    generationReset();
    setStep(2);

    try {
      // Run API calls in the background while animation plays
      const res = await projectsService.create({
        requirements: data.requirements,
        category: data.category,
        storeName: data.storeName,
        targetMarket: data.targetMarket,
      });
      const newProjectId = res.data.project.id;
      setProjectId(newProjectId);
      addProject(res.data.project);

      // Start generation
      await projectsService.startGeneration(newProjectId);
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.detail;
      toast.error(message || 'Failed to start generation');
      // Return to requirements step on failure
      setStep(1);
    }
  };

  // When generation completes, navigate to builder
  useEffect(() => {
    const unsub = useGenerationStore.subscribe((state) => {
      if (state.status === 'complete' && projectId) {
        toast.success('Store generated successfully!');
        // Redirect to live edit and preview page
        navigate(`/projects/${projectId}`);
      }
    });
    return unsub;
  }, [projectId, navigate]);

  return (
    <div className="w-full py-8 px-4">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <RequirementStep 
              data={data} 
              onChange={updateData} 
              onGenerate={handleGenerate} 
            />
          </motion.div>
        )}
        
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <GenerationStep projectId={projectId} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
