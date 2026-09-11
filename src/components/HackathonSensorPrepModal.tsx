import React, { useState } from 'react';
import { X, Cpu, Cable, Bluetooth, Check, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { sensorManager } from '../services/sensorAdapter';

interface HackathonSensorPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulatedReadingApply?: (target: 'baseline' | 'sponge' | 'felt' | 'cardboard', value: number) => void;
}

export const HackathonSensorPrepModal: React.FC<HackathonSensorPrepModalProps> = ({
  isOpen,
  onClose,
  onSimulatedReadingApply,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<'baseline' | 'sponge' | 'felt' | 'cardboard'>('baseline');
  const [testReading, setTestReading] = useState<number | null>(null);
  const support = sensorManager.checkSupport();

  if (!isOpen) return null;

  const handleTestSimulate = () => {
    const val = sensorManager.simulateLiveSensorReading(selectedTarget);
    setTestReading(val);
    if (onSimulatedReadingApply) {
      onSimulatedReadingApply(selectedTarget, val);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 relative animate-in fade-in zoom-in duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">EZMaker 소리 센서 연동 준비 인터페이스</h3>
            <p className="text-xs text-slate-500">내일 피지컬 컴퓨팅 해커톤 연동용 아키텍처 안내</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl">
            <h4 className="font-semibold text-purple-900 text-xs sm:text-sm mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              데이터 입력 로직 분리 (Adapter Pattern)
            </h4>
            <p className="text-xs text-slate-700">
              오늘 테스트한 <strong>수동 입력 값</strong>과 내일 해커톤 현장에서 연결할 <strong>EZMaker 소리센서 하드웨어</strong>가
              완벽히 분리되어 있어, 웹앱의 핵심 계산 및 AI 코칭 로직을 수정하지 않고도 센서 데이터 스트림으로 교체할 수 있습니다.
            </p>
          </div>

          {/* Browser API Compatibility */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Cable className="w-3.5 h-3.5 text-blue-600" />
                  Web Serial API
                </span>
                {support.serial ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">지원됨</span>
                ) : (
                  <span className="text-[11px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">미지원 브라우저</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">USB 시리얼 케이블로 EZMaker 보드 직접 연결 (115200 Baud)</p>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Bluetooth className="w-3.5 h-3.5 text-blue-600" />
                  Web Bluetooth API
                </span>
                {support.bluetooth ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">지원됨</span>
                ) : (
                  <span className="text-[11px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">미지원 브라우저</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">무선 BLE 통신으로 EZMaker 센서값 실시간 수신</p>
            </div>
          </div>

          {/* Live Simulator Test for Tonight */}
          <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
            <h4 className="font-semibold text-slate-900 text-xs sm:text-sm mb-2 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-blue-600" />
              오늘 사전 테스트용 센서 신호 모의 테스트
            </h4>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs text-slate-600">측정 대상 선택:</span>
              {(['baseline', 'sponge', 'felt', 'cardboard'] as const).map((t) => {
                const labelMap = {
                  baseline: '방음재 없음(기준값)',
                  sponge: '스펀지',
                  felt: '펠트',
                  cardboard: '골판지',
                };
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTarget(t)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                      selectedTarget === t
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {labelMap[t]}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200">
              <div className="text-xs">
                <span className="text-slate-500">모의 센서 수신값: </span>
                <span className="font-bold text-slate-900">
                  {testReading !== null ? `${testReading} (소리 센서값)` : '아직 측정 안 됨'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleTestSimulate}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                센서값 모의 추출 & 폼에 적용
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            확인 완료
          </button>
        </div>
      </div>
    </div>
  );
};
