import { useParams } from 'react-router'
import { useInitProgress } from '@/features/progress/hooks/useProgress'
import { LessonLayout } from './components/LessonLayout'
import { TheoryReader } from './components/TheoryReader'
import { QuizRunner } from './components/QuizRunner'
import { CompletionScreen } from './components/CompletionScreen'

export default function LessonPage() {
  const { stackId } = useParams<{ stackId: string }>()
  useInitProgress(stackId)
  return <LessonLayout />
}

export { TheoryReader, QuizRunner, CompletionScreen }
export { ChallengePad } from './components/ChallengePad'
