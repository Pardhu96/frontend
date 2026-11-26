import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Users, TrendingDown } from 'lucide-react';

export default function SpeakerEvalView({ speakerEval }) {
  if (!speakerEval) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 text-center">
        <Users className="w-10 h-10 text-slate-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white">Speaker Evaluation Data Missing</h2>
        <p className="text-sm text-slate-400 mt-1">
          Ensure `models/speaker_eval_results.json` is available on the backend.
        </p>
      </div>
    );
  }

  const sd = speakerEval.speaker_dependent;
  const si = speakerEval.speaker_independent;
  const gap = speakerEval.generalization_gap;

  const compareChartData = [
    {
      strategy: 'Speaker-Dependent (Random Split)',
      SVM: Number((sd.svm_accuracy * 100).toFixed(2)),
      'Random Forest': Number((sd.rf_accuracy * 100).toFixed(2)),
    },
    {
      strategy: 'Speaker-Independent (GroupKFold)',
      SVM: Number((si.svm_accuracy_mean * 100).toFixed(2)),
      'Random Forest': Number((si.rf_accuracy_mean * 100).toFixed(2)),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Speaker-Independent Evaluation</h2>
        <p className="text-sm text-slate-400 mt-1">
          Quantifying real-world generalization when models are tested on strictly unseen speakers (5-Fold GroupKFold by Actor ID).
        </p>
      </div>

      {/* Gap Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Speaker-Dependent SVM</div>
          <div className="text-2xl font-bold text-white mt-1">{(sd.svm_accuracy * 100).toFixed(2)}%</div>
          <p className="text-xs text-slate-500 mt-1">Same 24 speakers shared across train & test</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Speaker-Independent SVM</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {(si.svm_accuracy_mean * 100).toFixed(2)}%{' '}
            <span className="text-sm font-normal text-slate-400">(±{(si.svm_accuracy_std * 100).toFixed(2)}%)</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Strictly unseen actors held out per fold</p>
        </div>

        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/25">
          <div className="flex items-center justify-between text-xs text-rose-300 font-medium">
            <span>Generalization Gap</span>
            <TrendingDown className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-rose-400 mt-1">-{gap.svm_gap_percentage}%</div>
          <p className="text-xs text-rose-200/70 mt-1">RF Drop: -{gap.rf_gap_percentage}%</p>
        </div>
      </div>

      {/* Explanation */}
      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-xs text-indigo-200 leading-relaxed">
        <strong>Scientific Insight:</strong> {gap.analysis}
      </div>

      {/* Chart */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h3 className="text-base font-bold text-white">Speaker-Dependent vs Speaker-Independent Accuracy (%)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={compareChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="strategy" stroke="#94a3b8" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                formatter={(val) => `${val}%`}
              />
              <Legend />
              <Bar dataKey="SVM" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={50} />
              <Bar dataKey="Random Forest" fill="#10b981" radius={[6, 6, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fold Breakdown Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">5-Fold GroupKFold Actor Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-950/70 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase">
                <th className="px-5 py-3">Fold</th>
                <th className="px-5 py-3">Held-Out Actor IDs</th>
                <th className="px-5 py-3">Test Samples</th>
                <th className="px-5 py-3">SVM Accuracy</th>
                <th className="px-5 py-3">SVM Macro F1</th>
                <th className="px-5 py-3">RF Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {si.fold_details.map((f) => (
                <tr key={f.fold} className="hover:bg-slate-800/30">
                  <td className="px-5 py-3 font-bold text-white">Fold {f.fold}</td>
                  <td className="px-5 py-3 text-slate-300 font-mono text-xs">
                    Actors [{f.test_actors.join(', ')}]
                  </td>
                  <td className="px-5 py-3 text-slate-300">{f.num_test_samples}</td>
                  <td className="px-5 py-3 text-indigo-300 font-semibold">{(f.svm_accuracy * 100).toFixed(1)}%</td>
                  <td className="px-5 py-3 text-slate-300">{(f.svm_f1 * 100).toFixed(1)}%</td>
                  <td className="px-5 py-3 text-emerald-300 font-semibold">{(f.rf_accuracy * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
