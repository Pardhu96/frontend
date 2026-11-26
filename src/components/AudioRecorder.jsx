import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Radio } from 'lucide-react';

/**
 * Pure-browser WAV audio recorder using Web Audio API.
 * Encodes 16-bit PCM WAV directly so Python soundfile/librosa decodes it natively without ffmpeg.
 */
function encodeWAV(samples, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([view], { type: 'audio/wav' });
}

export default function AudioRecorder({ onRecordingComplete }) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState(null);

  const streamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const processorRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      stopCleanup();
    };
  }, []);

  const stopCleanup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    setError(null);
    chunksRef.current = [];
    setSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        chunksRef.current.push(new Float32Array(input));
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);

      setRecording(true);
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } catch (err) {
      setError('Microphone access denied or unavailable. Please check browser permissions.');
    }
  };

  const stopRecording = () => {
    if (!recording) return;
    setRecording(false);

    const sampleRate = audioCtxRef.current?.sampleRate || 44100;
    const totalLength = chunksRef.current.reduce((acc, arr) => acc + arr.length, 0);
    const merged = new Float32Array(totalLength);
    let offset = 0;
    for (const chunk of chunksRef.current) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }

    stopCleanup();

    if (merged.length < sampleRate * 0.25) {
      setError('Recording too short. Please speak for at least 0.5 seconds.');
      return;
    }

    const wavBlob = encodeWAV(merged, sampleRate);
    const wavFile = new File([wavBlob], `mic_recording_${Date.now()}.wav`, { type: 'audio/wav' });
    onRecordingComplete(wavFile, URL.createObjectURL(wavBlob));
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col items-center justify-center gap-3">
      {!recording ? (
        <button
          type="button"
          onClick={startRecording}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm shadow-lg shadow-rose-500/20 transition-all"
        >
          <Mic className="w-4 h-4" />
          <span>Start Microphone Recording</span>
        </button>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-sm font-semibold">
            <Radio className="w-4 h-4 animate-ping" />
            <span>Recording: {formatTime(seconds)}</span>
          </div>
          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-rose-500/50 text-rose-300 font-semibold text-sm transition-all"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>Stop & Analyze</span>
          </button>
        </div>
      )}

      {error && <p className="text-xs text-rose-400 text-center">{error}</p>}
      <p className="text-xs text-slate-500 text-center">
        Records 16-bit PCM WAV directly in your browser. Recommended duration: 2–5 seconds.
      </p>
    </div>
  );
}
