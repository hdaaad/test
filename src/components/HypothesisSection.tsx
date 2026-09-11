import React from 'react';
import { Lightbulb, HelpCircle, Sparkles } from 'lucide-react';

interface HypothesisSectionProps {
  studentName: string;
  setStudentName: (name: string) => void;
  hypothesis: string;
  setHypothesis: (hypothesis: string) => void;
  onSelectSampleHypothesis: (h: string) => void;
}

export const HypothesisSection: React.FC<HypothesisSectionProps> = ({
  studentName,
  setStudentName,
  hypothesis,
  setHypothesis,
  onSelectSampleHypothesis,
}) => {
  const sampleHypotheses = [
    '스펀지는 내부에 공기구멍(다공성)이 많아 소리 센서값을 가장 많이 줄여줄 것이다.',
    '골판지는 두껍고 공기층이 있어 스펀지나 펠트보다 상대 소리 크기를 더 많이 감소시킬 것이다.',
    '펠트는 섬유가 촘촘하여 골판지보다는 우수하지만 스펀지보다는 감소율이 낮을 것이다.',
  ];

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              1단계. 탐구 가설 설정
            </h2>
            <p className="text-xs text-slate-500">
              실험을 시작하기 전, 어떤 방음재가 소리를 가장 잘 줄여줄지 예상해봅니다.
            </p>
          </div>
        </div>

        {/* Student / Team Name input */}
        <div className="flex items-center gap-2">
          <label htmlFor="student-name-input" className="text-xs font-semibold text-slate-600 whitespace-nowrap">
            연구원/조:
          </label>
          <input
            id="student-name-input"
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="예: 제주 탐구 1조"
            className="w-32 sm:w-36 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/70"
          />
        </div>
      </div>

      {/* Hypothesis Input Box */}
      <div className="space-y-2.5">
        <label htmlFor="hypothesis-textarea" className="block text-xs font-bold text-slate-700">
          나의 과학적 가설 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="hypothesis-textarea"
          rows={3}
          value={hypothesis}
          onChange={(e) => setHypothesis(e.target.value)}
          placeholder="예: 스펀지는 내부에 공기구멍이 많아 소리 에너지를 흡수하므로, 방음재 없음 기준값 대비 소리 센서값 감소율이 가장 높을 것이다."
          className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400 leading-relaxed transition-all"
        />

        {/* Hypothesis helper chips */}
        <div className="pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 font-medium">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>가설 예시 템플릿 (클릭하여 적용):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sampleHypotheses.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectSampleHypothesis(sample)}
                className="text-left text-[11px] sm:text-xs px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 hover:border-blue-200 transition-colors"
              >
                "{sample.slice(0, 32)}..."
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
