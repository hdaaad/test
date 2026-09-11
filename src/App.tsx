import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { AirportContextModal } from './components/AirportContextModal';
import { HackathonSensorPrepModal } from './components/HackathonSensorPrepModal';
import { HypothesisSection } from './components/HypothesisSection';
import { MeasurementForm } from './components/MeasurementForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { AiCoachSection } from './components/AiCoachSection';
import { ExperimentMeasurements, AiCoachingFeedback } from './types';
import {
  calculateAllReductionRates,
  validateExperimentInput,
  SAMPLE_EXPERIMENT_PRESETS,
} from './utils/calculations';
import { Plane, Cpu, Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  // Modal visibility states
  const [isContextOpen, setIsContextOpen] = useState<boolean>(false);
  const [isSensorGuideOpen, setIsSensorGuideOpen] = useState<boolean>(false);

  // Experiment state
  const [studentName, setStudentName] = useState<string>('제주 과학 1조');
  const [hypothesis, setHypothesis] = useState<string>(
    '스펀지는 내부에 무수한 공기구멍(다공성)이 있어 소리 에너지를 많이 흡수하므로, 기준값 대비 소리 센서값 감소율이 가장 높을 것이다.'
  );

  const [measurements, setMeasurements] = useState<ExperimentMeasurements>({
    baseline: 820,
    sponge: 430,
    felt: 540,
    cardboard: 640,
  });

  // AI Coaching states
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiFeedback, setAiFeedback] = useState<AiCoachingFeedback | null>(null);

  // Real-time calculation of reduction rates in pure client code (never delegated to Gemini)
  const reductionRates = useMemo(() => {
    return calculateAllReductionRates(measurements);
  }, [measurements]);

  // Validation
  const validation = useMemo(() => {
    return validateExperimentInput(hypothesis, measurements);
  }, [hypothesis, measurements]);

  // Handlers
  const handleMeasurementChange = (key: keyof ExperimentMeasurements, value: number | null) => {
    setMeasurements((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setMeasurements({
      baseline: null,
      sponge: null,
      felt: null,
      cardboard: null,
    });
    setAiFeedback(null);
    setAiError(null);
  };

  const handleLoadPreset = (index: number) => {
    const preset = SAMPLE_EXPERIMENT_PRESETS[index];
    if (!preset) return;
    setHypothesis(preset.hypothesis);
    setMeasurements({ ...preset.measurements });
    setAiFeedback(null);
    setAiError(null);
  };

  const handleSimulatedSensorApply = (
    target: 'baseline' | 'sponge' | 'felt' | 'cardboard',
    value: number
  ) => {
    setMeasurements((prev) => ({
      ...prev,
      [target]: value,
    }));
  };

  const handleAskAiCoach = async () => {
    if (!validation.isValid) {
      setAiError(validation.error);
      return;
    }

    setIsLoadingAi(true);
    setAiError(null);

    try {
      const payload = {
        studentName: studentName.trim() || '학생 연구원',
        hypothesis: hypothesis.trim(),
        baseline: measurements.baseline!,
        measurements: [
          {
            material: '스펀지 (다공성)',
            value: measurements.sponge!,
            reductionRate: reductionRates.sponge || 0,
          },
          {
            material: '펠트 (섬유 분산)',
            value: measurements.felt!,
            reductionRate: reductionRates.felt || 0,
          },
          {
            material: '골판지 (다층 반사)',
            value: measurements.cardboard!,
            reductionRate: reductionRates.cardboard || 0,
          },
        ],
      };

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'AI 피드백 요청에 실패했습니다.');
      }

      setAiFeedback(data.feedback);
    } catch (err: any) {
      console.error('AI Coaching Request Error:', err);
      setAiError(err?.message || 'AI 탐구 코치와 통신하는 중 문제가 발생했습니다.');
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col antialiased">
      {/* Top Navigation / Header */}
      <Header
        onOpenContext={() => setIsContextOpen(true)}
        onOpenSensorGuide={() => setIsSensorGuideOpen(true)}
      />

      {/* Main Interactive Lab Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Lab Introduction & Hackathon Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-2xl p-5 sm:p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white backdrop-blur-xs">
                과학실험 해커톤 전용
              </span>
              <span className="text-xs text-blue-100 font-medium">
                오늘: 수동 입력 테스트 &bull; 내일: EZMaker 센서 실시간 연동
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              제주공항 인근 항공기 소음 문제 해결을 위한 방음재 비교 탐구
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              다공성 스펀지, 섬유질 펠트, 공기층 골판지의 소리 센서값을 측정하고 상대적 소리 감소율을 계산하여,
              Gemini AI 탐구 코치와 함께 과학적 결론과 통제변인을 분석해보세요.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsSensorGuideOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Cpu className="w-4 h-4 text-purple-200" />
              센서 연동 구조
            </button>
            <button
              type="button"
              onClick={() => setIsContextOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              탐구 가이드
            </button>
          </div>
        </div>

        {/* 1단계: 학생 가설 설정 */}
        <HypothesisSection
          studentName={studentName}
          setStudentName={setStudentName}
          hypothesis={hypothesis}
          setHypothesis={setHypothesis}
          onSelectSampleHypothesis={(h) => setHypothesis(h)}
        />

        {/* 2단계: 소리 센서값 측정 및 입력 */}
        <MeasurementForm
          measurements={measurements}
          reductionRates={reductionRates}
          onChangeMeasurement={handleMeasurementChange}
          onReset={handleReset}
          onLoadPreset={handleLoadPreset}
          onOpenSensorGuide={() => setIsSensorGuideOpen(true)}
        />

        {/* 3단계: 측정 결과 표 및 막대그래프 */}
        <ResultsDisplay measurements={measurements} reductionRates={reductionRates} />

        {/* 4단계: Gemini AI 탐구 코칭 */}
        <AiCoachSection
          isLoading={isLoadingAi}
          error={aiError}
          feedback={aiFeedback}
          onAskCoach={handleAskAiCoach}
          canAsk={validation.isValid}
          validationError={validation.error}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-700">
            제주공항 항공기 소음 탐구 실험실 &bull; 피지컬 컴퓨팅 과학실험 해커톤
          </p>
          <p className="text-[11px] text-slate-400">
            ※ 본 프로그램은 아날로그 소리센서의 상대적 신호값(소리 센서값)을 사용하며 절대 소음 데시벨(dB) 단위를 표기하지 않습니다.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AirportContextModal
        isOpen={isContextOpen}
        onClose={() => setIsContextOpen(false)}
      />

      <HackathonSensorPrepModal
        isOpen={isSensorGuideOpen}
        onClose={() => setIsSensorGuideOpen(false)}
        onSimulatedReadingApply={handleSimulatedSensorApply}
      />
    </div>
  );
}
