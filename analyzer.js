/**
 * Анализирует текст независимо от VS Code.
 * Слово — последовательность букв Unicode; дефис разделяет слова.
 * Символы считаются как кодовые точки Unicode, включая пробелы и переводы строк.
 * @param {string} text Исходный текст.
 * @returns {{characters: number, words: number, lines: number, unique: number,
 * top: Array<[string, number]>}} Статистика и до пяти самых частых слов.
 */
function analyzeText(text) {
  const words = text.toLowerCase().match(/\p{L}+/gu) || [];
  const frequencies = new Map();
  for (const word of words) {
    frequencies.set(word, (frequencies.get(word) || 0) + 1);
  }
  // Сначала по убыванию частоты, при равенстве — по алфавиту.
  const top = [...frequencies.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ru'))
    .slice(0, 5);
  return {
    characters: [...text].length,
    words: words.length,
    lines: text.length === 0 ? 0 : text.split(/\r\n|\r|\n/).length,
    unique: frequencies.size,
    top
  };
}
module.exports = { analyzeText };
