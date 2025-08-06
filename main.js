import { migrateAllAndSaveXmls } from './src/index.mjs';

/**
 * 処理対象ファイルのフィルターです。
 *
 * @param {string} name ファイル名（拡張子なし）
 * @returns {boolean} true ならばファイルを処理対象とする
 */
let inputFilter = (name) => {
    // 必要に応じて変更してください。

    return !name.startsWith("OK"); // OK じゃないやつだけ処理

    // return true; // すべてのファイルを処理
}

/**
 * `xml` ディレクトリ内のすべての XML ファイルをマイグレーションして
 * `xml-out` ディレクトリに結果を保存します。
 */
async function main() {
    return migrateAllAndSaveXmls(inputFilter).catch(e => {
        console.error(e);
        process.exit(1);
    });
}

void main();
