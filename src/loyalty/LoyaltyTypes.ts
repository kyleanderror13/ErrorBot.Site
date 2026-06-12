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