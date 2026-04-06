/**
 * Formatting Utilities for Vietnamese Context
 * Standardises dates, currency (VND), and numbers for the Vietnamese PlayHub.
 */

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

export const formatDate = (date: Date | string | number) => {
  const d = new Date(date)
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d)
}

export const formatTime = (date: Date | string | number) => {
  const d = new Date(date)
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d)
}

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("vi-VN").format(num)
}
