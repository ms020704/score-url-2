// lib/virustotal.ts
import axios from 'axios';
import { VirusTotalStats } from './types';

const VT_API_KEY = process.env.VIRUSTOTAL_API_KEY;
const VT_API_URL = 'https://www.virustotal.com/api/v3/urls';

function urlToId(url: string): string {
  return Buffer.from(url).toString('base64').replace(/=/g, '');
}

export async function checkVirusTotal(url: string): Promise<VirusTotalStats> {
  if (!VT_API_KEY) {
    throw new Error('VirusTotal API key is not configured.');
  }

  const urlId = urlToId(url);

  try {
    const response = await axios.get(`${VT_API_URL}/${urlId}`, {
      headers: { 'x-apikey': VT_API_KEY },
    });

    const attributes = response.data?.data?.attributes;

    if (attributes?.last_analysis_stats) {
      const stats = attributes.last_analysis_stats;
      const total =
        stats.malicious + stats.suspicious + stats.undetected + stats.timeout;
      const positives = stats.malicious + stats.suspicious;

      return { positives: positives, total: total };
    }
    return { positives: 0, total: 0 };
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.warn('VirusTotal: URL analysis report not found.');
      return { positives: 0, total: 0 };
    }
    console.error('VirusTotal API call failed:', error.message);
    throw new Error('Failed to connect to VirusTotal API.');
  }
}
