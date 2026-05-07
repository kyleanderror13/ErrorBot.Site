export interface LoyaltyCatalog {
  periods: LoyaltyCatalogPeriod[];
}

export interface LoyaltyCatalogPeriod {
  id: string;
  name: string;
}

export interface LoyaltyPeriod {
  name: string;
  users: LoyaltyPeriodUser[];
}

export interface LoyaltyPeriodUser {
  userName: string;
  rank: number;
  tie: boolean;
  firsts: number;
  seconds: number;
  checkIns: number;
  points: number;
}

export interface NoHitCatalog {
  runs: NoHitCatalogRun[];
}

export interface NoHitCatalogRun {
  id: string;
  game: string;
  category: string;
  status: 'Active' | 'Completed' | 'Paused' | 'NotStarted';
  attempts: number;
  hitPB? : number;
  distancePB?: number;
  distancePBSplitName?: string;
  coverImage?: string;
  runLink?: string;
}

export interface NoHitSummary {
  splits: NoHitSummarySplit[];
}

export interface NoHitSummarySplit {
  name: string;
  resets: number;
  successRate: number;
  averageHits: number;
  totalHits: number;
  successAttempts: number;
  totalAttempts: number;
  disabled: boolean;
}

export interface NoHitCompleted {
  runs: NoHitCompletedRun[];
}

export interface NoHitCompletedRun {
  attempt: number;
  date: Date;
  hits: number;
}

export interface NoHitLog {
  runs: NoHitLogRun[];
}

export interface NoHitLogRun {
  attempt: number;
  date: Date; // date of the run
  hits: number;
  progress: number; // percentage of run completed
  resetSplitName?: string;
  pb: boolean;
  distance: boolean;
  distanceSplitName?: string;
}

// Game Library types
export type LibraryPlatform =
  | 'Abandonware'
  | 'Epic'
  | 'GOG'
  | 'Microsoft'
  | 'Origin'
  | 'Steam'
  | 'Xbox';
  
export type LibraryCompletionStatus = 'completed-100' | 'completed-any' | 'in-progress' | 'not-started';

export interface LibraryGame {
  title: string;
  platform: LibraryPlatform;
  completed: LibraryCompletionStatus;
}

export interface LibraryCatalog {
  games: LibraryGame[];
}

export interface LinearRegressionPoint {
  x: number;
  y: number;
}