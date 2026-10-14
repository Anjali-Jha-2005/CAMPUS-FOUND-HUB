/**
 * Smart matching algorithm for Lost & Found items.
 * Compares lost items against found items and returns match scores.
 */

function tokenize(str) {
  return (str || '').toLowerCase().split(/[\s,./\-_]+/).filter(t => t.length > 2)
}

function commonTokens(a, b) {
  const setA = new Set(tokenize(a))
  const setB = new Set(tokenize(b))
  let count = 0
  setA.forEach(t => { if (setB.has(t)) count++ })
  return count
}

export function computeMatchScore(lostItem, foundItem) {
  let score = 0
  let reasons = []

  // Category match — strongest signal (40 pts)
  if (lostItem.category === foundItem.category) {
    score += 40
    reasons.push('Same category')
  }

  // Location match (20 pts exact, 10 pts partial)
  if (lostItem.location === foundItem.location) {
    score += 20
    reasons.push('Same location')
  } else if (commonTokens(lostItem.location, foundItem.location) > 0) {
    score += 10
    reasons.push('Nearby location')
  }

  // Date proximity (max 15 pts — within 7 days)
  const lostDate = lostItem.date ? new Date(lostItem.date).getTime() : null
  const foundDate = foundItem.date ? new Date(foundItem.date).getTime() : null

  if (lostDate && foundDate && !isNaN(lostDate) && !isNaN(foundDate)) {
    const daysDiff = Math.abs(lostDate - foundDate) / (1000 * 60 * 60 * 24)
    if (daysDiff <= 1) {
      score += 15
      reasons.push('Same day')
    } else if (daysDiff <= 3) {
      score += 10
      reasons.push('Within 3 days')
    } else if (daysDiff <= 7) {
      score += 5
      reasons.push('Within a week')
    }
  }

  // Title similarity (max 15 pts)
  const titleCommon = commonTokens(lostItem.title, foundItem.title)
  if (titleCommon >= 2) {
    score += 15
    reasons.push('Similar title')
  } else if (titleCommon >= 1) {
    score += 8
    reasons.push('Title overlap')
  }

  // Description similarity (max 5 pts)
  const descCommon = commonTokens(lostItem.description, foundItem.description)
  if (descCommon >= 3) {
    score += 5
    reasons.push('Similar description')
  }

  // Tag overlap (max 5 pts per overlap, cap at 5 total)
  const lostTags = new Set((lostItem.tags || []).map(t => t.toLowerCase()))
  const foundTags = new Set((foundItem.tags || []).map(t => t.toLowerCase()))
  let tagOverlap = 0
  lostTags.forEach(t => { if (foundTags.has(t)) tagOverlap++ })
  if (tagOverlap > 0) {
    score += Math.min(tagOverlap * 3, 5)
    reasons.push(`${tagOverlap} matching tag${tagOverlap > 1 ? 's' : ''}`)
  }

  return { score: Math.min(score, 100), reasons }
}

export function findMatches(items, minScore = 25) {
  const lostItems = items.filter(i => i.type === 'lost' && i.status === 'open')
  const foundItems = items.filter(i => i.type === 'found' && i.status === 'open')

  const matches = []

  lostItems.forEach(lost => {
    foundItems.forEach(found => {
      const { score, reasons } = computeMatchScore(lost, found)
      if (score >= minScore) {
        matches.push({
          id: `${lost._id}-${found._id}`,
          lostItem: lost,
          foundItem: found,
          score,
          reasons,
          confidence: score >= 70 ? 'high' : score >= 45 ? 'medium' : 'low',
        })
      }
    })
  })

  // Sort by score descending
  matches.sort((a, b) => b.score - a.score)
  return matches
}
