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
export type LibraryPlatform =
  | 'Abandonware'
  | 'Epic'
  | 'GOG'
  | 'Microsoft'
  | 'Origin'
  | 'Steam'
  | 'Xbox'
  
export type LibraryCompletionStatus = 'Completed100' | 'CompletedAny' | 'InProgress' | 'NotStarted'

export interface LibraryGame {
  //id: string
  Title: string
  Platform: LibraryPlatform
  Completed: LibraryCompletionStatus
  //hoursPlayed?: number
  //lastPlayed?: Date
  //coverImage?: string
}

export interface LibraryCatalog {
  games: LibraryGame[]
}
