export interface Hunt {
  id: string;
  type: 'subscriber_count' | 'user_activity' | 'post_content' | 'cross_subreddit';
  difficulty: 'easy' | 'medium' | 'hard';
  title: string;
  description: string;
  challenge: string;
  points: number;
  hints: string[];
  isActive: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface Key {
  id: string;
  type: 'explorer' | 'collaborator' | 'creator';
  huntId: string;
  playerId: string;
  collectedAt: Date;
  points: number;
}

export interface Player {
  id: string;
  username: string;
  totalKeys: number;
  totalScore: number;
  currentStreak: number;
  keysCollected: {
    explorer: number;
    collaborator: number;
    creator: number;
  };
  lastActiveAt: Date;
  createdAt: Date;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  keys: number;
  score: number;
  streak: number;
}

export interface TreasureGodMessage {
  id: string;
  message: string;
  type: 'welcome' | 'success' | 'failure' | 'hint' | 'encouragement';
  timestamp: Date;
}

export interface GameStats {
  totalHunts: number;
  activeHunts: number;
  totalPlayers: number;
  keysCollectedToday: number;
}

