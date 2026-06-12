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
  distancePBClipLink?: string;
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
  recentSuccessRate: number;
  averageHits: number;
  totalHits: number;
  successAttempts: number;
  totalAttempts: number;
  disabled: boolean;
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