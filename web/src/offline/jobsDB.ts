import { openDB } from 'idb'

const DB_NAME = 'jobs-offline-db'
const STORE_NAME = 'jobs'

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME)
    }
  },
})

export async function saveJobs(jobs: unknown) {
  const db = await dbPromise
  await db.put(STORE_NAME, jobs, 'daily-jobs')
}

export async function getJobs() {
  const db = await dbPromise
  return db.get(STORE_NAME, 'daily-jobs')
}
