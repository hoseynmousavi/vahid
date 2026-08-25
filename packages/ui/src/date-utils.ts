export const HOTEL_TIME_ZONE = "Asia/Tehran";

export type StayDates = {
  startDate: string;
  endDate: string;
};

function formatDateInTehran(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: HOTEL_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";

  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function addDays(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export function getDefaultStayDates(now = new Date()): StayDates {
  const startDate = formatDateInTehran(now);

  return {
    startDate,
    endDate: addDays(startDate, 1),
  };
}

function isIsoDate(value: string | null): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

export function getStayDatesFromSearch(search: string): StayDates | null {
  const params = new URLSearchParams(search);
  const startDate = params.get("startDate");
  const endDate = params.get("endDate");

  if (!isIsoDate(startDate) || !isIsoDate(endDate) || endDate <= startDate) {
    return null;
  }

  return { startDate, endDate };
}

export function hasStayDateParams(startDate: unknown, endDate: unknown) {
  return typeof startDate === "string" && typeof endDate === "string";
}
