import React from 'react';
import { HeartPulse, AlertTriangle, Info, ArrowLeft, Activity } from 'lucide-react';

export default function WellbeingView({ analysisResult, onNavigate }) {
  const wellbeing = analysisResult?.wellbeing;

  if (!wellbeing) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 text-center space-y-4">
        <HeartPulse className="w-12 h-12 text-indigo-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Audio Analyzed Yet</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Please upload, record, or select an audio clip in the Emotion & Audio Lab to compute real-time acoustic wellbeing indicators.
        </p>
        <button
          onClick={() => onNavigate('analyze')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go to Emotion & Audio Lab</span>
        </button>
      </div>
    );
  }

  const getBarColor = (id, score) => {
    if (id === 'valence') {
      return score >= 60 ? 'bg-emerald-500' : score >= 40 ? 'bg-slate-400' : 'bg-blue-500';
    }
    return score >= 65 ? 'bg-rose-500' : score >= 35 ? 'bg-amber-500' : 'bg-emerald-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Acoustic Wellbeing Signal Intelligence</h2>
          <p className="text-sm text-slate-400 mt-1">
            Derived strictly from measured physical vocal parameters for{' '}
            <span className="text-indigo-300 font-medium">{analysisResult.filename}</span>
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200">
          Confidence: <span className="text-indigo-400">{wellbeing.uncertainty.confidence_level}</span>
        </div>
      </div>

      {/* Non-Diagnostic Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            Important Medical & Psychological Disclaimer
          </div>
          <p className="text-xs text-amber-200/90 leading-relaxed">{wellbeing.disclaimer}</p>
        </div>
      </div>

      {/* 4 Wellbeing Signal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {wellbeing.signals.map((sig) => (
          <div
            key={sig.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{sig.name}</h3>
                <span className="text-xs font-semibold text-indigo-400">{sig.level}</span>
              </div>
              <div className="text-2xl font-extrabold text-white">{sig.score}/100</div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(sig.id, sig.score)}`}
                style={{ width: `${sig.score}%` }}
              />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{sig.explanation}</p>

            {/* Measured Physical Metrics */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-3">
              {Object.entries(sig.measured_metrics).map(([k, v]) => (
                <div key={k} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                  <span className="text-slate-500">{k}: </span>
                  <span className="text-slate-200 font-mono font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Uncertainty Warnings */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
          <Info className="w-4 h-4 text-indigo-400" />
          <span>Signal Reliability & Uncertainty Notes</span>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
          {wellbeing.uncertainty.warnings.map((w, idx) => (
            <li key={idx}>{w}</li>
          ))}
        </ul>
      </div>

      {/* Scalar Acoustic Summary */}
      {analysisResult.acoustic_summary && (
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Raw Measured Acoustic Parameters</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(analysisResult.acoustic_summary).map(([key, val]) => (
              <div key={key} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-500 truncate" title={key}>
                  {key}
                </div>
                <div className="text-sm font-bold text-slate-100 font-mono mt-0.5">{val}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
