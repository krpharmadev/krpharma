import { pgTable, text, timestamp, integer, primaryKey, unique } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  lineUserId: text('line_user_id'),
  role: text('role').default('user'),
  password: text('password'),
});

export const accounts = pgTable('accounts', {
  // ลบ id ออกทั้งหมด หรือหากต้องการเก็บไว้ให้ใช้แบบธรรมดา
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  expiresAt: integer('expires_at'),
  tokenType: text('token_type'),
  scope: text('scope'),
  idToken: text('id_token'),
  sessionState: text('session_state'),
}, (table) => {
  return {
    compoundKey: primaryKey(table.provider, table.providerAccountId),
  };
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sessionToken: text('session_token').notNull().unique(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (table) => {
  return {
    compoundKey: primaryKey(table.identifier, table.token),
  };
});

// สร้างตารางอื่นๆ ตามที่ NextAuth ต้องการ: sessions, verification_tokens
// และตารางเพิ่มเติมตามความต้องการทางธุรกิจของคุณ