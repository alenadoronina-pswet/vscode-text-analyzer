const { test } = require('node:test');
const assert = require('node:assert/strict');
const { analyzeText } = require('../analyzer');

test('Пустой текст', () => {
  assert.deepEqual(analyzeText(''), { characters: 0, words: 0, lines: 0, unique: 0, top: [] });
});
test('Частоты, регистр и кириллица', () => {
  const result = analyzeText('Кот кот дом');
  assert.deepEqual(result, { characters: 11, words: 3, lines: 1, unique: 2,
    top: [['кот', 2], ['дом', 1]] });
});
test('Переводы строк и Unicode', () => {
  const result = analyzeText('Я\r\n🙂');
  assert.equal(result.characters, 4);
  assert.equal(result.lines, 2);
  assert.equal(result.words, 1);
});
test('Цифры и пунктуация не являются словами', () => {
  assert.equal(analyzeText('123 — !').words, 0);
  assert.equal(analyzeText('северо-запад').words, 2);
});
test('Не больше пяти результатов и сортировка при равенстве', () => {
  assert.deepEqual(analyzeText('f e d c b a').top,
    [['a', 1], ['b', 1], ['c', 1], ['d', 1], ['e', 1]]);
});
