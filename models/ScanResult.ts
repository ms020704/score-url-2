import mongoose from 'mongoose'

// URL 보안 점수 측정 결과 스키마
const ScanResultSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true }, // 사용자의 ID
  url: { type: String, required: true }, // 사용자가 입력한 URL
  score: { type: Number, required: true }, // URL의 보안 점수
  trustLevel: { type: String, required: true }, // URL의 신뢰도 등급 (A~F)
  scanDate: { type: Date, default: Date.now }, // 사용자가 URL을 검색한 일시

  // API의 응답들
  apiResults: {
    googleSafeBrowsing: { type: Object }, // 1차 필터
    virusTotal: { type: Object }, // 정밀 악성 탐지
    abuseIPDB: { type: Object }, // IP 평판
    whois: { type: Object }, // 도메인 나이 및 등록자
    sslLabs: { type: Object }, // HTTPS 보안 수준
    phishTank: { type: Object }, // 피싱 DB
  },
})

export default (mongoose.models.ScanResult as any) ||
  mongoose.model('ScanResult', ScanResultSchema)
