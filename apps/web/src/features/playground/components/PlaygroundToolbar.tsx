import { Button, cn } from '@academy/ui'

interface PlaygroundToolbarProps {
  hints: string[]
  hintsUsed: number
  onUseHint: () => void
  onSubmit: () => void
  onShowSolution: () => void
  isSubmitted: boolean
  className?: string
}

export function PlaygroundToolbar({
  hints,
  hintsUsed,
  onUseHint,
  onSubmit,
  onShowSolution,
  isSubmitted,
  className,
}: PlaygroundToolbarProps) {
  const remainingHints = hints.length - hintsUsed
  const currentHint = hintsUsed > 0 ? hints[hintsUsed - 1] : null

  return (
    <div className={cn('space-y-3', className)}>
      {currentHint && (
        <div className="bg-amber-900/20 border border-amber-800 rounded-lg p-3 text-sm text-amber-200">
          <span className="font-semibold text-amber-400">Dica {hintsUsed}: </span>
          {currentHint}
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        {remainingHints > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onUseHint}
            className="text-amber-400 hover:text-amber-300"
          >
            💡 Dica ({remainingHints} restante{remainingHints !== 1 ? 's' : ''}) −5 XP
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onShowSolution}
          className="text-gray-500 hover:text-gray-300"
        >
          Ver solução
        </Button>

        <div className="flex-1" />

        <Button
          onClick={onSubmit}
          disabled={isSubmitted}
          size="md"
        >
          {isSubmitted ? '✓ Submetido' : 'Submeter Desafio'}
        </Button>
      </div>
    </div>
  )
}
