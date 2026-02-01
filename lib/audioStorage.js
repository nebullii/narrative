// IndexedDB utility for storing audio recordings

const DB_NAME = 'narratai-audio'
const STORE_NAME = 'recordings'
const DB_VERSION = 1

// Open/create database
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

// Save audio blob
export async function saveAudio(key, audioBlob) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(audioBlob, key)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// Get audio blob
export async function getAudio(key) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(key)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Delete audio
export async function deleteAudio(key) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(key)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// Get all recordings
export async function getAllRecordings() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAllKeys()

    request.onsuccess = async () => {
      const keys = request.result
      const recordings = []
      for (const key of keys) {
        const blob = await getAudio(key)
        recordings.push({ key, blob })
      }
      resolve(recordings)
    }
    request.onerror = () => reject(request.error)
  })
}

// Clear all recordings
export async function clearAllRecordings() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.clear()

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}
