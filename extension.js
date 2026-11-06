const vscode = require('vscode');
const { analyzeText } = require('./analyzer');

/**
 * Регистрирует команду и канал результатов при активации расширения.
 * @param {import('vscode').ExtensionContext} context Контекст расширения.
 */
function activate(context) {
  const output = vscode.window.createOutputChannel('Статистика текста');
  const command = vscode.commands.registerCommand('textStats.analyze', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage('Сначала открой текстовый файл.');
      return;
    }
    // Используется основное выделение; если его нет — весь документ.
    const selection = editor.selection;
    const text = selection.isEmpty
      ? editor.document.getText()
      : editor.document.getText(selection);
    const stats = analyzeText(text);
    output.clear();
    output.appendLine(selection.isEmpty ? 'Область: весь документ' : 'Область: выделение');
    output.appendLine(`Символов: ${stats.characters}`);
    output.appendLine(`Слов: ${stats.words}`);
    output.appendLine(`Строк: ${stats.lines}`);
    output.appendLine(`Уникальных слов: ${stats.unique}`);
    output.appendLine('Самые частые слова:');
    for (const [word, count] of stats.top) {
      output.appendLine(`${word}: ${count}`);
    }
    if (stats.top.length === 0) output.appendLine('Слов не найдено.');
    output.show(true);
  });
  // VS Code освободит команду и канал при выгрузке расширения.
  context.subscriptions.push(command, output);
}
module.exports = { activate };
