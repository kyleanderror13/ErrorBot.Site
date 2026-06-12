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