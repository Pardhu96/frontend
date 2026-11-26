import React from 'react';
import {
  AudioWaveform,
  Cpu,
  HeartPulse,
  ShieldAlert,
  ArrowRight,
  Mic,
  BarChart3,
  Layers,
} from 'lucide-react';

export default function DashboardHome({ modelsData, speakerEval, onNavigate }) {
  const metrics = modelsData?.metrics;
  const svmAcc = metrics?.SVM?.accuracy ? `${(metrics.SVM.accuracy * 100).toFixed(1)}%` : '—';
  const cnnAcc = metrics?.CNN?.accuracy ? `${(metrics.CNN.accuracy * 100).toFixed(1)}%` : '—';
  const rfAcc = metrics?.['Random Forest']?.accuracy
    ? `${(metrics['Random Forest'].accuracy * 100).toFixed(1)}%`
    : '—';
  const spkAcc = speakerEval?.speaker_independent?.svm_accuracy_mean
    ? `${(speakerEval.speaker_independent.svm_accuracy_mean * 100).toFixed(1)}%`
    : '—';

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <AudioWaveform className="w-3.5 h-3.5" />
            <span>Full-Stack AI Audio Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Speech Emotion & Wellbeing Signal Recognition System
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Analyze vocal acoustics using Support Vector Machines, Random Forests, and a PyTorch 2D Mel-Spectrogram CNN.
            Extract MFCCs, Pitch F0, RMS Energy, ZCR, Spectral Descriptors, and non-diagnostic vocal wellbeing indicators in real time.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('analyze')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all"
            >
              <Mic className="w-4 h-4" />
              <span>Analyze Audio Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('benchmarks')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all"
            >
              <BarChart3 className="w-4 h-4" />
              <span>View Real Benchmarks</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Genuine Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>SVM (RBF Kernel) Test Accuracy</span>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{svmAcc}</div>
          <p className="text-xs text-slate-500 mt-1">128 Acoustic Features (288 Test Samples)</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-violet-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>PyTorch 2D CNN Test Accuracy</span>
            <Layers className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold text-white">{cnnAcc}</div>
          <p className="text-xs text-slate-500 mt-1">128×94 Log Mel Spectrogram Input</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Random Forest Test Accuracy</span>
            <BarChart3 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{rfAcc}</div>
          <p className="text-xs text-slate-500 mt-1">150 Balanced Decision Trees</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Speaker-Independent (GroupKFold)</span>
            <HeartPulse className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{spkAcc}</div>
          <p className="text-xs text-slate-500 mt-1">5-Fold Cross-Actor Generalization</p>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-slate-100">End-to-End Inference Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'Audio Validation & Prep',
              desc: '16 kHz mono resampling, 25 dB silence trimming, peak normalization, and 3.0s windowing.',
            },
            {
              step: '02',
              title: 'Acoustic Feature Lab',
              desc: 'Extracts 20 MFCCs (+Δ, Δ²), Yin F0 Pitch, RMS Energy, ZCR, and Spectral Descriptors.',
            },
            {
              step: '03',
              title: 'Multi-Model Inference',
              desc: 'Runs SVM, Random Forest, and PyTorch 2D CNN in parallel to compute Ensemble confidence.',
            },
            {
              step: '04',
              title: 'Wellbeing Indicators',
              desc: 'Derives vocal stress, arousal, valence, and fatigue proxies with uncertainty bounds.',
            },
          ].map((item) => (
            <div key={item.step} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-xs font-bold text-indigo-400">STEP {item.step}</span>
              <h3 className="text-sm font-semibold text-slate-100 mt-1">{item.title}</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ethical Notice */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-200/90 leading-relaxed">
          <strong>Research & Educational Notice:</strong> All model accuracy metrics, confusion matrices, and speaker-independent
          results displayed in this application are genuinely computed on the RAVDESS corpus (24 professional actors, 1,440 speech clips).
          Acoustic wellbeing signals are experimental physical indicators and are not clinical diagnoses.
        </p>
      </div>
    </div>
  );
}
