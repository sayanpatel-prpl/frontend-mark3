/**
 * Strips internal scoring references from AI-generated text.
 * Patterns like "score is 21", "category score of 54", "AI category score is only 54",
 * "Integration score is low (21)", "net sentiment score of -15", etc.
 */
export default function stripScores(text) {
  if (!text || typeof text !== 'string') return text;

  return text
    // "Integration score is low (21)," or "score is 21" or "score is only 54"
    .replace(/\b[\w\s]{0,30}?\bscore\s+is\s+(only\s+)?(low|high|moderate|weak|strong|critical)?\s*\(?\s*-?\d+(\.\d+)?\s*\)?\s*[,;]?\s*/gi, '')
    // "category score of 54" or "net sentiment score of 65" or "score of -15"
    .replace(/\b[\w\s]{0,20}?\bscore\s+of\s+-?\d+(\.\d+)?\s*[,;]?\s*/gi, '')
    // "(score: 21)" standalone
    .replace(/\(\s*score[:\s]*-?\d+(\.\d+)?\s*\)/gi, '')
    // "(21)" when it looks like a parenthetical score after "low" or "high"
    .replace(/\b(low|high|moderate|weak|strong|critical)\s*\(\s*-?\d+(\.\d+)?\s*\)\s*[,;]?\s*/gi, '')
    // Clean up resulting artifacts
    .replace(/;\s*;/g, ';')
    .replace(/,\s*,/g, ',')
    .replace(/\s{2,}/g, ' ')
    .replace(/,\s*\./g, '.')
    .replace(/^\s*[,;]\s*/g, '')
    .replace(/\s*[,;]\s*$/g, '')
    .trim();
}
