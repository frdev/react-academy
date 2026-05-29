import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgressStore } from '../store/progressStore'
import { ACHIEVEMENT_DEFINITIONS } from '../types'

// We track the last seen achievements to detect new ones
export function AchievementToast() {
  const achievements = useProgressStore(state => state.achievements)
  const [visible, setVisible] = useState<{ id: string; title: string; icon: string } | null>(null)
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    for (const achievement of achievements) {
      if (!seenIds.has(achievement.id)) {
        const definition = ACHIEVEMENT_DEFINITIONS.find(d => d.id === achievement.id)
        if (definition) {
          setVisible({ id: achievement.id, title: definition.title, icon: definition.icon })
          setSeenIds(prev => new Set([...prev, achievement.id]))
          // Auto-dismiss after 3 seconds
          setTimeout(() => setVisible(null), 3000)
          break // Show one at a time
        }
      }
    }
  }, [achievements, seenIds])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={visible.id}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 border border-yellow-700 rounded-xl px-5 py-4 shadow-2xl"
        >
          <span className="text-3xl">{visible.icon}</span>
          <div>
            <p className="text-xs text-yellow-500 font-semibold uppercase tracking-wider">Conquista desbloqueada!</p>
            <p className="text-white font-semibold">{visible.title}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
