export interface Stack {
  id: string
  name: string
  tagline: string
  description: string
  totalDays: number
  status: 'available' | 'coming-soon'
  level: 'fundamentos' | 'avancado'
  color: string
  weekThemes?: string[]
}
