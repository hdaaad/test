import React from 'react';
import { Sliders, Volume2, Shield, RotateCcw, Sparkles, AlertTriangle } from 'lucide-react';
import { ExperimentMeasurements, ReductionRates } from '../types';
import { SAMPLE_EXPERIMENT_PRESETS } from '../utils/calculations';

interface MeasurementFormProps {
  measurements: ExperimentMeasurements;
  reductionRates: ReductionRates;
  onChangeMeasurement: (key: keyof ExperimentMeasurements, value: number | null) => void;
  onReset: () => void;
  onLoadPreset: (presetIndex: number) => void;
  onOpenSensorGuide: () => void;
}

export const MeasurementForm: React.FC<MeasurementFormProps> = ({
  measurements,
  reductionRates,
  onChangeMeasurement,
  onReset,
  onLoadPreset,
  onOpenSensorGuide,
}) => {
  const handleInputChange = (key: keyof ExperimentMeasurements, rawVal: string) => {
    if (rawVal.trim() === '') {
      onChangeMeasurement(key, null);
      return;
    }
    const num = Number(rawVal);
    if (!isNaN(num)) {
      onChangeMeasurement(key, num);
    }
  };

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              2단계. 소리 센서값 측정 및 입력
            </h2>
            <p className="text-xs text-slate-500">
              아날로그 센서 신호값(상대 크기)을 입력합니다. (※ 데시벨 단위 미사용)
            </p>
          </div>
        </div>

        {/* Preset & Reset Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onLoadPreset(0)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            샘플 A조 데이터
          </button>
          <button
            type="button"
            onClick={() => onLoadPreset(1)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            샘플 B조 데이터
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            title="모든 입력 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            초기화
          </button>
        </div>
      </div>

      {/* Grid of 4 Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Baseline: 방음재 없음 */}
        <div className="p-4 rounded-xl border-2 border-slate-300 bg-slate-50/70 hover:border-slate-400 transition-colors relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              대조군 (기준)
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-200 text-slate-700">
              방음재 없음
            </span>
          </div>
          <label htmlFor="input-baseline" className="block text-sm font-bold text-slate-900 mb-1">
            기준 소리 센서값 <span className="text-red-500">*</span>
          </label>
          <p className="text-[11px] text-slate-500 mb-2.5">
            공항 소음 스피커 노출 시 아무것도 덮지 않은 상태의 값
          </p>

          <div className="relative">
            <input
              id="input-baseline"
              type="number"
              min="1"
              max="1023"
              step="any"
              value={measurements.baseline !== null ? measurements.baseline : ''}
              onChange={(e) => handleInputChange('baseline', e.target.value)}
              placeholder="예: 820"
              className="w-full text-base font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium pointer-events-none">
              센서값
            </span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>감소율 기준:</span>
            <span className="font-bold text-slate-700">100.0% (기준)</span>
          </div>
        </div>

        {/* 2. Sponge: 스펀지 */}
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
              실험군 1
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-700">
              다공성 흡음
            </span>
          </div>
          <label htmlFor="input-sponge" className="block text-sm font-bold text-slate-900 mb-1">
            스펀지 측정값 <span className="text-red-500">*</span>
          </label>
          <p className="text-[11px] text-slate-500 mb-2.5">
            스펀지로 소음원을 감쌌을 때의 측정값
          </p>

          <div className="relative">
            <input
              id="input-sponge"
              type="number"
              min="0"
              max="1023"
              step="any"
              value={measurements.sponge !== null ? measurements.sponge : ''}
              onChange={(e) => handleInputChange('sponge', e.target.value)}
              placeholder="예: 430"
              className="w-full text-base font-semibold px-3 py-2 rounded-lg border border-blue-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium pointer-events-none">
              센서값
            </span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-blue-100 text-xs flex items-center justify-between">
            <span className="text-slate-600">감소율:</span>
            <span className="font-bold text-blue-700">
              {reductionRates.sponge !== null ? `${reductionRates.sponge > 0 ? '+' : ''}${reductionRates.sponge}%` : '-'}
            </span>
          </div>
        </div>

        {/* 3. Felt: 펠트 */}
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              실험군 2
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-700">
              섬유 분산
            </span>
          </div>
          <label htmlFor="input-felt" className="block text-sm font-bold text-slate-900 mb-1">
            펠트 측정값 <span className="text-red-500">*</span>
          </label>
          <p className="text-[11px] text-slate-500 mb-2.5">
            펠트로 소음원을 감쌌을 때의 측정값
          </p>

          <div className="relative">
            <input
              id="input-felt"
              type="number"
              min="0"
              max="1023"
              step="any"
              value={measurements.felt !== null ? measurements.felt : ''}
              onChange={(e) => handleInputChange('felt', e.target.value)}
              placeholder="예: 540"
              className="w-full text-base font-semibold px-3 py-2 rounded-lg border border-emerald-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium pointer-events-none">
              센서값
            </span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-emerald-100 text-xs flex items-center justify-between">
            <span className="text-slate-600">감소율:</span>
            <span className="font-bold text-emerald-700">
              {reductionRates.felt !== null ? `${reductionRates.felt > 0 ? '+' : ''}${reductionRates.felt}%` : '-'}
            </span>
          </div>
        </div>

        {/* 4. Corrugated Cardboard: 골판지 */}
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              실험군 3
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
              다층 반사
            </span>
          </div>
          <label htmlFor="input-cardboard" className="block text-sm font-bold text-slate-900 mb-1">
            골판지 측정값 <span className="text-red-500">*</span>
          </label>
          <p className="text-[11px] text-slate-500 mb-2.5">
            골판지로 소음원을 감쌌을 때의 측정값
          </p>

          <div className="relative">
            <input
              id="input-cardboard"
              type="number"
              min="0"
              max="1023"
              step="any"
              value={measurements.cardboard !== null ? measurements.cardboard : ''}
              onChange={(e) => handleInputChange('cardboard', e.target.value)}
              placeholder="예: 640"
              className="w-full text-base font-semibold px-3 py-2 rounded-lg border border-amber-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium pointer-events-none">
              센서값
            </span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-amber-100 text-xs flex items-center justify-between">
            <span className="text-slate-600">감소율:</span>
            <span className="font-bold text-amber-700">
              {reductionRates.cardboard !== null ? `${reductionRates.cardboard > 0 ? '+' : ''}${reductionRates.cardboard}%` : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Code-based calculation formula callout */}
      <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <span className="font-semibold text-slate-800">📐 소리 감소율 계산식:</span>
          <code className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-slate-800 text-[11px] sm:text-xs">
            (기준값 - 방음재 적용값) / 기준값 × 100
          </code>
          <span className="text-emerald-700 font-medium">(웹앱 자체 코드로 실시간 계산됨)</span>
        </div>

        <button
          type="button"
          onClick={onOpenSensorGuide}
          className="text-xs text-purple-700 hover:text-purple-900 font-semibold underline underline-offset-2 shrink-0"
        >
          EZMaker 센서 실시간 수신 연동 준비 확인 &rarr;
        </button>
      </div>
    </section>
  );
};
