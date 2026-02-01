const STORAGE_KEY = 'narratai-achievements'

export const ACHIEVEMENTS = {
  first_recording: {
    id: 'first_recording',
    title: 'First Voice',
    description: 'You recorded your first narration.',
    icon: '/achievements/first-voice.svg'
  },
  first_chapter: {
    id: 'first_chapter',
    title: 'Chapter Spark',
    description: 'You completed your first chapter.',
    icon: '/achievements/chapter-spark.svg'
  },
  three_chapters: {
    id: 'three_chapters',
    title: 'Three Chapters',
    description: 'You completed three chapters.',
    icon: '/achievements/three-chapters.svg'
  },
  first_story: {
    id: 'first_story',
    title: 'Story Finished',
    description: 'You completed a whole story.',
    icon: '/achievements/story-finished.svg'
  }
}

export function getAchievements() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function awardAchievement(id) {
  const achievement = ACHIEVEMENTS[id]
  if (!achievement) return null

  const current = getAchievements()
  if (current.find((item) => item.id === id)) return null

  const earned = {
    ...achievement,
    earnedAt: new Date().toISOString()
  }
  const next = [...current, earned]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return earned
}
