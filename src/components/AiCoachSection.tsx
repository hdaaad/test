import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Copy,
  Check,
  Search,
  Scale,
  ShieldAlert,
  GitBranch,
  MessageSquare,
} from 'lucide-react';
import { AiCoachingFeedback } from '../types';

interface AiCoachSectionProps {
  isLoading: boolean;
  error: string | null;
  feedback: AiCoachingFeedback | null;
  onAskCoach: () => void;
  canAsk: boolean;
  validationError: string | null;
}

export const AiCoachSection: React.FC<AiCoachSectionProps> = ({
  isLoading,
  error,
  feedback,
  onAskCoach,
  canAsk,
  validationError,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyReport = () => {
    if (!feedback) return;

    const text = `
[제주공항 항공기 소음 탐구 실험실 - Gemini AI 과학 탐구 코치 피드백]

1. 관찰된 핵심 특징
${feedback.observedFeatures}

2. 학생 가설과 결과 비교
${feedback.hypothesisComparison}

3. 통제변인 또는 오차 가능성
${feedback.controlledVariablesAndErrors}

4. 다음 실험에서 바꿔볼 변인
${feedback.nextVariablesToChange}

5. 다음 탐구 질문
${feedback.nextInquiryQuestions}

※ 참고: 본 피드백은 "이 실험 조건(사용 재료, 두께, 음원 주파수 등)"에 국한된 과학적 해석이며 섣부른 일반화를 지양합니다.
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              4단계. Gemini AI 탐구 코칭
            </h2>
            <p className="text-xs text-slate-500">
              측정 데이터와 감소율을 바탕으로 5가지 과학적 탐구 피드백을 받습니다.
            </p>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={onAskCoach}
          disabled={isLoading || !canAsk}
          className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-xs transition-all ${
            isLoading || !canAsk
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transform active:scale-98'
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>AI 코치가 데이터를 분석 중입니다...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>AI 탐구 코치에게 물어보기</span>
            </>
          )}
        </button>
      </div>

      {/* Input validation guidance */}
      {!canAsk && validationError && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{validationError} (1단계 가설과 2단계 측정값을 모두 입력해주세요)</span>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-red-800">AI 탐구 피드백 생성 안내</p>
              <p className="text-red-700 leading-relaxed">{error}</p>
            </div>
          </div>
          {canAsk && !isLoading && (
            <button
              type="button"
              onClick={onAskCoach}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors shadow-xs"
            >
              다시 시도
            </button>
          )}
        </div>
      )}

      {/* Loading Skeleton / State */}
      {isLoading && (
        <div className="p-6 rounded-xl border border-purple-200 bg-purple-50/40 text-center space-y-3 animate-pulse">
          <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <Bot className="w-6 h-6 animate-bounce" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-800">
              Gemini AI 과학 탐구 코치가 피드백을 작성하고 있습니다
            </h4>
            <p className="text-xs text-slate-500">
              1. 관찰된 핵심 특징 &bull; 2. 가설 비교 &bull; 3. 통제변인 &bull; 4. 다음 변인 &bull; 5. 탐구 질문
            </p>
          </div>
        </div>
      )}

      {/* Render 5 Structured Cards when Feedback is present */}
      {feedback && !isLoading && (
        <div className="space-y-4 pt-2">
          {/* Important Scientific Constraint Notice */}
          <div className="p-3 bg-amber-50/90 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>과학적 탐구 유의점:</strong> 본 해석은 <strong>"이 실험 조건에서는"</strong>이라는 전제하에 유효하며, 소음 주파수·재료 두께·밀도에 따라 결과는 달라질 수 있습니다.
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyReport}
              className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg font-semibold text-xs transition-colors shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>복사됨!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span>피드백 복사</span>
                </>
              )}
            </button>
          </div>

          {/* 5 Distinct Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. 관찰된 핵심 특징 */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                <Search className="w-4 h-4 text-blue-600" />
                <span>1. 관찰된 핵심 특징</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {feedback.observedFeatures}
              </p>
            </div>

            {/* 2. 학생 가설과 결과 비교 */}
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                <Scale className="w-4 h-4 text-purple-600" />
                <span>2. 학생 가설과 결과 비교</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {feedback.hypothesisComparison}
              </p>
            </div>

            {/* 3. 통제변인 또는 오차 가능성 */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>3. 통제변인 또는 오차 가능성</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {feedback.controlledVariablesAndErrors}
              </p>
            </div>

            {/* 4. 다음 실험에서 바꿔볼 변인 */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <GitBranch className="w-4 h-4 text-emerald-600" />
                <span>4. 다음 실험에서 바꿔볼 변인</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {feedback.nextVariablesToChange}
              </p>
            </div>
          </div>

          {/* 5. 다음 탐구 질문 (Full Width) */}
          <div className="p-4 sm:p-5 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>5. 다음 탐구 질문</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {feedback.nextInquiryQuestions}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
