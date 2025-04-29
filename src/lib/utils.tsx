import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function formatTime(time: string): string {
  return time
}

export function formatPreviewText(text: string): string {
  return text.length > 30 ? `${text.substring(0, 30)}...` : text
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
