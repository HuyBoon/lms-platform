/**
 * Gamification Utility for HuyBoon PlayHub
 * Maps XP logic and Level titles to the RPG-style experience.
 */
export const getLevelTitle = (level: number) => {
  if (level >= 100) return "Bậc thầy Tri thức"
  if (level >= 50) return "Đại Sư Tri thức"
  if (level >= 21) return "Huyền thoại Thần thoại"
  if (level >= 11) return "Anh hùng Ưu tú"
  if (level >= 6) return "Chiến binh Quả cảm"
  return "Nhà Thám hiểm Mới"
}

/**
 * Level Formula: Total XP for Level n = 50 * n * (n - 1)
 * This formula provides an increasing challenge for each level.
 * Level n = floor((1 + sqrt(1 + 0.08 * xp)) / 2)
 */
export const calculateLevel = (xp: number) => {
  if (xp <= 0) return 1
  return Math.floor((1 + Math.sqrt(1 + 0.08 * xp)) / 2)
}

/**
 * Calculates XP progress percentage for the current level.
 */
export const calculateXPProgress = (xp: number, level: number) => {
  const currentLevelTotalXp = 50 * level * (level - 1)
  const nextLevelTotalXp = 50 * (level + 1) * level
  const xpInCurrentLevel = xp - currentLevelTotalXp
  const xpRequiredForNextLevel = nextLevelTotalXp - currentLevelTotalXp
  
  return {
    progress: Math.min(Math.max((xpInCurrentLevel / xpRequiredForNextLevel) * 100, 0), 100),
    current: Math.round(xpInCurrentLevel),
    required: xpRequiredForNextLevel
  }
}
