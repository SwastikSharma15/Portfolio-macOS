import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function formatTime(date: Date, includeSeconds = false): string {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  const formattedHours = hours % 12 || 12
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds
  const ampm = hours >= 12 ? "PM" : "AM"

  return includeSeconds
    ? `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`
    : `${formattedHours}:${formattedMinutes} ${ampm}`
}

export function formatDate(date: Date, options: Intl.DateTimeFormatOptions = {}): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    ...options,
  }

  return new Intl.DateTimeFormat("en-US", defaultOptions).format(date)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`
  }
}
