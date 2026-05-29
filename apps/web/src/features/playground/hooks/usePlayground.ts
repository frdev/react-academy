import { useState } from 'react'
import type { SandpackFiles } from '@codesandbox/sandpack-react'

interface UsePlaygroundOptions {
  initialFiles: SandpackFiles
  onSubmit?: (files: SandpackFiles) => void
}

export function usePlayground({ initialFiles, onSubmit }: UsePlaygroundOptions) {
  const [currentFiles, setCurrentFiles] = useState<SandpackFiles>(initialFiles)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleCodeChange = (files: SandpackFiles) => {
    setCurrentFiles(files)
  }

  const useHint = () => {
    setHintsUsed(prev => prev + 1)
  }

  const submit = () => {
    setIsSubmitted(true)
    onSubmit?.(currentFiles)
  }

  const reset = (files: SandpackFiles) => {
    setCurrentFiles(files)
    setIsSubmitted(false)
  }

  return {
    currentFiles,
    hintsUsed,
    isSubmitted,
    handleCodeChange,
    useHint,
    submit,
    reset,
  }
}
