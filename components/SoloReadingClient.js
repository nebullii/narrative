'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ReadingScreen from './ReadingScreen'
import ChapterEnd from './ChapterEnd'
import { awardAchievement } from '@/lib/achievements'

export default function SoloReadingClient({ story }) {
  const router = useRouter()
  const [currentChapter, setCurrentChapter] = useState(0)
  const [currentParagraph, setCurrentParagraph] = useState(0)
  const [showChapterEnd, setShowChapterEnd] = useState(false)

  const saveProgress = () => {
    const progress = JSON.parse(localStorage.getItem('narratai-progress') || '{}')
    const chapterId = story.chapters[currentChapter].id

    if (!progress[story.id]) {
      progress[story.id] = {
        title: story.title,
        author: story.author,
        completedChapters: [],
        artifacts: [],
        reflections: {}
      }
    } else {
      if (!progress[story.id].title) progress[story.id].title = story.title
      if (!progress[story.id].author) progress[story.id].author = story.author
      if (!progress[story.id].completedChapters) progress[story.id].completedChapters = []
      if (!progress[story.id].artifacts) progress[story.id].artifacts = []
      if (!progress[story.id].reflections) progress[story.id].reflections = {}
    }

    if (!progress[story.id].completedChapters.includes(chapterId)) {
      progress[story.id].completedChapters.push(chapterId)
      progress[story.id].artifacts.push(story.chapters[currentChapter].artifact)
    }

    localStorage.setItem('narratai-progress', JSON.stringify(progress))
    return progress
  }

  const [earnedAchievements, setEarnedAchievements] = useState([])

  const handleNextChapter = (reflection) => {
    if (reflection) {
      const progress = JSON.parse(localStorage.getItem('narratai-progress') || '{}')
      const chapterId = story.chapters[currentChapter].id
      if (!progress[story.id]) {
        progress[story.id] = {
          title: story.title,
          author: story.author,
          completedChapters: [],
          artifacts: [],
          reflections: {}
        }
      }
      if (!progress[story.id].reflections) progress[story.id].reflections = {}
      progress[story.id].reflections[chapterId] = reflection
      localStorage.setItem('narratai-progress', JSON.stringify(progress))
    }

    if (currentChapter < story.chapters.length - 1) {
      setCurrentChapter(currentChapter + 1)
      setCurrentParagraph(0)
      setShowChapterEnd(false)
      setEarnedAchievements([])
    } else {
      router.push('/journal')
    }
  }

  if (showChapterEnd) {
    return (
      <ChapterEnd
        story={story}
        chapter={story.chapters[currentChapter]}
        onNext={handleNextChapter}
        isLastChapter={currentChapter === story.chapters.length - 1}
        currentChapterIndex={currentChapter}
        totalChapters={story.chapters.length}
        earnedAchievements={earnedAchievements}
      />
    )
  }

  const handleCompleteChapter = () => {
    setShowChapterEnd(true)
    const progress = saveProgress()

    const newlyEarned = []
    const chapterReward = awardAchievement('first_chapter')
    if (chapterReward) newlyEarned.push(chapterReward)

    const completedCount = progress?.[story.id]?.completedChapters?.length || 0
    if (completedCount >= 3) {
      const threeReward = awardAchievement('three_chapters')
      if (threeReward) newlyEarned.push(threeReward)
    }

    if (currentChapter === story.chapters.length - 1) {
      const storyReward = awardAchievement('first_story')
      if (storyReward) newlyEarned.push(storyReward)
    }

    setEarnedAchievements(newlyEarned)
  }

  return (
    <ReadingScreen
      story={story}
      chapter={story.chapters[currentChapter]}
      currentParagraph={currentParagraph}
      currentChapterIndex={currentChapter}
      totalChapters={story.chapters.length}
      onSelectParagraph={setCurrentParagraph}
      onCompleteChapter={handleCompleteChapter}
    />
  )
}
