import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  avatarUrl: text("avatar_url").default("").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  points: integer("points").default(0).notNull(),
  level: integer("level").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  avatarUrl: true,
  isAdmin: true,
});

// Card schema
export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // "Client", "Need", "Challenge", "Audience"
  promptText: text("prompt_text").notNull(),
  backContent: text("back_content").default("").notNull(),
  difficulty: text("difficulty").default("Beginner").notNull(), // "Beginner", "Intermediate", "Advanced"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCardSchema = createInsertSchema(cards).pick({
  category: true,
  promptText: true,
  backContent: true,
  difficulty: true,
});

// Design submissions schema
export const designs = pgTable("designs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  brief: text("brief").notNull(),
  cardIds: json("card_ids").notNull().$type<number[]>(),
  likes: integer("likes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDesignSchema = createInsertSchema(designs).pick({
  userId: true,
  title: true,
  imageUrl: true,
  brief: true,
  cardIds: true,
});

// Comments schema
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  designId: integer("design_id").notNull().references(() => designs.id),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  designId: true,
  userId: true,
  content: true,
});

// User progress and badges
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  requirement: text("requirement").notNull(),
  requiredCount: integer("required_count").notNull(),
});

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  badgeId: integer("badge_id").notNull().references(() => badges.id),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Card = typeof cards.$inferSelect;
export type InsertCard = z.infer<typeof insertCardSchema>;

export type Design = typeof designs.$inferSelect;
export type InsertDesign = z.infer<typeof insertDesignSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Badge = typeof badges.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;

// Categories and difficulty enums
export const CardCategory = {
  CLIENT: "Client",
  NEED: "Need",
  CHALLENGE: "Challenge",
  AUDIENCE: "Audience"
} as const;

export const DifficultyLevel = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced"
} as const;
