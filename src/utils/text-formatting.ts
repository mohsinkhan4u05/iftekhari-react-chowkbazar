/**
 * Converts a string to title case (first letter of each word capitalized)
 * Handles common articles, prepositions, and conjunctions appropriately
 */
export function toTitleCase(str: string): string {
  if (!str) return '';

  // Words that should not be capitalized unless they are the first or last word
  const lowercaseWords = new Set([
    'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 
    'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet'
  ]);

  return str
    .toLowerCase()
    .split(' ')
    .map((word, index, array) => {
      // Always capitalize first and last word
      if (index === 0 || index === array.length - 1) {
        return capitalizeFirstLetter(word);
      }
      
      // Check if word should remain lowercase
      if (lowercaseWords.has(word)) {
        return word;
      }
      
      return capitalizeFirstLetter(word);
    })
    .join(' ');
}

/**
 * Simple title case - capitalizes first letter of each word
 * Use this for simpler cases where you want every word capitalized
 */
export function toSimpleTitleCase(str: string): string {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalizeFirstLetter(word))
    .join(' ');
}

/**
 * Capitalizes the first letter of a string
 */
function capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Formats book title consistently across the application
 * Uses simple title case for book titles
 */
export function formatBookTitle(title: string): string {
  return toSimpleTitleCase(title);
}
