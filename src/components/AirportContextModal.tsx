import React from 'react';
import { X, Plane, Volume2, ShieldCheck, HelpCircle, CheckCircle2 } from 'lucide-react';

interface AirportContextModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AirportContextModal: React.FC<AirportContextModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 relative animate-in fade-in zoom-in duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">제주국제공항 소음 문제와 과학 탐구 배경</h3>
            <p className="text-xs text-slate-500">지역사회 문제 해결을 위한 피지컬 컴퓨팅 과학 프로젝트</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-600 leading-relaxed max-h-[70vh] overflow-y-auto pr-1">
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 flex items-center gap-2 mb-1.5">
              <Plane className="w-4 h-4 text-blue-600" />
              1. 탐구 동기: 항공기 이착륙 소음 이슈
            </h4>
            <p className="text-slate-700 text-xs sm:text-sm">
              제주국제공항(CJU) 활주로 인근의 용담동, 도두동 등은 연간 수십만 회에 달하는 항공기 이착륙 시 발생하는
              강력한 제트 엔진 소음으로 생활에 큰 영향을 받고 있습니다. 학생 연구원들은 생활 속에서 쉽게 구할 수 있는
              다양한 재료(스펀지, 펠트, 골판지)로 방음 모형을 만들어 소리 저감 효과를 과학적으로 비교 측정합니다.
            </p>
          </div>

          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4">
            <h4 className="font-semibold text-amber-900 flex items-center gap-2 mb-1.5">
              <Volume2 className="w-4 h-4 text-amber-600" />
              2. 왜 "dB" 대신 "소리 센서값"을 사용하나요?
            </h4>
            <p className="text-slate-700 text-xs sm:text-sm">
              우리가 피지컬 컴퓨팅(아두이노, 마이크로비트, EZMaker 등)에서 사용하는 아날로그 소리 센서는 
              공인된 소음계처럼 교정된 절대 물리량(dB)이 아닌, <strong>마이크로폰에 도달한 진동 전압 신호를 0~1023 단계의 정수로 변환한 상대적 크기</strong>입니다.
              따라서 본 앱에서는 과학적 엄밀성을 지키기 위해 데시벨 대신 <strong>"소리 센서값"</strong> 또는 <strong>"상대 소리 크기"</strong>로 표기합니다.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              3. 이번 실험에서 탐구하는 3가지 방음재
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-blue-700 shrink-0">스펀지:</span>
                <span>내부에 무수한 공기 구멍(다공성 구조)이 있어 소리 파동이 갇히며 마찰열로 소멸되는 흡음 원리</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-emerald-700 shrink-0">펠트:</span>
                <span>섬유가 무작위로 얽혀 있어 소리의 진행 경로를 분산시키고 마찰을 유도하는 차음/흡음 원리</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-amber-700 shrink-0">골판지:</span>
                <span>골(flute) 형태의 다층 공기층 구조와 단단한 표면으로 소리를 일부 차단·반사하는 원리</span>
              </li>
            </ul>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>오늘 수동 테스트를 마친 후, 내일 해커톤에서는 실제 소리센서를 실시간 연결할 수 있습니다.</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-xs"
          >
            확인하고 실험하기
          </button>
        </div>
      </div>
    </div>
  );
};
