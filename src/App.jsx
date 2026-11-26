import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardHome from './pages/DashboardHome';
import LiveAnalyzer from './pages/LiveAnalyzer';
import WellbeingView from './pages/WellbeingView';
import FeatureVisualizer from './pages/FeatureVisualizer';
import ModelBenchmarks from './pages/ModelBenchmarks';
import SpeakerEvalView from './pages/SpeakerEvalView';
import AboutEthical from './pages/AboutEthical';
import { checkHealth, fetchModelsInfo, fetchSpeakerEval } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);

  const [healthStatus, setHealthStatus] = useState(null);
  const [modelsData, setModelsData] = useState(null);
  const [speakerEval, setSpeakerEval] = useState(null);

  const [analysisResult, setAnalysisResult] = useState(null);
  const [featureResult, setFeatureResult] = useState(null);

  useEffect(() => {
    checkHealth()
      .then(setHealthStatus)
      .catch(() => setHealthStatus({ status: 'offline' }));

    fetchModelsInfo()
      .then(setModelsData)
      .catch(() => {});

    fetchSpeakerEval()
      .then(setSpeakerEval)
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        healthStatus={healthStatus}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'home' && (
          <DashboardHome
            modelsData={modelsData}
            speakerEval={speakerEval}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'analyze' && (
          <LiveAnalyzer
            analysisResult={analysisResult}
            setAnalysisResult={setAnalysisResult}
            featureResult={featureResult}
            setFeatureResult={setFeatureResult}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'wellbeing' && (
          <WellbeingView analysisResult={analysisResult} onNavigate={setActiveTab} />
        )}

        {activeTab === 'features' && (
          <FeatureVisualizer featureResult={featureResult} onNavigate={setActiveTab} />
        )}

        {activeTab === 'benchmarks' && <ModelBenchmarks modelsData={modelsData} />}

        {activeTab === 'speaker' && <SpeakerEvalView speakerEval={speakerEval} />}

        {activeTab === 'about' && <AboutEthical />}
      </main>
    </div>
  );
}
