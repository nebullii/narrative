import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import BookCard from '@/components/BookCard'

function getStories() {
  const dataDir = path.join(process.cwd(), 'data')
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'))

  return files.map(file => {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf-8')
    const story = JSON.parse(content)
    return {
      id: story.id,
      title: story.title,
      author: story.author,
      description: story.description,
      coverImage: story.coverImage || null,
      chapterCount: story.chapters?.length || 0
    }
  })
}

export default function Home() {
  const stories = getStories()

  return (
    <main className="relative min-h-screen overflow-hidden px-3 py-6 md:px-6 md:py-10 bg-[radial-gradient(circle_at_top,#f9efe1_0%,#f2e5d5_55%,#e9d9c5_100%)]">
      <div className="pointer-events-none absolute -top-24 left-[-10%] h-72 w-72 rounded-full bg-[radial-gradient(circle,#f6d8a5_0%,rgba(246,216,165,0)_70%)] opacity-70" />
      <div className="pointer-events-none absolute -bottom-36 right-[-12%] h-96 w-96 rounded-full bg-[radial-gradient(circle,#c1d7d2_0%,rgba(193,215,210,0)_70%)] opacity-70" />
      <div className="relative w-full space-y-6 md:space-y-10">
        <header className="rounded-2xl md:rounded-3xl border border-calm-accent/40 bg-white/75 p-5 md:p-8 shadow-[0_30px_70px_-55px_rgba(43,26,18,0.6)] backdrop-blur">
          <div className="flex flex-col items-center gap-3 md:gap-4 text-center">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-calm-accent">
              Read Aloud & Record
            </p>
            <h1 className="text-4xl md:text-6xl font-['Cormorant_Garamond'] font-semibold text-calm-text">
              StoryVoice
            </h1>
            <p className="text-base md:text-lg text-calm-text/70">
              Practice your reading aloud, or record bedtime stories to share with your little ones.
            </p>
            <div className="mt-1 md:mt-2 inline-flex flex-wrap justify-center items-center gap-2 md:gap-3 rounded-full border border-calm-accent/40 bg-white px-4 py-2 text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] text-calm-accent">
              Practice reading • Record for kids • Download & share
            </div>
          </div>
        </header>

        <section className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-3xl font-['Cormorant_Garamond'] font-semibold text-calm-text">
              Books
            </h2>
            <Link
              href="/journal"
              className="inline-flex items-center gap-2 rounded-full border border-calm-accent/60 bg-white px-4 py-2 text-xs md:text-sm font-semibold uppercase tracking-[0.15em] md:tracking-[0.25em] text-calm-accent transition-all hover:bg-calm-accent hover:text-white"
            >
              My Recordings
            </Link>
          </div>

          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map(story => (
              <BookCard key={story.id} story={story} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
