// lib/gsb.ts
import axios from 'axios';
import { GSBThreat } from './types';

const GSB_API_KEY = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
const GSB_API_URL = 'https://safebrowsing.googleapis.com/v4/threatMatches:find';

export async function checkGoogleSafeBrowsing(
  url: string
): Promise<GSBThreat[]> {
  // 1. API 키 확인 로그
  console.log('🔑 GSB API Key Loaded:', !!GSB_API_KEY);

  if (!GSB_API_KEY) {
    throw new Error('GSB API key is not configured.');
  }

  // 2. URL 확인 로그 (여기에 http:// 가 없으면 400 에러남)
  console.log('🔍 GSB Checking URL:', url);

  const requestBody = {
    client: { clientId: 'score-url-project', clientVersion: '1.0.0' },
    threatInfo: {
      // ✨ 수정: 'PHISHING' 제거 (SOCIAL_ENGINEERING에 포함됨)
      threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'],
      platformTypes: ['ANY_PLATFORM'],
      threatEntryTypes: ['URL'],
      threatEntries: [{ url: url }],
    },
  };

  // 3. 요청 본문 로그 확인
  // console.log("📦 GSB Request Body:", JSON.stringify(requestBody));

  try {
    const response = await axios.post(
      `${GSB_API_URL}?key=${GSB_API_KEY}`,
      requestBody,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.data.matches && response.data.matches.length > 0) {
      return response.data.matches.map((match: any) => ({
        threatType: match.threatType,
      })) as GSBThreat[];
    }
    return [];
  } catch (error: any) {
    // 4. 에러 상세 출력 (매우 중요)
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        '🚨 GSB Error Response:',
        JSON.stringify(error.response.data, null, 2)
      );
    } else {
      console.error('🚨 GSB Error Message:', error.message);
    }

    // API 호출 실패 시, 전체 로직을 죽이지 말고 빈 배열(안전)로 처리하거나 에러를 던짐
    // 여기서는 에러를 던져서 page.tsx가 알게 함
    throw new Error('Failed to connect to Google Safe Browsing API.');
  }
}
