import React, { useState } from 'react';
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
import { BarChart3 } from 'lucide-react';
import { ConfusionMatrixHeatmap } from '../components/HeatmapMatrix';

export default function ModelBenchmarks({ modelsData }) {
  const metrics = modelsData?.metrics;
  const modelNames = metrics ? Object.keys(metrics) : [];
  const [selectedModel, setSelectedModel] = useState(modelNames[0] || 'SVM');
  const [normalized, setNormalized] = useState(true);

  if (!metrics) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 text-center">
        <BarChart3 className="w-10 h-10 text-slate-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white">Evaluation Metrics Not Available</h2>
        <p className="text-sm text-slate-400 mt-1">
          Ensure `models/metrics.json` is present on the backend.
        </p>
      </div>
    );
  }

  const activeMetric = metrics[selectedModel] || metrics[modelNames[0]];

  // Format grouped bar chart data
  const chartMetrics = [
    { key: 'accuracy', label: 'Accuracy' },
    { key: 'f1_macro', label: 'Macro F1' },
    { key: 'f1_weighted', label: 'Weighted F1' },
    { key: 'precision_macro', label: 'Precision' },
    { key: 'recall_macro', label: 'Recall' },
  ];

  const barData = chartMetrics.map((m) => {
    const row = { metric: m.label };
    modelNames.forEach((model) => {
      row[model] = Number((metrics[model][m.key] * 100).toFixed(2));
    });
    return row;
  });

  const classes = activeMetric.class_names || [];
  const clfReport = activeMetric.classification_report || {};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Model Performance & Real Test Benchmarks</h2>
        <p className="text-sm text-slate-400 mt-1">
          All metrics are genuinely evaluated on the 20% RAVDESS hold-out test set (288 samples across 8 emotions).
        </p>
      </div>

      {/* Summary Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3.5">Model</th>
                <th className="px-5 py-3.5">Accuracy</th>
                <th className="px-5 py-3.5">Macro F1</th>
                <th className="px-5 py-3.5">Weighted F1</th>
                <th className="px-5 py-3.5">Precision (Macro)</th>
                <th className="px-5 py-3.5">Recall (Macro)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {modelNames.map((name) => {
                const m = metrics[name];
                return (
                  <tr key={name} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-white">{name}</td>
                    <td className="px-5 py-3.5 text-indigo-300 font-semibold">{(m.accuracy * 100).toFixed(2)}%</td>
                    <td className="px-5 py-3.5 text-slate-200">{(m.f1_macro * 100).toFixed(2)}%</td>
                    <td className="px-5 py-3.5 text-slate-200">{(m.f1_weighted * 100).toFixed(2)}%</td>
                    <td className="px-5 py-3.5 text-slate-200">{(m.precision_macro * 100).toFixed(2)}%</td>
                    <td className="px-5 py-3.5 text-slate-200">{(m.recall_macro * 100).toFixed(2)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grouped Bar Chart */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h3 className="text-base font-bold text-white">Multi-Metric Comparative Analysis (%)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="metric" stroke="#94a3b8" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                formatter={(val) => `${val}%`}
              />
              <Legend />
              <Bar dataKey="SVM" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Random Forest" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="CNN" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Confusion Matrix & Per-Class Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-bold text-white">Confusion Matrix</h3>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100"
              >
                {modelNames.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setNormalized(!normalized)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700"
              >
                {normalized ? 'Showing: Normalized (%)' : 'Showing: Raw Counts'}
              </button>
            </div>
          </div>

          <ConfusionMatrixHeatmap
            matrix={normalized ? activeMetric.confusion_matrix_norm : activeMetric.confusion_matrix}
            classes={classes}
            normalized={normalized}
          />
        </div>

        {/* Per-class Precision / Recall / F1 */}
        <div className="xl:col-span-5 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white">Per-Class Report ({selectedModel})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 pr-2">Emotion</th>
                  <th className="py-2 px-2">Prec</th>
                  <th className="py-2 px-2">Recall</th>
                  <th className="py-2 px-2">F1</th>
                  <th className="py-2 pl-2 text-right">Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {classes.map((cls) => {
                  const r = clfReport[cls];
                  if (!r) return null;
                  return (
                    <tr key={cls}>
                      <td className="py-2 pr-2 font-semibold text-slate-200 capitalize">{cls}</td>
                      <td className="py-2 px-2 text-slate-300">{(r.precision * 100).toFixed(1)}%</td>
                      <td className="py-2 px-2 text-slate-300">{(r.recall * 100).toFixed(1)}%</td>
                      <td className="py-2 px-2 font-semibold text-indigo-300">{(r['f1-score'] * 100).toFixed(1)}%</td>
                      <td className="py-2 pl-2 text-right text-slate-400">{r.support}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
