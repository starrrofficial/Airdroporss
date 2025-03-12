import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const airdrops = pgTable("airdrops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo").notNull(),
  description: text("description").notNull(),
  deadline: timestamp("deadline").notNull(),
  reward: text("reward").notNull(),
  isFeatured: boolean("is_featured").default(false),
  platform: text("platform").notNull(),
  totalValue: text("total_value").notNull(),
  joinLink: text("join_link").notNull(),
  steps: text("steps").array().notNull(),
  status: text("status").notNull().default("unconfirmed"),
});

export const claimedAirdrops = pgTable("claimed_airdrops", {
  id: serial("id").primaryKey(),
  airdropId: serial("airdrop_id").references(() => airdrops.id),
  status: text("status").notNull(),
  claimedAt: timestamp("claimed_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  parentId: integer("parent_id").references(() => comments.id),
  likes: integer("likes").default(0),
  moderationStatus: text("moderation_status").notNull().default("pending"),
  moderationFlags: text("moderation_flags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const commentLikes = pgTable("comment_likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  commentId: integer("comment_id").references(() => comments.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const verificationTokens = pgTable("verification_tokens", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAirdropSchema = createInsertSchema(airdrops).omit({ id: true });
export const insertClaimedAirdropSchema = createInsertSchema(claimedAirdrops).omit({ id: true });

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, isVerified: true });
export const insertCommentSchema = createInsertSchema(comments).omit({ 
  id: true, 
  createdAt: true, 
  likes: true,
  moderationStatus: true,
  moderationFlags: true 
});
export const insertCommentLikeSchema = createInsertSchema(commentLikes).omit({ id: true, createdAt: true });
export const insertVerificationTokenSchema = createInsertSchema(verificationTokens).omit({ id: true, createdAt: true });

export type Airdrop = typeof airdrops.$inferSelect;
export type InsertAirdrop = z.infer<typeof insertAirdropSchema>;
export type ClaimedAirdrop = typeof claimedAirdrops.$inferSelect;
export type InsertClaimedAirdrop = z.infer<typeof insertClaimedAirdropSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type CommentLike = typeof commentLikes.$inferSelect;
export type InsertCommentLike = z.infer<typeof insertCommentLikeSchema>;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type InsertVerificationToken = z.infer<typeof insertVerificationTokenSchema>;