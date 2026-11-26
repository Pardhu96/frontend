import React from 'react';
import { ShieldCheck, Database, Cpu, Lock, AlertTriangle } from 'lucide-react';

export default function AboutEthical() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white">About the Project & Ethical Considerations</h2>
        <p className="text-sm text-slate-400 mt-1">
          Transparent documentation of model provenance, acoustic signal processing, and responsible AI deployment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <Database className="w-4 h-4" />
            <span>Authentic Benchmark Corpus (RAVDESS)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Models are trained on the Ryerson Audio-Visual Database of Emotional Speech and Song (RAVDESS), comprising 1,440
            speech recordings across 24 professional actors (12 male, 12 female) expressing 8 distinct emotional states:
            Neutral, Calm, Happy, Sad, Angry, Fearful, Disgust, and Surprised.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-violet-400 font-bold text-sm">
            <Cpu className="w-4 h-4" />
            <span>Hybrid Classical & Deep Learning Stack</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Combines 128 engineered acoustic statistics (MFCCs + deltas, Pitch F0, RMS energy, ZCR, Spectral descriptors)
            fed into Scikit-Learn SVM & Random Forest pipelines alongside a 4-block PyTorch 2D CNN operating directly on
            128×94 Log Mel Spectrograms.
          </p>
        </div>
      </div>

      {/* Ethical Considerations */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
          <ShieldCheck className="w-5 h-5" />
          <span>Ethical AI & Responsible Deployment Principles</span>
        </div>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 block mb-1">1. Strictly Non-Diagnostic Wellbeing Signals</strong>
              Acoustic indicators such as Vocal Tension, Arousal, Valence Proxy, and Breathiness are derived solely from
              physical waveform properties. They are NOT medical or psychological assessments and must never be used to
              diagnose mental health conditions, stress disorders, or clinical fatigue.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <Lock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-1">2. Ephemeral Audio Processing & Privacy</strong>
              Uploaded and microphone-recorded audio clips are processed strictly in memory during inference and are not
              stored permanently on the server or used for secondary model training.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <strong className="text-white block mb-1">3. Cross-Speaker & Cultural Generalization Limits</strong>
            As demonstrated in our Speaker-Independent GroupKFold evaluation (15.62% accuracy drop on unseen actors),
            acted North American English speech datasets may not generalize uniformly across accents, languages, age
            groups, or spontaneous real-world conversations. Predictions should always be interpreted with uncertainty awareness.
          </div>
        </div>
      </div>
    </div>
  );
}
