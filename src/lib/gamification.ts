/**
 * Gamification Utility for HuyBoon PlayHub
 * Maps XP logic and Level titles to the RPG-style experience.
 */

export const getLevelTitle = (level: number) => {
  if (level >= 100) return "Lore Master"
  if (level >= 50) return "Grandmaster of Lore"
  if (level >= 21) return "Mythic Legend"
  if (level >= 11) return "Elite Hero"
  if (level >= 6) return "Brave Adventurer"
  return "Novice Explorer"
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
