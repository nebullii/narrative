// Authentication utilities - JWT & password hashing

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '7d'
const COOKIE_NAME = 'auth-token'

// Hash password
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10)
}

// Verify password
export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Set auth cookie
export async function setAuthCookie(userId) {
  const token = generateToken(userId)
  const cookieStore = await cookies()

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return token
}

// Clear auth cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

// Get current user ID from cookie
export async function getCurrentUserId() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) return null

  const payload = verifyToken(token)
  return payload?.userId || null
}

// Middleware helper to require authentication
export async function requireAuth() {
  const userId = await getCurrentUserId()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  return userId
}
