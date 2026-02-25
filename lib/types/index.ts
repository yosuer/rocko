export type Role = 'user' | 'admin';
export type VoteType = 'skip' | 'up';
export type QueueStatus = 'pending' | 'playing' | 'played' | 'skipped';
export type TransactionType = 'purchase' | 'spend' | 'admin_credit' | 'refund';

export interface User {
  id: string;
  email: string;
  username: string;
  credits: number;
  role: Role;
  is_banned: boolean;
  created_at: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  youtube_url: string;
  youtube_id: string;
  thumbnail: string | null;
  duration: number | null;
  genre: string | null;
  lyrics: string | null;
  /** Desplazamiento en segundos: positivo = retrasar letra (si se adelanta) */
  lyrics_offset: number;
  plays_count: number;
  created_at: string;
  created_by: string | null;
}

export interface QueueItem {
  id: string;
  song_id: string;
  song: Song;
  requested_by: string | null;
  requester: Pick<User, 'id' | 'username'> | null;
  position: number;
  votes_skip: number;
  votes_up: number;
  status: QueueStatus;
  created_at: string;
  user_vote?: VoteType | null;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  description: string | null;
  created_at: string;
}

export interface Vote {
  id: string;
  user_id: string;
  queue_id: string;
  vote_type: VoteType;
  created_at: string;
}

export const QUEUE_COST = 5;
export const SKIP_THRESHOLD = 0.6;
export const INITIAL_CREDITS = 50;
