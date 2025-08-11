import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const poets = pgTable("poets", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  urduName: text("urdu_name").notNull(),
  title: text("title").notNull(),
  urduTitle: text("urdu_title").notNull(),
  birthYear: integer("birth_year").notNull(),
  deathYear: integer("death_year"),
  biography: text("biography").notNull(),
  urduBiography: text("urdu_biography").notNull(),
  imageUrl: text("image_url"),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  urduName: text("urdu_name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
});

export const shayaris = pgTable("shayaris", {
  id: varchar("id").primaryKey(),
  poetId: varchar("poet_id").notNull().references(() => poets.id),
  categoryId: varchar("category_id").notNull().references(() => categories.id),
  text: text("text").notNull(),
  transliteration: text("transliteration"),
  translation: text("translation"),
  isFeatured: boolean("is_featured").default(false),
});

export const favorites = pgTable("favorites", {
  id: varchar("id").primaryKey(),
  shayariId: varchar("shayari_id").notNull().references(() => shayaris.id),
  createdAt: text("created_at").default(sql`datetime('now')`),
});

export const insertPoetSchema = createInsertSchema(poets);
export const insertCategorySchema = createInsertSchema(categories);
export const insertShayariSchema = createInsertSchema(shayaris);
export const insertFavoriteSchema = createInsertSchema(favorites).omit({ id: true, createdAt: true });

export type InsertPoet = z.infer<typeof insertPoetSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertShayari = z.infer<typeof insertShayariSchema>;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;

export type Poet = typeof poets.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Shayari = typeof shayaris.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;

export type ShayariWithPoet = Shayari & { poet: Poet; category: Category };
