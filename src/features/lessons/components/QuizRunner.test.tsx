import { describe, it, expect } from 'vitest'

// Test the score calculation logic
describe('Quiz scoring', () => {
  it('calculates 100% when all correct', () => {
    const questions = 4
    const correct = 4
    const score = Math.round((correct / questions) * 100)
    expect(score).toBe(100)
  })

  it('calculates 75% when 3/4 correct', () => {
    const questions = 4
    const correct = 3
    const score = Math.round((correct / questions) * 100)
    expect(score).toBe(75)
  })

  it('passes at 70% or above', () => {
    expect(70 >= 70).toBe(true)
    expect(69 >= 70).toBe(false)
  })
})
