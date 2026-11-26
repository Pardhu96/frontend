import React, { useState, useEffect } from 'react';
import {
  Upload,
  Mic,
  Library,
  Loader2,
  AlertCircle,
  CheckCircle2,
  HeartPulse,
  Activity,
  Sparkles,
} from 'lucide-react';
import AudioRecorder from '../components/AudioRecorder';
import ProbabilityChart from '../components/ProbabilityChart';
import {
  fetchSamples,
  getSampleAudioUrl,
  predictAudio,
  extractFeatures,
  EMOTION_COLORS,
  EMOTION_EMOJIS,
} from '../services/api';

export default function LiveAnalyzer({
  analysisResult,
  setAnalysisResult,
  featureResult,
  setFeatureResult,
  onNavigate,
}) {
  const [inputMode, setInputMode] = useState('sample'); // 'sample' | 'upload' | 'mic'
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [activeModel, setActiveModel] = useState('ensemble'); // 'ensemble' | 'svm' | 'random_forest' | 'cnn'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSamples()
      .then((list) => {
        setSamples(list);
        if (list.length > 0) {
          setSelectedSample(list[0].filename);
          setAudioUrl(getSampleAudioUrl(list[0].filename));
        }
      })
      .catch(() => {});
  }, []);

  const handleSampleChange = (filename) => {
    setSelectedSample(filename);
    setSelectedFile(null);
    setAudioUrl(getSampleAudioUrl(filename));
    setError(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setAudioUrl(URL.createObjectURL(file));
    setError(null);
  };

  const handleMicComplete = (wavFile, blobUrl) => {
    setSelectedFile(wavFile);
    setAudioUrl(blobUrl);
    setError(null);
    runAnalysis({ file: wavFile });
  };

  const runAnalysis = async (overridePayload = null) => {
    setLoading(true);
    setError(null);

    try {
      const payload = overridePayload
        ? overridePayload
        : inputMode === 'sample'
        ? { sampleName: selectedSample }
        : { file: selectedFile };

      if (!payload.file && !payload.sampleName) {
        setError('Please select a sample audio clip, upload a file, or record via microphone.');
        setLoading(false);
        return;
      }

      const [predRes, featRes] = await Promise.all([
        predictAudio(payload),
        extractFeatures(payload),
      ]);

      setAnalysisResult(predRes);
      setFeatureResult(featRes);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        'Failed to analyze audio. Ensure FastAPI backend is running.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const activePred = analysisResult?.predictions?.[activeModel];
  const predictedEmotion = activePred?.predicted_emotion;
  const emoColor = EMOTION_COLORS[predictedEmotion] || '#6366f1';
  const emoEmoji = EMOTION_EMOJIS[predictedEmotion] || '🎭';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Emotion & Audio Analysis Lab</h2>
        <p className="text-sm text-slate-400 mt-1">
          Upload an audio clip, record live from your microphone, or choose an authentic RAVDESS sample.
        </p>
      </div>

      {/* Input Mode Selector */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-5">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'sample', label: 'Preset RAVDESS Samples', icon: Library },
            { id: 'upload', label: 'Upload Audio File', icon: Upload },
            { id: 'mic', label: 'Live Microphone', icon: Mic },
          ].map((mode) => {
            const Icon = mode.icon;
            const active = inputMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setInputMode(mode.id);
                  setError(null);
                  if (mode.id === 'sample' && selectedSample) {
                    setAudioUrl(getSampleAudioUrl(selectedSample));
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mode Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center">
          <div>
            {inputMode === 'sample' && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Select Authentic Benchmark Sample
                </label>
                <select
                  value={selectedSample}
                  onChange={(e) => handleSampleChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                >
                  {samples.map((s) => (
                    <option key={s.filename} value={s.filename}>
                      {s.emotion.toUpperCase()} — {s.gender} ({s.actor}) [{s.size_kb} KB]
                    </option>
                  ))}
                </select>
              </div>
            )}

            {inputMode === 'upload' && (
              <label className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-950/60 cursor-pointer transition-colors">
                <Upload className="w-7 h-7 text-indigo-400 mb-2" />
                <span className="text-sm font-medium text-slate-200">
                  {selectedFile ? selectedFile.name : 'Click to upload WAV, MP3, FLAC, or OGG'}
                </span>
                <span className="text-xs text-slate-500 mt-1">Max size: 25 MB • Resampled to 16 kHz</span>
                <input
                  type="file"
                  accept=".wav,.mp3,.flac,.ogg,.m4a"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}

            {inputMode === 'mic' && <AudioRecorder onRecordingComplete={handleMicComplete} />}
          </div>

          {/* Audio Player & Run Button */}
          <div className="space-y-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Audio Playback & Controls
            </div>
            {audioUrl ? (
              <audio controls src={audioUrl} className="w-full h-10" />
            ) : (
              <p className="text-xs text-slate-500">No audio selected yet.</p>
            )}

            {inputMode !== 'mic' && (
              <button
                onClick={() => runAnalysis()}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Running ML Inference & Feature Extraction...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Emotion & Wellbeing Signals</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2.5 text-rose-300 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results Section */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Preprocessing Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs text-slate-400">Sample Rate</span>
              <div className="text-base font-bold text-white mt-0.5">
                {analysisResult.preprocessing.sample_rate} Hz
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs text-slate-400">Original Duration</span>
              <div className="text-base font-bold text-white mt-0.5">
                {analysisResult.preprocessing.original_duration_sec} s
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs text-slate-400">Silence Trimmed</span>
              <div className="text-base font-bold text-white mt-0.5">
                {analysisResult.preprocessing.trimmed_start_sec}s – {analysisResult.preprocessing.trimmed_end_sec}s
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs text-slate-400">Normalized RMS</span>
              <div className="text-base font-bold text-white mt-0.5">
                {analysisResult.preprocessing.rms_energy.toFixed(4)}
              </div>
            </div>
          </div>

          {/* Model Selector + Prediction Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Active Classifier View
                  </label>
                  <select
                    value={activeModel}
                    onChange={(e) => setActiveModel(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm"
                  >
                    <option value="ensemble">Ensemble (SVM + RF + CNN)</option>
                    <option value="svm">Support Vector Machine (SVM)</option>
                    <option value="random_forest">Random Forest Classifier</option>
                    <option value="cnn">PyTorch 2D Mel-Spectrogram CNN</option>
                  </select>
                </div>

                <div
                  style={{ borderColor: emoColor, backgroundColor: `${emoColor}15` }}
                  className="p-5 rounded-xl border-l-4 space-y-1"
                >
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Predicted Emotion
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{emoEmoji}</span>
                    <div>
                      <div style={{ color: emoColor }} className="text-2xl font-extrabold uppercase">
                        {predictedEmotion}
                      </div>
                      <div className="text-sm font-semibold text-slate-200">
                        Confidence: {(activePred.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cross-Model Consensus Table */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Multi-Model Consensus
                  </h4>
                  <div className="space-y-1.5">
                    {[
                      { key: 'svm', label: 'SVM (RBF)' },
                      { key: 'random_forest', label: 'Random Forest' },
                      { key: 'cnn', label: 'PyTorch CNN' },
                    ].map((m) => {
                      const p = analysisResult.predictions[m.key];
                      return (
                        <div
                          key={m.key}
                          className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-950/70 border border-slate-800 text-xs"
                        >
                          <span className="text-slate-300 font-medium">{m.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="capitalize font-bold text-white">
                              {EMOTION_EMOJIS[p.predicted_emotion]} {p.predicted_emotion}
                            </span>
                            <span className="text-slate-400">({(p.confidence * 100).toFixed(1)}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Probability Chart */}
            <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Emotion Probability Distribution</h3>
                <p className="text-xs text-slate-400 mb-3">
                  Calibrated class probabilities across all 8 RAVDESS emotional categories.
                </p>
                <ProbabilityChart probabilities={activePred.probabilities} />
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('wellbeing')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all"
                >
                  <HeartPulse className="w-4 h-4" />
                  <span>Inspect Wellbeing Signals</span>
                </button>
                <button
                  onClick={() => onNavigate('features')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-all"
                >
                  <Activity className="w-4 h-4" />
                  <span>Explore Waveform & Spectrogram</span>
                </button>
                <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Real Inference Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
