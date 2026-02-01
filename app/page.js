import Link from 'next/link'
import fs from 'fs'
import path from 'path'

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
          <h1 className="text-5xl font-serif text-calm-text">Narratai</h1>
          <p className="text-xl text-calm-accent">
            Interactive storytelling, one line at a time
          </p>
        </header>

        <section className="space-y-6">
          <h2 className="text-2xl font-serif text-calm-text text-center">Library</h2>

          <div className="grid gap-6 sm:grid-cols-2">
            {stories.map(story => (
              <Link
                key={story.id}
                href={`/solo/${story.id}`}
                className="block rounded-lg overflow-hidden border border-calm-accent/20 hover:border-calm-accent/50 hover:shadow-md transition-all"
              >
                <div
                  className="h-40 bg-calm-accent/10 bg-cover bg-center"
                  style={story.coverImage ? { backgroundImage: `url(${story.coverImage})` } : {}}
                />
                <div className="p-5">
                  <h3 className="text-xl font-serif text-calm-text mb-1">
                    {story.title}
                  </h3>
                  <p className="text-sm text-calm-accent mb-3">
                    by {story.author}
                  </p>
                  <p className="text-calm-text/70 text-sm mb-4">
                    {story.description}
                  </p>
                  <p className="text-xs text-calm-accent">
                    {story.chapterCount} {story.chapterCount === 1 ? 'chapter' : 'chapters'}
                  </p>
                </div>
              </Link>
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
