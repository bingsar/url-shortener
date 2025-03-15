export interface AnalyticsClickDto {
  clickedAt: string
  ipAddress: string
}

export interface AnalyticsDto {
  shortUrl: string
  originalUrl: string
  createdAt: string
  clickCount: number
  recentClicks: AnalyticsClickDto[]
}
