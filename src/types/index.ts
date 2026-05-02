// Loyalty types
export interface LoyaltyChatter {
  username: string
  points: number
  watchTime?: number  // in minutes
  lastSeen?: string   // ISO date string
  rank?: number
}

export interface LoyaltyData {
  chatters: LoyaltyChatter[]
}

// No-Hit Run types
export interface NoHitBoss {
  name: string
  defeated: boolean
  attempts: number
  timestamp?: string
}

export interface NoHitSession {
  date: string          // ISO date string
  duration: number      // minutes
  deaths: number
  bossesDefeated: number
  notes?: string
}

export interface NoHitRun {
  id: string
  game: string
  category: string
  status: 'active' | 'completed' | 'failed'
  startDate: string
  endDate?: string
  bosses: NoHitBoss[]
  sessions: NoHitSession[]
  coverImage?: string
}

export interface NoHitData {
  runs: NoHitRun[]
}

// Game Library types
export type Platform =
  | 'PC'
  | 'PlayStation 5'
  | 'PlayStation 4'
  | 'Xbox Series X'
  | 'Xbox One'
  | 'Nintendo Switch'
  | 'Game Boy'
  | 'Other'

export type CompletionStatus = 'completed' | 'in-progress' | 'not-started' | 'abandoned'

export interface Game {
  id: string
  title: string
  platform: Platform
  completionStatus: CompletionStatus
  genre?: string
  releaseYear?: number
  hoursPlayed?: number
  rating?: number       // 1–10
  notes?: string
  coverImage?: string
}

export interface GameLibraryData {
  games: Game[]
}
