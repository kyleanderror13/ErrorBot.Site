export interface StreakRecord {
  userName: string;
  streak: number;
  rank: number;
}

export interface StreakCatalog {
  records: StreakRecord[];
}