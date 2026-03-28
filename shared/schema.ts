import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, serial, integer, real, jsonb, bigint } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";

export const gameSubmissions = pgTable("game_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  gameName: text("game_name").notNull(),
  description: text("description").notNull(),
  repoUrl: text("repo_url").notNull(),
  status: text("status").notNull().default("pending"),
  securityScore: integer("security_score"),
  fairnessScore: integer("fairness_score"),
  performanceScore: integer("performance_score"),
  uxScore: integer("ux_score"),
  codeQualityScore: integer("code_quality_score"),
  overallScore: integer("overall_score"),
  aiReview: text("ai_review"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGameSubmissionSchema = createInsertSchema(gameSubmissions).omit({
  id: true,
  createdAt: true,
  reviewedAt: true,
  securityScore: true,
  fairnessScore: true,
  performanceScore: true,
  uxScore: true,
  codeQualityScore: true,
  overallScore: true,
  aiReview: true,
  status: true,
});

export type InsertGameSubmission = z.infer<typeof insertGameSubmissionSchema>;
export type GameSubmission = typeof gameSubmissions.$inferSelect;

export const crashRounds = pgTable("crash_rounds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roundNumber: serial("round_number"),
  serverSeed: text("server_seed").notNull(),
  serverSeedHash: text("server_seed_hash").notNull(),
  crashPoint: text("crash_point"),
  totalBets: text("total_bets").default("0"),
  totalPayout: text("total_payout").default("0"),
  status: text("status").notNull().default("pending"),
  startedAt: timestamp("started_at"),
  crashedAt: timestamp("crashed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const crashBets = pgTable("crash_bets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roundId: text("round_id").notNull(),
  oderId: text("user_id").notNull(),
  username: text("username").notNull(),
  betAmount: text("bet_amount").notNull(),
  autoCashout: text("auto_cashout"),
  cashoutMultiplier: text("cashout_multiplier"),
  payout: text("payout"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gameChatMessages = pgTable("game_chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameType: text("game_type").notNull(),
  userId: text("user_id").notNull(),
  username: text("username").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const playerRewards = pgTable("player_rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  oderId: text("user_id").notNull(),
  pendingRewards: text("pending_rewards").notNull().default("0"),
  totalEarned: text("total_earned").notNull().default("0"),
  totalClaimed: text("total_claimed").notNull().default("0"),
  tier: text("tier").notNull().default("bronze"),
  totalWagered: text("total_wagered").notNull().default("0"),
  gamesPlayed: integer("games_played").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const gameAirdrops = pgTable("game_airdrops", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  poolAmount: text("pool_amount").notNull(),
  participantCount: integer("participant_count").notNull(),
  status: text("status").notNull().default("pending"),
  distributedAt: timestamp("distributed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CrashRound = typeof crashRounds.$inferSelect;
export type CrashBet = typeof crashBets.$inferSelect;
export type GameChatMessage = typeof gameChatMessages.$inferSelect;
export type PlayerRewards = typeof playerRewards.$inferSelect;
export type GameAirdrop = typeof gameAirdrops.$inferSelect;

// Signal Chat - Ecosystem Identity & Messaging
export const chatUsers = pgTable("chat_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull(),
  avatarColor: text("avatar_color").notNull().default("#06b6d4"),
  role: text("role").notNull().default("member"),
  trustLayerId: text("trust_layer_id").unique(),
  isOnline: boolean("is_online").default(false),
  lastSeen: timestamp("last_seen").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatChannels = pgTable("chat_channels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  category: text("category").notNull().default("ecosystem"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  channelId: varchar("channel_id").notNull().references(() => chatChannels.id),
  userId: varchar("user_id").notNull().references(() => chatUsers.id),
  content: text("content").notNull(),
  replyToId: varchar("reply_to_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertChatUserSchema = createInsertSchema(chatUsers).omit({ id: true, isOnline: true, lastSeen: true, createdAt: true });
export const insertChatChannelSchema = createInsertSchema(chatChannels).omit({ id: true, createdAt: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, createdAt: true });

export type ChatUser = typeof chatUsers.$inferSelect;
export type InsertChatUser = z.infer<typeof insertChatUserSchema>;
export type ChatChannel = typeof chatChannels.$inferSelect;
export type InsertChatChannel = z.infer<typeof insertChatChannelSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

// Player Gaming Stats - Complete History
export const playerGameHistory = pgTable("player_game_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  username: text("username").notNull(),
  gameType: text("game_type").notNull(), // crash, coinflip, slots
  betAmount: text("bet_amount").notNull(),
  multiplier: text("multiplier"), // for crash
  payout: text("payout").notNull(),
  profit: text("profit").notNull(), // can be negative
  outcome: text("outcome").notNull(), // win, loss, push
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPlayerGameHistorySchema = createInsertSchema(playerGameHistory).omit({
  id: true,
  createdAt: true,
});

export type InsertPlayerGameHistory = z.infer<typeof insertPlayerGameHistorySchema>;
export type PlayerGameHistory = typeof playerGameHistory.$inferSelect;

// Player Stats Summary - Aggregated data
export const playerStats = pgTable("player_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().unique(),
  username: text("username").notNull(),
  totalGamesPlayed: integer("total_games_played").notNull().default(0),
  totalWagered: text("total_wagered").notNull().default("0"),
  totalWon: text("total_won").notNull().default("0"),
  totalLost: text("total_lost").notNull().default("0"),
  netProfit: text("net_profit").notNull().default("0"),
  winCount: integer("win_count").notNull().default(0),
  lossCount: integer("loss_count").notNull().default(0),
  winRate: text("win_rate").notNull().default("0"),
  bestMultiplier: text("best_multiplier").notNull().default("0"),
  currentStreak: integer("current_streak").notNull().default(0),
  bestStreak: integer("best_streak").notNull().default(0),
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
  xpToNextLevel: integer("xp_to_next_level").notNull().default(100),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  lastPlayedAt: timestamp("last_played_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPlayerStatsSchema = createInsertSchema(playerStats).omit({
  id: true,
  joinedAt: true,
  updatedAt: true,
});

export type InsertPlayerStats = z.infer<typeof insertPlayerStatsSchema>;
export type PlayerStats = typeof playerStats.$inferSelect;

// Daily Profit Tracking for Charts
export const playerDailyProfit = pgTable("player_daily_profit", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  gamesPlayed: integer("games_played").notNull().default(0),
  wagered: text("wagered").notNull().default("0"),
  profit: text("profit").notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PlayerDailyProfit = typeof playerDailyProfit.$inferSelect;

// ============================================
// SWEEPSTAKES SYSTEM (GC/SC)
// ============================================

// User sweepstakes balances
export const sweepsBalances = pgTable("sweeps_balances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().unique(),
  goldCoins: text("gold_coins").notNull().default("0"), // Purchased, no cash value
  sweepsCoins: text("sweeps_coins").notNull().default("0"), // Free bonus, redeemable
  totalGcPurchased: text("total_gc_purchased").notNull().default("0"),
  totalScEarned: text("total_sc_earned").notNull().default("0"),
  totalScRedeemed: text("total_sc_redeemed").notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSweepsBalanceSchema = createInsertSchema(sweepsBalances).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type SweepsBalance = typeof sweepsBalances.$inferSelect;
export type InsertSweepsBalance = z.infer<typeof insertSweepsBalanceSchema>;

// Coin pack purchases
export const sweepsPurchases = pgTable("sweeps_purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  packId: text("pack_id").notNull(), // starter, value, mega, whale
  packName: text("pack_name").notNull(),
  priceUsd: text("price_usd").notNull(),
  goldCoinsAmount: text("gold_coins_amount").notNull(),
  sweepsCoinsBonus: text("sweeps_coins_bonus").notNull(), // Free SC included
  stripePaymentId: text("stripe_payment_id"),
  status: text("status").notNull().default("pending"), // pending, completed, failed, refunded
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSweepsPurchaseSchema = createInsertSchema(sweepsPurchases).omit({
  id: true,
  createdAt: true,
});

export type SweepsPurchase = typeof sweepsPurchases.$inferSelect;
export type InsertSweepsPurchase = z.infer<typeof insertSweepsPurchaseSchema>;

// Free SC bonuses (daily login, social, AMOE)
export const sweepsBonuses = pgTable("sweeps_bonuses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  bonusType: text("bonus_type").notNull(), // daily_login, social_share, amoe_mail, signup, streak
  sweepsCoinsAmount: text("sweeps_coins_amount").notNull(),
  goldCoinsAmount: text("gold_coins_amount").notNull().default("0"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSweepsBonusSchema = createInsertSchema(sweepsBonuses).omit({
  id: true,
  createdAt: true,
});

export type SweepsBonus = typeof sweepsBonuses.$inferSelect;
export type InsertSweepsBonus = z.infer<typeof insertSweepsBonusSchema>;

// Daily login tracking
export const sweepsDailyLogin = pgTable("sweeps_daily_login", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  loginDate: text("login_date").notNull(), // YYYY-MM-DD
  streakDay: integer("streak_day").notNull().default(1), // 1-7 for weekly streak
  bonusClaimed: boolean("bonus_claimed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SweepsDailyLogin = typeof sweepsDailyLogin.$inferSelect;

// SC Redemptions to SIG
export const sweepsRedemptions = pgTable("sweeps_redemptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  sweepsCoinsAmount: text("sweeps_coins_amount").notNull(),
  dwcAmount: text("dwc_amount").notNull(), // 1:1 conversion
  walletAddress: text("wallet_address").notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, completed, rejected
  kycVerified: boolean("kyc_verified").notNull().default(false),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSweepsRedemptionSchema = createInsertSchema(sweepsRedemptions).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

export type SweepsRedemption = typeof sweepsRedemptions.$inferSelect;
export type InsertSweepsRedemption = z.infer<typeof insertSweepsRedemptionSchema>;

// Game history for sweeps (tracks which currency used)
export const sweepsGameHistory = pgTable("sweeps_game_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  gameType: text("game_type").notNull(), // crash, coinflip, slots
  currencyType: text("currency_type").notNull(), // gc or sc
  betAmount: text("bet_amount").notNull(),
  multiplier: text("multiplier"),
  payout: text("payout").notNull(),
  profit: text("profit").notNull(),
  outcome: text("outcome").notNull(), // win, loss
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSweepsGameHistorySchema = createInsertSchema(sweepsGameHistory).omit({
  id: true,
  createdAt: true,
});

export type SweepsGameHistory = typeof sweepsGameHistory.$inferSelect;
export type InsertSweepsGameHistory = z.infer<typeof insertSweepsGameHistorySchema>;

// Coin pack definitions (not stored in DB, just types)
export const coinPackSchema = z.object({
  id: z.string(),
  name: z.string(),
  priceUsd: z.number(),
  goldCoins: z.number(),
  sweepsCoinsBonus: z.number(),
  popular: z.boolean().optional(),
  bestValue: z.boolean().optional(),
});

export type CoinPack = z.infer<typeof coinPackSchema>;

// ==================== SPADES CARD GAME ====================

// Spades games table
export const spadesGames = pgTable("spades_games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  status: text("status").notNull().default("waiting"), // waiting, bidding, playing, finished
  gameMode: text("game_mode").notNull().default("vs_ai"), // vs_ai, multiplayer
  difficulty: text("difficulty").default("medium"), // easy, medium, hard (for AI games)
  targetScore: integer("target_score").notNull().default(500),
  currentRound: integer("current_round").notNull().default(1),
  currentTrick: integer("current_trick").notNull().default(1),
  currentPlayerIndex: integer("current_player_index").notNull().default(0),
  leadSuit: text("lead_suit"), // current trick's lead suit
  spadesbroken: boolean("spades_broken").notNull().default(false),
  team1Score: integer("team1_score").notNull().default(0),
  team2Score: integer("team2_score").notNull().default(0),
  team1Bags: integer("team1_bags").notNull().default(0),
  team2Bags: integer("team2_bags").notNull().default(0),
  team1RoundTricks: integer("team1_round_tricks").notNull().default(0),
  team2RoundTricks: integer("team2_round_tricks").notNull().default(0),
  team1Bid: integer("team1_bid"),
  team2Bid: integer("team2_bid"),
  cardsPlayed: text("cards_played").default("[]"), // JSON array of played cards in current trick
  winnerId: text("winner_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSpadesGameSchema = createInsertSchema(spadesGames).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type SpadesGame = typeof spadesGames.$inferSelect;
export type InsertSpadesGame = z.infer<typeof insertSpadesGameSchema>;

// Spades players in a game
export const spadesPlayers = pgTable("spades_players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameId: varchar("game_id").notNull(),
  oderId: text("user_id"), // null for AI players
  playerName: text("player_name").notNull(),
  isAI: boolean("is_ai").notNull().default(false),
  seatPosition: integer("seat_position").notNull(), // 0-3 (0=South/you, 1=West, 2=North/partner, 3=East)
  teamNumber: integer("team_number").notNull(), // 1 or 2 (positions 0,2 = team1, positions 1,3 = team2)
  hand: text("hand").default("[]"), // JSON array of cards
  bid: integer("bid"),
  tricksWon: integer("tricks_won").notNull().default(0),
  isConnected: boolean("is_connected").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSpadesPlayerSchema = createInsertSchema(spadesPlayers).omit({
  id: true,
  createdAt: true,
});

export type SpadesPlayer = typeof spadesPlayers.$inferSelect;
export type InsertSpadesPlayer = z.infer<typeof insertSpadesPlayerSchema>;

// Spades player stats (lifetime)
export const spadesStats = pgTable("spades_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  oderId: text("user_id").notNull().unique(),
  gamesPlayed: integer("games_played").notNull().default(0),
  gamesWon: integer("games_won").notNull().default(0),
  totalBids: integer("total_bids").notNull().default(0),
  bidsMade: integer("bids_made").notNull().default(0),
  nilBidsAttempted: integer("nil_bids_attempted").notNull().default(0),
  nilBidsSuccessful: integer("nil_bids_successful").notNull().default(0),
  blindNilsAttempted: integer("blind_nils_attempted").notNull().default(0),
  blindNilsSuccessful: integer("blind_nils_successful").notNull().default(0),
  totalBags: integer("total_bags").notNull().default(0),
  highestScore: integer("highest_score").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSpadesStatsSchema = createInsertSchema(spadesStats).omit({
  id: true,
  updatedAt: true,
});

export type SpadesStats = typeof spadesStats.$inferSelect;
export type InsertSpadesStats = z.infer<typeof insertSpadesStatsSchema>;

export const cardSchema = z.object({
  suit: z.enum(["spades", "hearts", "diamonds", "clubs"]),
  rank: z.enum(["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]),
});

export type Card = z.infer<typeof cardSchema>;
