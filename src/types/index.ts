// Loyalty types
export interface LoyaltyCatalog {
  currentPeriodName: string
  users: LoyaltyUser[]
}

export interface LoyaltyUser {
  userName: string
  totalPeriod: LoyaltyPeriod
  currentPeriod: LoyaltyPeriod
}

export interface LoyaltyPeriod {
  rank: number
  tie: boolean
  firsts: number
  seconds: number
  checkIns: number
  points: number
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
  
export type LibraryCompletionStatus = 'completed-100' | 'completed-any' | 'in-progress' | 'not-started'

export interface LibraryGame {
  title: string
  platform: LibraryPlatform
  completed: LibraryCompletionStatus
}

export interface LibraryCatalog {
  games: LibraryGame[]
}
