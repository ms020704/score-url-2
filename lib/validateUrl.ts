// lib/validateUrl.ts
export function isValidUrl(str: string) {
  try {
    // URL 생성자를 사용하여 유효성 검사
    // 'http'나 'https'가 없으면 자동으로 붙여서 검사합니다.
    new URL(str.startsWith('http') ? str : `https://${str}`);
    return true;
  } catch {
    return false;
  }
}
