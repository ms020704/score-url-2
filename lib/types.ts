// lib/types.ts

// 신뢰도 등급 타입 정의 (DB 스키마와 일치)
export type TrustLevel = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

// 최종 결과 타입 (프론트엔드와 백엔드 공유)
export type ScanResult = {
  url: string;
  score: number;
  status: 'safe' | 'warning' | 'danger';
  detail: string;
  trustLevel: TrustLevel;
  gsbThreats: GSBThreat[];
  vtStats: VirusTotalStats;
};

// VirusTotal API 호출 시 필요한 통계 타입
export interface VirusTotalStats {
  positives: number;
  total: number;
}

// Google Safe Browsing API 호출 시 필요한 위협 타입
export interface GSBThreat {
  threatType: string;
}
