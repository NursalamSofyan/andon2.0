/**
 * Menghasilkan URL lengkap berdasarkan subdomain dan path.
 * Mendukung localhost, nip.io (untuk mobile dev), dan production domain.
 */
export const getBaseUrl = (subdomain?: string, path: string = "") => {
  if (typeof window === "undefined") return ""; // Pastikan berjalan di client-side

  const host = window.location.host; // Contoh: eclipse.localhost:3000 atau andonpro.com
  const protocol = window.location.protocol;
  
  // 1. Identifikasi Base Domain (hilangkan port dan subdomain saat ini)
  // Menghapus port jika ada
  let baseDomain = host.split(":")[0]; 
  
  // List domain utama Anda (tambahkan domain production Anda di sini)
  const mainDomains = ["localhost", "andonpro.com", "nip.io"];
  
  // Mencari di mana domain utama dimulai
  const hostParts = baseDomain.split(".");
  let domainStartIndex = -1;

  for (let i = 0; i < hostParts.length; i++) {
    // Cek jika bagian ini adalah bagian dari mainDomains atau merupakan IP Address
    if (mainDomains.includes(hostParts[i]) || /^\d+$/.test(hostParts[i])) {
      domainStartIndex = i;
      break;
    }
  }

  // Jika nip.io, kita harus mengambil IP dan nip.io sebagai satu kesatuan base
  if (baseDomain.includes("nip.io")) {
    const parts = baseDomain.split(".");
    // IP (4 bagian) + nip.io (2 bagian) = 6 bagian terakhir
    baseDomain = parts.slice(-6).join(".");
  } else if (domainStartIndex !== -1) {
    baseDomain = hostParts.slice(domainStartIndex).join(".");
  }

  // 2. Bangun URL Baru
  const port = host.split(":")[1] ? `:${host.split(":")[1]}` : "";
  const finalSubdomain = subdomain ? `${subdomain}.` : "";
  const finalPath = path.startsWith("/") ? path : `/${path}`;

  return `${protocol}//${finalSubdomain}${baseDomain}${port}${finalPath}`;
};