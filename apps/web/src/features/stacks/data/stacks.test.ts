import { describe, it, expect } from 'vitest'
import { groupStacksByLevel } from './stacks'
import type { Stack } from '../types'

function makeStack(id: string, level: Stack['level']): Stack {
  return {
    id,
    name: id,
    tagline: '',
    description: '',
    totalDays: 7,
    status: 'coming-soon',
    level,
    color: 'blue',
  }
}

describe('groupStacksByLevel', () => {
  it('separa stacks por nível', () => {
    const stacks = [
      makeStack('a', 'fundamentos'),
      makeStack('b', 'avancado'),
      makeStack('c', 'fundamentos'),
    ]
    const { fundamentos, avancado } = groupStacksByLevel(stacks)
    expect(fundamentos.map(s => s.id)).toEqual(['a', 'c'])
    expect(avancado.map(s => s.id)).toEqual(['b'])
  })

  it('preserva a ordem do array dentro de cada nível', () => {
    const stacks = [
      makeStack('x', 'avancado'),
      makeStack('y', 'fundamentos'),
      makeStack('z', 'avancado'),
    ]
    const { avancado } = groupStacksByLevel(stacks)
    expect(avancado.map(s => s.id)).toEqual(['x', 'z'])
  })

  it('retorna arrays vazios quando não há stacks', () => {
    const { fundamentos, avancado } = groupStacksByLevel([])
    expect(fundamentos).toEqual([])
    expect(avancado).toEqual([])
  })
})
