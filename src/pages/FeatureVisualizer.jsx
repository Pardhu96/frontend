import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Activity, ArrowLeft } from 'lucide-react';
import { MatrixCanvas } from '../components/HeatmapMatrix';

export default function FeatureVisualizer({ featureResult, onNavigate }) {
  if (!featureResult) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 text-center space-y-4">
        <Activity className="w-12 h-12 text-indigo-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Acoustic Features Extracted Yet</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Analyze an audio clip in the Emotion & Audio Lab to inspect its time-domain waveform, Mel Spectrogram, MFCCs, Pitch F0, RMS energy, and spectral dynamics.
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

  const { waveform, frame_series, mel_spectrogram, mfcc_matrix, filename } = featureResult;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Acoustic Feature Extraction Visualizer</h2>
        <p className="text-sm text-slate-400 mt-1">
          Signal-level inspection for <span className="text-indigo-300 font-medium">{filename}</span> (16 kHz, normalized 3.0s window)
        </p>
      </div>

      {/* Waveform & RMS Energy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-slate-100">Normalized Audio Waveform (Time Domain)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waveform}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} unit="s" />
                <YAxis domain={[-1, 1]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }}
                />
                <Area type="monotone" dataKey="amplitude" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-slate-100">RMS Energy Contour (Arousal & Loudness)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={frame_series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} unit="s" />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }}
                />
                <Area type="monotone" dataKey="rms" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.25} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Pitch F0 & Spectral Centroid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-slate-100">Fundamental Frequency Pitch (F0 in Hz)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={frame_series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} unit="s" />
                <YAxis domain={[50, 400]} stroke="#64748b" fontSize={11} unit="Hz" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }}
                />
                <Line
                  type="monotone"
                  dataKey="pitch_hz"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-slate-100">Spectral Centroid & 85% Rolloff (Hz)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={frame_series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} unit="s" />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }}
                />
                <Line type="monotone" dataKey="spectral_centroid" name="Centroid" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="spectral_rolloff" name="Rolloff" stroke="#ec4899" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Zero-Crossing Rate */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-slate-100">Zero-Crossing Rate (ZCR — Unvoiced Noise & Consonants)</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={frame_series}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} unit="s" />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }}
              />
              <Area type="monotone" dataKey="zcr" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2D Heatmaps: Mel Spectrogram & MFCCs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100">2D Log Mel Spectrogram (CNN Input Representation)</h3>
            <p className="text-xs text-slate-400">Frequency bands (Mel scale, bottom-to-top) across time frames.</p>
          </div>
          <MatrixCanvas matrix={mel_spectrogram} colorScheme="viridis" height={240} />
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100">MFCCs (Coefficients 1–20 Across Time)</h3>
            <p className="text-xs text-slate-400">Short-time vocal tract spectral envelope coefficients.</p>
          </div>
          <MatrixCanvas matrix={mfcc_matrix} colorScheme="coolwarm" height={240} />
        </div>
      </div>
    </div>
  );
}
