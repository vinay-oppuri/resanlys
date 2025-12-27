import { pgTable, text, timestamp, boolean, uuid, jsonb, integer } from 'drizzle-orm/pg-core';

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const resumes = pgTable("resumes", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => user.id),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size"),
  rawText: text("raw_text"),
  parsedData: jsonb("parsed_data"),
  status: text("status").default("uploaded"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at"),
});


export const jobs = pgTable("jobs", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => user.id),
  resumeId: text("resume_id").references(() => resumes.id),
  title: text("title").notNull(),
  description: text("description"), // raw JD text

  // AI extracted JD structure
  parsedData: jsonb("parsed_data"),
  /*
    {
      requiredSkills: [],
      preferredSkills: [],
      experienceLevel: "",
      keywords: []
    }
  */

  enhancedData: jsonb("enhanced_data"),
  /*
    {
      missing_keywords: [],
      weak_or_underrepresented_skills: [],
      bullet_point_improvements: [
          {
          "original": "",
          "improved": ""
          }
      ],
      section_level_suggestions: [],
      overall_match_feedback: ""
    }
  */

  createdAt: timestamp("created_at").notNull(),
});


export const matches = pgTable("job_matches", {
  id: text("id").primaryKey(),

  resumeId: text("resume_id")
    .references(() => resumes.id)
    .notNull(),

  jobId: text("job_id")
    .references(() => jobs.id)
    .notNull(),

  score: integer("score").notNull(), // 0–100

  analysis: jsonb("analysis"),
  /*
    {
      matchedSkills: [],
      missingSkills: [],
      experienceMatch: "good | weak",
      keywordCoverage: 72,
      suggestions: []
    }
  */

  createdAt: timestamp("created_at").notNull(),
});