export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("vi-VN").format(num)
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "")
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)

  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`
  }

  return phone
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + "..."
}

export const formatDate = (date: Date | string | number, format: "short" | "long" | "full" = "short"): string => {
  const targetDate = new Date(date)

  switch (format) {
    case "short":
      return targetDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    case "long":
      return targetDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    case "full":
      return targetDate.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    default:
      return targetDate.toLocaleDateString("vi-VN")
  }
}

export const formatRelativeTime = (date: Date | string | number): string => {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

  // Nếu là tương lai
  if (diffInSeconds < 0) {
    const absDiff = Math.abs(diffInSeconds)

    if (absDiff < 60) return "trong vài giây nữa"
    if (absDiff < 3600) return `trong ${Math.floor(absDiff / 60)} phút nữa`
    if (absDiff < 86400) return `trong ${Math.floor(absDiff / 3600)} giờ nữa`
    if (absDiff < 2592000) return `trong ${Math.floor(absDiff / 86400)} ngày nữa`
    if (absDiff < 31536000) return `trong ${Math.floor(absDiff / 2592000)} tháng nữa`
    return `trong ${Math.floor(absDiff / 31536000)} năm nữa`
  }

  // Quá khứ
  if (diffInSeconds < 60) return "vừa xong"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} tháng trước`
  return `${Math.floor(diffInSeconds / 31536000)} năm trước`
}

export const formatDateTime = (date: Date | string | number): string => {
  const targetDate = new Date(date);
  return targetDate.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};