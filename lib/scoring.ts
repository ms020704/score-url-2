// lib/scoring.ts
import { ScanResult, VirusTotalStats, GSBThreat, TrustLevel } from './types'

function mapScoreToTrustLevel(score: number): TrustLevel {
  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 55) return 'C'
  if (score >= 40) return 'D'
  if (score >= 20) return 'E'
  return 'F'
}

function isIpAddress(url: string): boolean {
  return /^https?:\/\/\d{1,3}(\.\d{1,3}){3}/.test(url)
}

function isLikelyInvalidUrl(url: string): boolean {
  return /^https?:\/\/[a-zA-Z]{2,8}\/?$/.test(url) // ex: asd/, test/
}

function looksRandom(url: string): boolean {
  return /[A-Za-z0-9]{12,}/.test(url)
}

function checkSuspiciousKeywords(url: string): number {
  const keywords = ['malware', 'phishing', 'unwanted', 'virus']
  return keywords.some((k) => url.toLowerCase().includes(k)) ? -40 : 0
}

export function calculateScore(
  gsbThreats: GSBThreat[],
  vtStats: VirusTotalStats,
  targetUrl: string
): Omit<ScanResult, 'url'> {
  let score = 100
  let status: ScanResult['status'] = 'safe'
  let detailMessage = '안전한 URL로 판단됩니다.'

  // ----------------------------
  // 1) URL 자체 패턴 위험도 분석
  // ----------------------------
  score += checkSuspiciousKeywords(targetUrl)
  if (checkSuspiciousKeywords(targetUrl) < 0) {
    detailMessage = 'URL에 악성 의심 키워드가 포함되어 있습니다.'
  }

  if (isIpAddress(targetUrl)) {
    score -= 25
    detailMessage = 'IP 주소 기반 URL은 피싱 위험이 있습니다.'
  }

  if (isLikelyInvalidUrl(targetUrl)) {
    score -= 20
    detailMessage = '존재하지 않는 URL 형식입니다.'
  }

  if (looksRandom(targetUrl)) {
    score -= 15
  }

  if (!targetUrl.startsWith('https://')) {
    score -= 10
  }

  // ----------------------------
  // 2) Google Safe Browsing 감점
  // ----------------------------
  const isSevereGSB = gsbThreats.some(
    (t) => t.threatType === 'MALWARE' || t.threatType === 'SOCIAL_ENGINEERING'
  )

  if (isSevereGSB) {
    score -= 60
    detailMessage = 'Google Safe Browsing에서 악성 위험이 감지되었습니다.'
  } else if (gsbThreats.length > 0) {
    score -= 30
    detailMessage = 'Google Safe Browsing에서 잠재적 위험이 감지되었습니다.'
  }

  // ----------------------------
  // 3) VirusTotal 감점
  // ----------------------------
  if (vtStats.total > 0 && vtStats.positives > 0) {
    const ratio = vtStats.positives / vtStats.total
    score -= Math.round(ratio * 40)

    detailMessage += ` (VirusTotal: ${vtStats.positives}/${vtStats.total} 탐지)`
  }

  // ----------------------------
  // 최종 정리
  // ----------------------------
  score = Math.max(0, score)

  if (score < 40) status = 'danger'
  else if (score < 80) status = 'warning'
  else status = 'safe'

  return {
    score,
    status,
    detail: detailMessage,
    trustLevel: mapScoreToTrustLevel(score),
    gsbThreats,
    vtStats,
  }
}
