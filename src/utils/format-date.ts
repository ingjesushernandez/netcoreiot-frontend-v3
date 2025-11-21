// Helpers seguros para crear Date
const toDate = (v: string | number | Date): Date => (v instanceof Date ? v : new Date(v));

// 1) Fecha+hora “humana” (similar a tu fmtDate previo)
export const fmtDate = (value?: string | number | Date): string => {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(toDate(value));
  } catch {
    return String(value);
  }
};

// 2) Solo fecha (dd/mm/aaaa)
export const formatDate = (value?: string | number | Date): string => {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(toDate(value));
  } catch {
    return String(value);
  }
};

// 3) Solo hora (hh:mm:ss)
export const formatTime = (value?: string | number | Date): string => {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(toDate(value));
  } catch {
    return String(value);
  }
};

// 4) Date → Unix ms
export const toUnixMs = (value: string | number | Date): number => toDate(value).getTime();

// 5) Unix ms → Date
export const fromUnixMs = (ms: number | string): Date => new Date(typeof ms === "string" ? parseInt(ms, 10) : ms);

// 6) Unix ms → “dd/mm/aaaa”
export const unixToDateStr = (ms: number | string): string => formatDate(fromUnixMs(ms));

// 7) Unix ms → “hh:mm:ss”
export const unixToTimeStr = (ms: number | string): string => formatTime(fromUnixMs(ms));

// 8) Cron de 5 campos “m h dom mon dow” a partir de un Date o ISO
export const toCron5 = (value: string | number | Date): string => {
  const d = toDate(value);
  const m = d.getMinutes();
  const h = d.getHours();
  const dom = d.getDate();
  const mon = d.getMonth() + 1;
  const dow = d.getDay();
  return `${m} ${h} ${dom} ${mon} ${dow}`;
};
