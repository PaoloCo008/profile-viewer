import * as fs from 'fs'
import { User } from '../src/lib/types/global'

async function setupDatabase(): Promise<void> {
  if (fs.existsSync('./db.json')) {
    console.log('db.json already exists, skipping setup')
    return
  }

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const users = await response.json()

    const initialUsers = users.map((user: User) => ({
      ...user,
      createdAt: new Date().toISOString(), // Same timestamp for all
    }))

    const db = {
      users: initialUsers,
    }

    fs.writeFileSync('./db.json', JSON.stringify(db, null, 2))
    console.log('db.json created ')
  } catch (error) {
    console.error('Error:', error)
  }
}

setupDatabase()
