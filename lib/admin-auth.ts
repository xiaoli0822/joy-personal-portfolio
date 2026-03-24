import "server-only"

import crypto from "crypto"
import { cookies } from "next/headers"

export const ADMIN_COOKIE_NAME = "portfolio_admin_session"

function getPasswordHash(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export function getExpectedAdminSession() {
  const password = process.env.ADMIN_PASSWORD
  if (!password) {
    return null
  }

  return getPasswordHash(password)
}

export function isPasswordValid(password: string) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) {
    return false
  }

  return password === expected
}

export function isAdminAuthenticated() {
  const expected = getExpectedAdminSession()
  if (!expected) {
    return false
  }

  const cookieStore = cookies()
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value === expected
}

export function getAdminCookieValue() {
  const expected = getExpectedAdminSession()
  if (!expected) {
    throw new Error("未配置 ADMIN_PASSWORD")
  }

  return expected
}
