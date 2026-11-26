import React from 'react';
import {
  LayoutDashboard,
  Mic,
  HeartPulse,
  Activity,
  BarChart3,
  Users,
  ShieldCheck,
  Menu,
  X,
  AudioWaveform,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home Dashboard', icon: LayoutDashboard },
  { id: 'analyze', label: 'Emotion & Audio Lab', icon: Mic },
  { id: 'wellbeing', label: 'Wellbeing Signals', icon: HeartPulse },
  { id: 'features', label: 'Feature Visualizer', icon: Activity },
  { id: 'benchmarks', label: 'Model Benchmarks', icon: BarChart3 },
  { id: 'speaker', label: 'Speaker Evaluation', icon: Users },
  { id: 'about', label: 'About & Ethics', icon: ShieldCheck },
];

export default function Sidebar({ activeTab, setActiveTab, healthStatus, mobileOpen, setMobileOpen }) {
  const isHealthy = healthStatus?.status === 'healthy';

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
            <AudioWaveform className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-100 text-sm tracking-tight">SER & Wellbeing AI</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-900/95 backdrop-blur-md border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
            <AudioWaveform className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-sm leading-tight">Speech Emotion &</h1>
            <p className="text-xs font-medium text-indigo-400">Wellbeing Signal AI</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-400">ML Backend Status</span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                  isHealthy ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isHealthy ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                {isHealthy ? 'Online' : 'Checking'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              SVM • Random Forest • PyTorch CNN
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
