import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-blue-600/10 blur-[120px] rounded-full -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-24 lg:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-xs font-medium text-blue-100/70 tracking-wide uppercase">
            ASEA Project v1.0 is live
          </span>
        </div>

        <h1 className="text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] mb-8">
          The future of <br />
          <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-white/40">
            Web Architecture.
          </span>
        </h1>

        <p className="max-w-2xl text-lg lg:text-xl text-gray-400 mb-12 leading-relaxed">
          A high-performance React 19 template powered by Vite 8 and Tailwind
          v4. Built specifically for the ASEA project with speed and scalability
          in mind.
        </p>

        <div className="flex flex-row gap-4">
          <button
            onClick={() => setCount((c) => c + 1)}
            className="group relative px-8 py-4 bg-white text-black rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
          >
            Get Started <span className="ml-2 opacity-50">|</span>{" "}
            <span className="ml-2 font-mono">{count}</span>
          </button>

          <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all">
            View Components
          </button>
        </div>
      </section>

      {/* Feature Grid - Desktop First */}
      <section className="max-w-7xl mx-auto px-8 pb-32">
        <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-6">
          <div className="p-8 rounded-3xl bg-white/2 border border-white/10 hover:border-blue-500/50 transition-colors">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 text-blue-400 font-bold">
              01
            </div>
            <h3 className="text-xl font-bold mb-3">Vite 8 Rolldown</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Experience near-instant builds and HMR with the next generation of
              Vite's bundling engine.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/2 border border-white/10 hover:border-purple-500/50 transition-colors">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-400 font-bold">
              02
            </div>
            <h3 className="text-xl font-bold mb-3">React 19 Compiler</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Automatic memoization and state management optimization without
              the useMemo boilerplate.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/2 border border-white/10 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 text-emerald-400 font-bold">
              03
            </div>
            <h3 className="text-xl font-bold mb-3">Tailwind CSS v4</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Modern CSS-first approach with zero-runtime overhead and
              incredible developer velocity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
