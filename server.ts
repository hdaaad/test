import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// API: Gemini Science Inquiry Coach
app.post('/api/analyze', async (req, res) => {
  try {
    const { studentName, hypothesis, baseline, measurements } = req.body;

    if (!hypothesis || baseline === undefined || !Array.isArray(measurements)) {
      return res.status(400).json({
        success: false,
        error: '가설, 기준값, 방음재별 측정 데이터가 올바르게 전달되지 않았습니다.',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'GEMINI_API_KEY 환경 변수가 설정되지 않았습니다. AI Studio의 Settings > Secrets 패널을 확인해주세요.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const measurementsSummary = measurements
      .map(
        (m: { material: string; value: number; reductionRate: number }) =>
          `- ${m.material}: 측정 소리 센서값 = ${m.value}, 기준값 대비 감소율 = ${m.reductionRate}%`
      )
      .join('\n');

    const prompt = `
[실험 배경]
- 주제: 제주국제공항 주변 항공기 소음 문제 해결을 위한 방음재 탐구
- 실험자: ${studentName || '학생 연구원'}
- 사용 센서: 아날로그 소리 센서 (0~1023 스케일의 상대 소리 크기 신호값)
- 측정 단위 규칙: 데시벨(dB) 절대 사용 금지. 반드시 "소리 센서값" 또는 "상대 소리 크기"라고 표현할 것.

[학생이 세운 가설]
"${hypothesis}"

[사전 코드 계산된 측정 데이터]
- 방음재 없음 (대조군 기준 소리 센서값): ${baseline}
${measurementsSummary}

[감소율 계산 공식 - 이미 코드로 정확히 계산됨]
감소율(%) = (기준값 - 방음재 적용값) / 기준값 × 100

[AI 코칭 절대 준수 규칙]
1. 결과를 절대 일반화하지 마십시오 (예: "스펀지가 모든 소리를 항상 가장 잘 막아준다"는 식의 일반화 금지).
2. 반드시 **"이 실험 조건에서는"** (사용한 재료의 두께, 밀도, 측정 거리, 소리 주파수 등)이라는 관점을 강조하여 과학적 한계와 조건을 명시하십시오.
3. 소리 크기 단위로 "dB"나 "데시벨"을 절대 쓰지 말고, **"소리 센서값"** 또는 **"상대 소리 크기"**라고 표기하십시오.
4. 이미 계산된 감소율 수치를 변형하지 마십시오.
5. 학생의 자기주도적 과학적 탐구력을 길러주는 친절하고 격려하는 어투(해요체)로 작성하십시오.
6. 반드시 아래 5가지 항목을 포함하여 JSON으로 응답하십시오.
`;

    // 재시도 및 모델 폴백 로직 (503 High Demand 또는 일시적 과부하 대비)
    const candidateModels = ['gemini-3.8-flash', 'gemini-3.6-flash'];
    let lastError: any = null;
    let feedback = null;

    const requestConfig = {
      systemInstruction: `당신은 대한민국 과학교육 및 피지컬 컴퓨팅 해커톤의 전문 과학 탐구 코치입니다.
학생들이 제주공항 주변 항공기 소음 문제를 물리·과학적으로 이해하고, 방음재의 성질을 실험적으로 탐구하도록 돕습니다.
중요 제약사항:
- 'dB'나 '데시벨'이라는 단어는 절대 사용하지 않으며, 항상 '소리 센서값' 또는 '상대 소리 크기'로 표현합니다.
- 감소율은 이미 수학적으로 계산된 수치이므로 재계산하지 않고 제공된 수치를 바탕으로 해석합니다.
- 실험 결과를 절대 섣불리 일반화하지 말고, 반드시 "이 실험 조건에서는"이라는 관점을 견지합니다.
- 응답은 요청된 JSON 스키마를 엄격히 따릅니다.`,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          observedFeatures: {
            type: Type.STRING,
            description: '1. 관찰된 핵심 특징: 측정된 소리 센서값과 감소율에서 두드러지게 나타난 물리적 현상',
          },
          hypothesisComparison: {
            type: Type.STRING,
            description: '2. 학생 가설과 결과 비교: 학생의 초기 가설과 실제 실험 데이터가 일치하는지 또는 어떤 차이가 있는지 객관적 비교',
          },
          controlledVariablesAndErrors: {
            type: Type.STRING,
            description: '3. 통제변인 또는 오차 가능성: 방음 상자의 틈새, 센서와의 거리, 소음원의 일관성, 재료 두께 차이 등 실험 오차 요인',
          },
          nextVariablesToChange: {
            type: Type.STRING,
            description: '4. 다음 실험에서 바꿔볼 변인: 재료의 두께, 겹침 구조, 소리의 주파수(고음/저음), 다공성 재료 조합 등',
          },
          nextInquiryQuestions: {
            type: Type.STRING,
            description: '5. 다음 탐구 질문: 학생이 추가로 고민해 볼 수 있는 심화 과학 탐구 질문 2~3개',
          },
          perspectiveNote: {
            type: Type.STRING,
            description: '"이 실험 조건에서는"이라는 전제를 명확히 짚어주는 코멘트',
          },
        },
        required: [
          'observedFeatures',
          'hypothesisComparison',
          'controlledVariablesAndErrors',
          'nextVariablesToChange',
          'nextInquiryQuestions',
        ],
      },
    };

    for (const modelName of candidateModels) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: requestConfig,
          });

          const responseText = response.text;
          if (responseText) {
            feedback = JSON.parse(responseText);
            break;
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`[Gemini API] Model ${modelName} Attempt ${attempt} failed:`, err?.message || err);
          // 503이나 429일 경우 잠시 대기 후 재시도
          await new Promise((r) => setTimeout(r, 1200 * attempt));
        }
      }
      if (feedback) break;
    }

    if (!feedback) {
      throw lastError || new Error('모든 모델 시도 후에도 피드백을 생성하지 못했습니다.');
    }

    return res.json({
      success: true,
      feedback,
    });
  } catch (error: any) {
    console.error('Gemini Coaching Error:', error);
    const msg = error?.message || '';
    let userFriendlyError = 'AI 탐구 피드백 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

    if (msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE')) {
      userFriendlyError = '구글 Gemini AI 서버에 일시적인 사용량 급증(503 과부하)이 발생했습니다. 5~10초 후 "AI 탐구 코치에게 물어보기" 버튼을 다시 눌러주세요.';
    } else if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
      userFriendlyError = 'AI 요청 할당량이 일시적으로 초과되었습니다. 잠시 후 다시 시도해주세요.';
    }

    return res.status(500).json({
      success: false,
      error: userFriendlyError,
      rawError: msg,
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Science Inquiry Coach Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
