/**
 * 格式化日期时间为 YYYY/M/D HH:mm:ss 格式
 * 
 * @param dateStr 原始日期字符串 (ISO 8601), Date 对象或毫秒数
 * @returns 格式化后的字符串
 */
export const formatDateTime = (dateStr: string | Date | number | null | undefined): string => {
  if (!dateStr) return '-'
  
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
}

/**
 * 格式化日期为 YYYY/M/D 格式
 */
export const formatDate = (dateStr: string | Date | number | null | undefined): string => {
  if (!dateStr) return '-'
  
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${year}/${month}/${day}`
}
