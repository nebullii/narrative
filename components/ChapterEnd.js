'use client'

export default function ChapterEnd({ chapter, onNext, isLastChapter, currentChapterIndex, totalChapters, earnedAchievements = [] }) {
  const [showArtifact, setShowArtifact] = useState(false)

  const normalizeArtifactUrl = (url) => {
    const map = {
      '/artifacts/story-garden.jpg': '/artifacts/story-garden.svg',
      '/artifacts/mary-arrival.jpg': '/artifacts/mary-arrival.svg'
    }
    return map[url] || url
  }

  const handleContinue = () => {
    onNext()
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full space-y-8">
        {/* Chapter complete message */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-serif text-calm-text">
            Chapter Complete
          </h2>
          <p className="text-calm-accent">
            You've unlocked a new artifact
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-calm-accent">
            <span>Chapter Progress</span>
            <span>{currentChapterIndex + 1} / {totalChapters}</span>
          </div>
          <div className="h-2 bg-calm-accent/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-calm-accent rounded-full"
              style={{ width: `${((currentChapterIndex + 1) / totalChapters) * 100}%` }}
            />
          </div>
        </div>

        {/* Artifact reveal */}
        {!showArtifact ? (
          <div className="text-center py-12">
            <button
              onClick={() => setShowArtifact(true)}
              className="px-12 py-4 bg-calm-accent text-white rounded-lg text-lg hover:bg-opacity-90 transition-all"
            >
              Reveal Artifact
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {earnedAchievements.length > 0 && (
              <div className="bg-white border border-calm-accent/30 rounded-lg p-4">
                <h3 className="text-lg font-serif text-calm-text mb-3">New Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {earnedAchievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3">
                      <img src={achievement.icon} alt={achievement.title} className="w-12 h-12" />
                      <div>
                        <p className="text-sm font-medium text-calm-text">{achievement.title}</p>
                        <p className="text-xs text-calm-accent">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rewards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-calm-accent/30 rounded-lg p-4 text-center">
                <img
                  src="/rewards/chapter-sticker.svg"
                  alt="Silver book sticker"
                  className="w-full h-28 object-contain"
                  loading="lazy"
                />
                <p className="text-sm text-calm-text mt-2">Silver Book</p>
              </div>
              <div className={`bg-white border border-calm-accent/30 rounded-lg p-4 text-center ${isLastChapter ? '' : 'opacity-40'}`}>
                <img
                  src="/rewards/story-badge.svg"
                  alt="Golden book badge"
                  className="w-full h-28 object-contain"
                  loading="lazy"
                />
                <p className="text-sm text-calm-text mt-2">Golden Book</p>
              </div>
              <div className={`bg-white border border-calm-accent/30 rounded-lg p-4 text-center ${isLastChapter ? '' : 'opacity-40'}`}>
                <img
                  src="/rewards/book-trophy.svg"
                  alt="Diamond book trophy"
                  className="w-full h-28 object-contain"
                  loading="lazy"
                />
                <p className="text-sm text-calm-text mt-2">Diamond Book</p>
              </div>
            </div>

            <div className="bg-calm-accent bg-opacity-10 rounded-lg p-6 text-center">
              <div className="w-full max-w-xl mx-auto overflow-hidden rounded-lg border border-calm-accent/30 bg-white">
                <img
                  src={normalizeArtifactUrl(chapter.artifact.url)}
                  alt={chapter.artifact.caption}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/artifacts/story-garden.svg'
                  }}
                />
              </div>
              <p className="text-calm-text italic mt-4">
                {chapter.artifact.caption}
              </p>
            </div>

            {/* Continue button */}
            <div className="text-center pt-4">
              <button
                onClick={handleContinue}
                className="px-12 py-4 bg-calm-accent text-white rounded-lg text-lg hover:bg-opacity-90 transition-all"
              >
                {isLastChapter ? 'View Journal' : 'Next Chapter'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
