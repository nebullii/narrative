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
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-serif text-calm-text">NarratAi</h1>
          <p className="text-xl text-calm-accent">
            Interactive storytelling
          </p>
        </header>

        <section className="space-y-6">
          <h2 className="text-2xl font-serif text-calm-text text-center">Books</h2>

          <div className="grid gap-6 sm:grid-cols-2">
            {stories.map(story => (
              <BookCard key={story.id} story={story} />
            ))}
          </div>
        </section>

        <div className="text-center pt-4">
          <Link
            href="/journal"
            className="inline-block px-8 py-3 border-2 border-calm-accent text-calm-accent rounded-lg hover:bg-calm-accent hover:text-white transition-all"
          >
            View Journal
          </Link>
        </div>
      </div>
    </main>
  )
}
