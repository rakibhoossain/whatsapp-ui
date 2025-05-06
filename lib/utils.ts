import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(date: Date): string {
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  const isToday =
    date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()

  if (isToday) {
    return formatHourMinute(date)
  } else if (isYesterday) {
    return "Yesterday"
  } else {
    return formatDateShort(date)
  }
}

export function formatMessageTime(date: Date): string {
  return formatHourMinute(date)
}

function formatHourMinute(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString([], { month: "short", day: "numeric" })
}


export function formatWhatsAppJID(jid: string) {
  // Extract the numeric part
  const match = jid.match(/^(\d+)@/);
  if (!match) return null;

  const number = match[1];

  // Country code (first 3 digits for Bangladesh)
  const countryCode = number.slice(0, 3); // 880
  const rest = number.slice(3); // 1814372493

  // Format as per request: +880 1814-372493
  const formatted = `+${countryCode} ${rest.slice(0, 4)}-${rest.slice(4)}`;

  return formatted;
}