import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import SoloReadingClient from '@/components/SoloReadingClient'

// This is a Server Component - it reads the file directly
export default async function SoloReading({ params }) {
  const { storyId } = await params
  let story

  try {
    const filePath = path.join(process.cwd(), 'data', `${storyId}.json`)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    story = JSON.parse(fileContents)
  } catch (error) {
    notFound()
  }

  return <SoloReadingClient story={story} />
}
