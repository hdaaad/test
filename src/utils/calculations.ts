import { ExperimentMeasurements, ReductionRates } from '../types';

/**
 * 방음재 소리 감소율 계산식:
 * (기준값 - 방음재 적용값) / 기준값 × 100
 *
 * *주의*: Gemini가 아닌 순수 일반 자바스크립트/타입스크립트 코드로 계산합니다.
 */
export function calculateReductionRate(baseline: number | null, materialValue: number | null): number | null {
  if (baseline === null || materialValue === null) return null;
  if (baseline <= 0) return null;
  
  const rate = ((baseline - materialValue) / baseline) * 100;
  // 소수점 첫째 자리까지 반올림
  return Math.round(rate * 10) / 10;
}

export function calculateAllReductionRates(measurements: ExperimentMeasurements): ReductionRates {
  const { baseline, sponge, felt, cardboard } = measurements;

  return {
    sponge: calculateReductionRate(baseline, sponge),
    felt: calculateReductionRate(baseline, felt),
    cardboard: calculateReductionRate(baseline, cardboard),
  };
}

export function validateExperimentInput(
  hypothesis: string,
  measurements: ExperimentMeasurements
): { isValid: boolean; error: string | null } {
  if (!hypothesis.trim()) {
    return { isValid: false, error: '탐구 시작 전 가설을 작성해주세요.' };
  }

  if (measurements.baseline === null || isNaN(measurements.baseline)) {
    return { isValid: false, error: '방음재 없음(기준값)의 소리 센서값을 입력해주세요.' };
  }

  if (measurements.baseline <= 0) {
    return { isValid: false, error: '기준 소리 센서값은 0보다 큰 양수여야 합니다.' };
  }

  const materials = [
    { name: '스펀지', val: measurements.sponge },
    { name: '펠트', val: measurements.felt },
    { name: '골판지', val: measurements.cardboard },
  ];

  for (const m of materials) {
    if (m.val === null || isNaN(m.val)) {
      return { isValid: false, error: `${m.name}의 측정 소리 센서값을 입력해주세요.` };
    }
    if (m.val < 0) {
      return { isValid: false, error: `${m.name}의 소리 센서값은 0 이상이어야 합니다.` };
    }
  }

  return { isValid: true, error: null };
}

// 해커톤 사전 테스트 및 데모용 샘플 데이터 (제주공항 인근 소음 모의 실험)
export const SAMPLE_EXPERIMENT_PRESETS = [
  {
    title: '제주 용담동 상공 항공기 이착륙 소음 모의 실험 (A조)',
    hypothesis: '스펀지는 내부 다공성 기포가 많아 소리 파동 에너지를 가장 효과적으로 흡수하여 소리 센서값 감소율이 가장 높을 것이다.',
    measurements: {
      baseline: 820,
      sponge: 430, // 감소율: ((820-430)/820)*100 = 47.6%
      felt: 540,   // 감소율: ((820-540)/820)*100 = 34.1%
      cardboard: 640 // 감소율: ((820-640)/820)*100 = 22.0%
    }
  },
  {
    title: '제주 도두동 해안가 야외 방음벽 모형 테스트 (B조)',
    hypothesis: '골판지는 단단한 표면으로 소리를 반사시키고 스펀지는 흡수할 것이므로 스펀지와 펠트가 골판지보다 소리 센서값을 더 많이 줄여줄 것이다.',
    measurements: {
      baseline: 750,
      sponge: 395, // 감소율: ((750-395)/750)*100 = 47.3%
      felt: 460,   // 감소율: ((750-460)/750)*100 = 38.7%
      cardboard: 590 // 감소율: ((750-590)/750)*100 = 21.3%
    }
  }
];
