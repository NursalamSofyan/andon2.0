// Fungsi murni (pure functions) tidak perlu 'use server'
export function extractBaseDomain(host: string): string {
  const hostname = host.split(':')[0];
  if (hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('.');
    if (hostname.includes('---')) return 'vercel.app';
    if (parts.length > 3) return parts.slice(-3).join('.');
    return hostname;
  }
  const parts = hostname.split('.');
  if (parts.length > 2) return parts.slice(-2).join('.');
  return hostname;
}

export function extractBaseDomainDev(host: string): string {
  const parts = host.split(':');
  const hostname = parts[0];
  const port = parts[1] ? `:${parts[1]}` : '';

  if (hostname.includes('.nip.io')) {
    const nipParts = hostname.split('.');
    if (nipParts.length > 6) return nipParts.slice(-6).join('.') + port;
    return hostname + port;
  }

  const ipMatch = hostname.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
  if (ipMatch) return ipMatch[1] + port;
  if (hostname.includes('localhost')) return 'localhost' + port;
  return host;
}
