import React, { useState } from 'react';
import { BarChart3, Table, ArrowDown, Award, CheckCircle2 } from 'lucide-react';
import { ExperimentMeasurements, ReductionRates } from '../types';

interface ResultsDisplayProps {
  measurements: ExperimentMeasurements;
  reductionRates: ReductionRates;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ measurements, reductionRates }) => {
  const [chartMetric, setChartMetric] = useState<'sensorValue' | 'reductionRate'>('sensorValue');

  const { baseline, sponge, felt, cardboard } = measurements;
  const isBaselineSet = baseline !== null && baseline > 0;

  // Prepare structured items
  const items = [
    {
      id: 'baseline',
      name: '방음재 없음 (기준)',
      role: '대조군',
      value: baseline,
      reduction: 0,
      reductionRate: 0,
      color: '#64748b', // slate-500
      bgClass: 'bg-slate-100 text-slate-800 border-slate-300',
    },
    {
      id: 'sponge',
      name: '스펀지 (다공성)',
      role: '실험군 1',
      value: sponge,
      reduction: isBaselineSet && sponge !== null ? baseline - sponge : null,
      reductionRate: reductionRates.sponge,
      color: '#3b82f6', // blue-500
      bgClass: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      id: 'felt',
      name: '펠트 (섬유 분산)',
      role: '실험군 2',
      value: felt,
      reduction: isBaselineSet && felt !== null ? baseline - felt : null,
      reductionRate: reductionRates.felt,
      color: '#10b981', // emerald-500
      bgClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      id: 'cardboard',
      name: '골판지 (다층 반사)',
      role: '실험군 3',
      value: cardboard,
      reduction: isBaselineSet && cardboard !== null ? baseline - cardboard : null,
      reductionRate: reductionRates.cardboard,
      color: '#f59e0b', // amber-500
      bgClass: 'bg-amber-50 text-amber-800 border-amber-200',
    },
  ];

  // Calculate ranks for materials
  const experimentalItems = items.filter((item) => item.id !== 'baseline');
  const validMaterials = experimentalItems.filter((m) => m.reductionRate !== null) as {
    id: string;
    name: string;
    role: string;
    value: number;
    reduction: number;
    reductionRate: number;
    color: string;
  }[];

  const sortedByReduction = [...validMaterials].sort((a, b) => b.reductionRate - a.reductionRate);

  const getRank = (id: string) => {
    const idx = sortedByReduction.findIndex((m) => m.id === id);
    if (idx === -1) return '-';
    return `${idx + 1}위`;
  };

  // Find max value for bar chart scaling
  const maxSensorValue = Math.max(
    ...(items.map((i) => i.value || 0).concat([100]))
  );

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              3단계. 측정 결과 비교 (표 및 막대그래프)
            </h2>
            <p className="text-xs text-slate-500">
              측정된 소리 센서값과 자체 계산된 감소율을 비교 분석합니다.
            </p>
          </div>
        </div>

        {/* Chart View Toggle */}
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartMetric('sensorValue')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              chartMetric === 'sensorValue'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            소리 센서값 비교 (낮을수록 우수)
          </button>
          <button
            type="button"
            onClick={() => setChartMetric('reductionRate')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              chartMetric === 'reductionRate'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            소리 감소율(%) 비교 (높을수록 우수)
          </button>
        </div>
      </div>

      {/* Quick Stat Summary Cards */}
      {isBaselineSet && sortedByReduction.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">대조군 기준 센서값</div>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">
              {baseline} <span className="text-xs font-normal text-slate-500">(상대 크기)</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
            <div className="text-xs text-blue-700 font-medium flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              가장 높은 소리 감소율
            </div>
            <div className="text-xl font-extrabold text-blue-900 mt-0.5">
              {sortedByReduction[0].name.split(' ')[0]} : {sortedByReduction[0].reductionRate}% 감소
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="text-xs text-emerald-700 font-medium flex items-center gap-1">
              <ArrowDown className="w-3.5 h-3.5 text-emerald-600" />
              가장 낮은 소리 센서값
            </div>
            <div className="text-xl font-extrabold text-emerald-900 mt-0.5">
              {sortedByReduction[0].value} <span className="text-xs font-normal text-emerald-700">({baseline - sortedByReduction[0].value} 감소)</span>
            </div>
          </div>
        </div>
      )}

      {/* Visual Bar Chart */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-600" />
            {chartMetric === 'sensorValue' ? '방음재별 소리 센서값 막대그래프' : '방음재별 소리 감소율(%) 막대그래프'}
          </h3>
          <span className="text-[11px] text-slate-500">
            {chartMetric === 'sensorValue' ? '막대가 짧을수록 소음 차단 효과가 큼' : '막대가 길수록 감소율이 높음'}
          </span>
        </div>

        {/* Responsive Bars */}
        <div className="space-y-3.5">
          {items.map((item) => {
            const hasVal = item.value !== null;
            let barPercentage = 0;
            let displayLabel = '';

            if (chartMetric === 'sensorValue') {
              barPercentage = hasVal && maxSensorValue > 0 ? (item.value! / maxSensorValue) * 100 : 0;
              displayLabel = hasVal ? `${item.value} (센서값)` : '미입력';
            } else {
              // Reduction rate view
              if (item.id === 'baseline') {
                barPercentage = 0;
                displayLabel = '0% (대조군 기준)';
              } else {
                barPercentage = item.reductionRate !== null ? Math.max(0, Math.min(100, item.reductionRate)) : 0;
                displayLabel = item.reductionRate !== null ? `${item.reductionRate}% 감소` : '미계산';
              }
            }

            return (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{item.name}</span>
                    <span className="text-[11px] text-slate-500 font-mono">[{item.role}]</span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono text-xs sm:text-sm">
                    {displayLabel}
                  </span>
                </div>

                <div className="w-full h-7 bg-slate-200/80 rounded-lg overflow-hidden relative flex items-center">
                  <div
                    className="h-full rounded-lg transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.max(barPercentage, hasVal ? 2 : 0)}%`,
                      backgroundColor: item.color,
                    }}
                  />
                  {hasVal && (
                    <span className="absolute left-2.5 text-xs font-bold text-white drop-shadow-xs">
                      {chartMetric === 'sensorValue' ? `${item.value}` : item.id === 'baseline' ? '기준' : `${item.reductionRate}%`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Results Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <th className="py-2.5 px-3">구분</th>
              <th className="py-2.5 px-3">방음재 종류</th>
              <th className="py-2.5 px-3 text-right">측정 소리 센서값</th>
              <th className="py-2.5 px-3 text-right">소리 감소량</th>
              <th className="py-2.5 px-3 text-right">기준값 대비 감소율 (%)</th>
              <th className="py-2.5 px-3 text-center">성능 순위</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item) => {
              const isBase = item.id === 'baseline';
              const rank = isBase ? '-' : getRank(item.id);

              return (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-slate-600">{item.role}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-slate-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                    {item.value !== null ? item.value : <span className="text-slate-400 font-normal">미입력</span>}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                    {isBase ? (
                      <span className="text-slate-400">-</span>
                    ) : item.reduction !== null ? (
                      `${item.reduction > 0 ? '-' : '+'}${Math.abs(item.reduction)}`
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">
                    {isBase ? (
                      <span className="text-slate-500 font-normal">대조군 (기준)</span>
                    ) : item.reductionRate !== null ? (
                      <span className={item.reductionRate >= 0 ? 'text-blue-700' : 'text-rose-600'}>
                        {item.reductionRate > 0 ? '+' : ''}{item.reductionRate}%
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal">미계산</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {isBase ? (
                      <span className="text-slate-400">-</span>
                    ) : rank !== '-' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">
                        {rank}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
