export interface Stack {
  id: string
  name: string
  tagline: string
  description: string
  totalDays: number
  status: 'available' | 'coming-soon'
  color: string
}
