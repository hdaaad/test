import React from 'react';
import { Volume2, Cpu, Sparkles, Plane, Info } from 'lucide-react';

interface HeaderProps {
  onOpenContext: () => void;
  onOpenSensorGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenContext, onOpenSensorGuide }) => {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Main Title & Topic */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  제주공항 소음 탐구 프로젝트
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  피지컬 컴퓨팅 과학실험
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                항공기 소음 저감 방음재 탐구 실험실
              </h1>
            </div>
          </div>

          {/* Quick Info & Action Badges */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              type="button"
              onClick={onOpenContext}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-blue-600" />
              탐구 배경 보기
            </button>

            <button
              type="button"
              onClick={onOpenSensorGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-purple-600" />
              EZMaker 센서 연동 안내
            </button>

            <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
              <span>측정 단위: <strong>소리 센서값</strong> (상대 크기)</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
